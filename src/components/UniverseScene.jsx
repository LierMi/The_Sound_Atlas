import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { eras } from '../data/eras'

const FRONT = Math.PI / 2 // 正前方（朝相机，+z）的角度

// 移动端 / 触屏弱机检测：减粒子、降 dpr，保帧率
const MOBILE =
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || window.matchMedia?.('(pointer: coarse)').matches)

// 布局：已做 demo（status:open）摆在最前排、最大最亮；其余沿外圈散开、黯淡
function useLayout() {
  return useMemo(() => {
    const openEras = eras.filter((e) => e.status === 'open')
    const soonEras = eras.filter((e) => e.status !== 'open')
    const nodes = []

    const openAngles =
      openEras.length === 2
        ? [FRONT - 0.36, FRONT + 0.36]
        : openEras.map((_, i) => FRONT + (i - (openEras.length - 1) / 2) * 0.7)
    openEras.forEach((era, i) => {
      const angle = openAngles[i] ?? FRONT
      nodes.push({ era, open: true, baseAngle: angle, radius: 6.6, y: i % 2 ? -0.3 : 0.3, size: 0.95 })
    })

    const total = soonEras.length
    soonEras.forEach((era, i) => {
      const t = (i + 0.5) / total
      const angle = FRONT + 1.0 + t * (Math.PI * 2 - 2.0) // 跳过正前方缺口，留给 demo
      const radius = 9.6 + ((i * 1.7) % 7)
      const y = Math.sin(i * 1.7) * 1.7
      nodes.push({ era, open: false, baseAngle: angle, radius, y, size: 0.42 })
    })

    nodes.forEach((n) => {
      n.position = [Math.cos(n.baseAngle) * n.radius, n.y, Math.sin(n.baseAngle) * n.radius]
    })
    return nodes
  }, [])
}

// 星网：每颗连到最近的 2 颗，织成丝线
function useEdges(nodes) {
  return useMemo(() => {
    const dist = (a, b) =>
      Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
    const edges = []
    const seen = new Set()
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: dist(a.position, b.position) }))
        .filter((o) => o.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2)
      near.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push({
          points: [nodes[i].position, nodes[j].position],
          warm: nodes[i].open || nodes[j].open,
        })
      })
    })
    return edges
  }, [nodes])
}

function Threads({ edges }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(edges.length * 6)
    const col = new Float32Array(edges.length * 6)
    const warm = new THREE.Color('#c9a24b')
    const cool = new THREE.Color('#8a90a0')
    edges.forEach((e, i) => {
      const [a, b] = e.points
      pos.set([a[0], a[1], a[2], b[0], b[1], b[2]], i * 6)
      const c = e.warm ? warm : cool
      const k = e.warm ? 0.75 : 0.3 // 亮度编码连接强度
      col.set([c.r * k, c.g * k, c.b * k, c.r * k, c.g * k, c.b * k], i * 6)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    return g
  }, [edges])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// 浑天仪刻度环：星系平面上一圈带刻度的方位盘（复古天文仪器感）
function DialRing({ radius = 13.5, ticks = 96 }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(ticks * 6)
    for (let i = 0; i < ticks; i++) {
      const a = (i / ticks) * Math.PI * 2
      const major = i % 8 === 0
      const r1 = radius
      const r2 = radius - (major ? 0.6 : 0.28)
      pos.set(
        [Math.cos(a) * r1, 0, Math.sin(a) * r1, Math.cos(a) * r2, 0, Math.sin(a) * r2],
        i * 6
      )
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [radius, ticks])
  return (
    <group>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#c9a24b" transparent opacity={0.32} depthWrite={false} />
      </lineSegments>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 180]} />
        <meshBasicMaterial color="#c9a24b" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// 倾斜的椭圆轨道线（浑天仪轨道）
function TiltRing({ radius, rotation, opacity = 0.12 }) {
  return (
    <mesh rotation={rotation}>
      <ringGeometry args={[radius - 0.018, radius + 0.018, 160]} />
      <meshBasicMaterial color="#c9a24b" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  )
}

// 一颗时代节点：统一的白色发光小光点（偏一点点淡黄），open 大而亮、soon 小而暗
const DOT_COLOR = '#fff4d8' // 白 + 一点点暖
function Planet({ node, frontId, onPick }) {
  const { era, open, position } = node
  const [hovered, setHovered] = useState(false)
  const isFront = frontId === era.id

  const dot = open ? 0.17 : 0.13 // 都小；open 只比其它大一点点
  const scale = (isFront ? 1.5 : 1) * (hovered ? 1.25 : 1)
  const haloOpacity = (open ? 0.2 : 0.1) + (isFront ? 0.12 : 0)

  return (
    <group position={position}>
      <group scale={scale}>
        {/* 命中区（透明，便于点击小光点） */}
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onPick(node)
          }}
        >
          <sphereGeometry args={[Math.max(dot * 2.6, 0.62), 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {/* 光点本体（不受色调映射影响，配 Bloom 强发光） */}
        <mesh>
          <sphereGeometry args={[dot, 24, 24]} />
          <meshBasicMaterial color={DOT_COLOR} toneMapped={false} />
        </mesh>
        {/* 柔光晕 */}
        <mesh>
          <sphereGeometry args={[dot * 2.4, 20, 20]} />
          <meshBasicMaterial
            color={DOT_COLOR}
            transparent
            opacity={haloOpacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 标签（常显，不靠 hover）/ 进入按钮 */}
      <Html center distanceFactor={14} position={[0, dot * scale + 0.5, 0]} zIndexRange={[20, 0]}>
          <div className="-translate-y-1 select-none whitespace-nowrap text-center">
            <div
              className={`font-serif ${open ? 'text-[15px] text-stone-100' : 'text-[13px] text-stone-300'}`}
              style={{ textShadow: '0 1px 12px rgba(0,0,0,0.92)' }}
            >
              {era.title}
            </div>
            <div className="text-[10px] tracking-[0.2em] text-stone-400">
              {era.period} / {era.place}
            </div>
            {isFront && open && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPick(node)
                }}
                className="pointer-events-auto mt-1.5 rounded-full border border-amber/60 bg-ink/70 px-3 py-1 text-[11px] tracking-[0.2em] text-amber backdrop-blur transition-colors hover:bg-amber/15"
              >
                ▶ 进入展厅
              </button>
            )}
            {isFront && !open && (
              <div className="mt-0.5 text-[9px] tracking-[0.3em] text-stone-500">即将开放</div>
            )}
          </div>
        </Html>
    </group>
  )
}

// 点击进入后，镜头一路加速俯冲进那颗星球（时间驱动 + ease-in 加速感）
const DIVE_DUR = 0.95 // 秒
function Dive({ dive, controlsRef }) {
  const { camera } = useThree()
  const from = useRef(null)
  const start = useRef(0)
  const target = useMemo(() => new THREE.Vector3(), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  useFrame((s) => {
    if (!dive) {
      from.current = null
      return
    }
    if (!from.current) {
      from.current = camera.position.clone()
      start.current = s.clock.elapsedTime
    }
    const p = Math.min(1, (s.clock.elapsedTime - start.current) / DIVE_DUR)
    const ease = Math.pow(p, 2.2) // 越靠近越快，像被吸进去
    target.set(dive[0], dive[1], dive[2])
    goal.lerpVectors(from.current, target, ease * 0.94) // 收在星球表面内一点，铺满画面
    camera.position.copy(goal)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, Math.min(1, p * 1.5))
      controlsRef.current.update()
    }
  })
  return null
}

function Scene({ onSelect, onEnterStart }) {
  const nodes = useLayout()
  const edges = useEdges(nodes)
  const controlsRef = useRef()
  const galaxyRef = useRef()
  const targetRot = useRef(0)
  const [frontId, setFrontId] = useState(null)
  const [dive, setDive] = useState(null)

  // 把整个星系平滑旋转到目标角度（点击带星球到正前方）
  useFrame(() => {
    if (!galaxyRef.current || dive) return
    galaxyRef.current.rotation.y = THREE.MathUtils.lerp(galaxyRef.current.rotation.y, targetRot.current, 0.08)
  })

  const pick = (node) => {
    if (dive) return
    if (frontId === node.era.id && node.open) {
      // 已在最前的开放展厅 → 俯冲飞入并进入
      setDive([0, node.y, node.radius]) // 它在最前时的世界坐标
      if (controlsRef.current) controlsRef.current.enabled = false
      onEnterStart?.(node.era) // 通知开屏页起转场遮罩
      setTimeout(() => onSelect(node.era), DIVE_DUR * 1000 - 70)
      return
    }
    // 否则：旋转星系，把这颗拉到最前方
    const cur = galaxyRef.current ? galaxyRef.current.rotation.y : 0
    let d = FRONT - node.baseAngle - cur
    d = ((d + Math.PI) % (Math.PI * 2)) - Math.PI // 取最短路径
    targetRot.current = cur + d
    setFrontId(node.era.id)
  }

  return (
    <>
      <color attach="background" args={['#06060a']} />
      <fog attach="fog" args={['#06060a', 24, 50]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={1.6} distance={42} color="#ffe9b0" />

      <Stars radius={90} depth={55} count={MOBILE ? 1800 : 3800} factor={3.6} saturation={0} fade speed={0.5} />

      {/* 星系本体：尘埃 + 丝线 + 星球，一起随点击旋转 */}
      <group ref={galaxyRef}>
        <GalaxyDust />
        <DialRing radius={13.5} />
        <TiltRing radius={8} rotation={[Math.PI / 2.2, 0.3, 0]} opacity={0.14} />
        <TiltRing radius={11} rotation={[Math.PI / 1.9, -0.4, 0.5]} opacity={0.1} />
        <Threads edges={edges} />
        {nodes.map((node) => (
          <Planet key={node.era.id} node={node} frontId={frontId} onPick={pick} />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={9}
        maxDistance={30}
        enableDamping
        dampingFactor={0.06}
        maxPolarAngle={Math.PI * 0.84}
        minPolarAngle={Math.PI * 0.18}
      />
      <Dive dive={dive} controlsRef={controlsRef} />

      <EffectComposer>
        <Bloom intensity={MOBILE ? 0.7 : 0.9} luminanceThreshold={0.2} luminanceSmoothing={0.5} mipmapBlur />
        <Vignette eskil={false} offset={0.26} darkness={0.86} />
      </EffectComposer>
      <AdaptiveDpr pixelated={false} />
    </>
  )
}

// 螺旋星系尘埃（GPU 粒子），金→蓝由内到外渐变
function GalaxyDust({ count = MOBILE ? 1300 : 2600 }) {
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const inner = new THREE.Color('#f3d98c')
    const outer = new THREE.Color('#586ea8')
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 0.65) * 18
      const branch = ((i % 3) / 3) * Math.PI * 2
      const angle = branch + r * 0.34
      const scatter = () => (Math.random() - 0.5) * Math.pow(Math.random(), 2) * 2.4
      positions[i * 3] = Math.cos(angle) * r + scatter()
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.9 * (1 - r / 24)
      positions[i * 3 + 2] = Math.sin(angle) * r + scatter()
      const c = inner.clone().lerp(outer, Math.min(1, r / 17))
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [count])

  return (
    <points geometry={geo}>
      <pointsMaterial
        size={0.075}
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </points>
  )
}

export default function UniverseScene({ onSelect, onEnterStart }) {
  return (
    <Canvas
      dpr={[1, MOBILE ? 1.5 : 2]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 7, 19], fov: 52 }}
      gl={{ antialias: !MOBILE, powerPreference: 'high-performance' }}
    >
      <Scene onSelect={onSelect} onEnterStart={onEnterStart} />
    </Canvas>
  )
}
