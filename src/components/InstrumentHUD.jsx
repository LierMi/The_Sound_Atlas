// 复古天文仪器 HUD：刻度方位环 / 准星 / 角落括号 / 坐标注释 / 颗粒扫描线
// 整层 pointer-events:none，事件穿透到下面的 3D 画布

const GOLD = '#c9a24b'

// 刻度方位环（静态，带度数）
function Bezel() {
  const N = 72 // 每 5°
  return (
    <svg
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: '94vmin', height: '94vmin' }}
      viewBox="0 0 1000 1000"
      fill="none"
    >
      <circle cx="500" cy="500" r="478" stroke={GOLD} strokeOpacity="0.22" strokeWidth="1" />
      <circle cx="500" cy="500" r="430" stroke={GOLD} strokeOpacity="0.12" strokeWidth="1" />
      <circle
        cx="500"
        cy="500"
        r="356"
        stroke={GOLD}
        strokeOpacity="0.1"
        strokeWidth="1"
        strokeDasharray="2 8"
      />
      {Array.from({ length: N }, (_, i) => {
        const ang = (i / N) * Math.PI * 2 - Math.PI / 2
        const major = i % 6 === 0
        const r1 = 478
        const r2 = major ? 452 : 466
        return (
          <line
            key={i}
            x1={500 + Math.cos(ang) * r1}
            y1={500 + Math.sin(ang) * r1}
            x2={500 + Math.cos(ang) * r2}
            y2={500 + Math.sin(ang) * r2}
            stroke={GOLD}
            strokeOpacity={major ? 0.5 : 0.24}
            strokeWidth={major ? 1.6 : 0.8}
          />
        )
      })}
      {Array.from({ length: 12 }, (_, k) => {
        const ang = (k / 12) * Math.PI * 2 - Math.PI / 2
        const r = 412
        return (
          <text
            key={k}
            x={500 + Math.cos(ang) * r}
            y={500 + Math.sin(ang) * r}
            fill={GOLD}
            fillOpacity="0.45"
            fontSize="13"
            fontFamily="monospace"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {String(k * 30).padStart(3, '0')}
          </text>
        )
      })}
    </svg>
  )
}

// 缓慢旋转的内刻度环（机械感）
function RotorRing() {
  const N = 120
  return (
    <svg
      className="instr-rotate absolute left-1/2 top-1/2"
      style={{ width: '64vmin', height: '64vmin' }}
      viewBox="0 0 1000 1000"
      fill="none"
    >
      <circle cx="500" cy="500" r="490" stroke={GOLD} strokeOpacity="0.14" strokeWidth="1" />
      {Array.from({ length: N }, (_, i) => {
        const ang = (i / N) * Math.PI * 2
        const major = i % 10 === 0
        const r1 = 490
        const r2 = major ? 470 : 482
        return (
          <line
            key={i}
            x1={500 + Math.cos(ang) * r1}
            y1={500 + Math.sin(ang) * r1}
            x2={500 + Math.cos(ang) * r2}
            y2={500 + Math.sin(ang) * r2}
            stroke={GOLD}
            strokeOpacity={major ? 0.32 : 0.14}
            strokeWidth="0.8"
          />
        )
      })}
    </svg>
  )
}

// 中心准星
function Crosshair() {
  return (
    <svg
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: '94vmin', height: '94vmin' }}
      viewBox="0 0 1000 1000"
      fill="none"
    >
      <line x1="500" y1="40" x2="500" y2="200" stroke={GOLD} strokeOpacity="0.2" strokeWidth="1" />
      <line x1="500" y1="800" x2="500" y2="960" stroke={GOLD} strokeOpacity="0.2" strokeWidth="1" />
      <line x1="40" y1="500" x2="200" y2="500" stroke={GOLD} strokeOpacity="0.2" strokeWidth="1" />
      <line x1="800" y1="500" x2="960" y2="500" stroke={GOLD} strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="500" cy="500" r="20" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="500" cy="500" r="3" fill={GOLD} fillOpacity="0.6" />
    </svg>
  )
}

// 小标靶（散落几处，呼应参考图）
function Reticle({ className, size = 64 }) {
  return (
    <svg
      className={`absolute ${className}`}
      style={{ width: size, height: size }}
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="34" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="22" stroke={GOLD} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
      <line x1="50" y1="6" x2="50" y2="22" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.4" />
      <line x1="50" y1="78" x2="50" y2="94" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.4" />
      <line x1="6" y1="50" x2="22" y2="50" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.4" />
      <line x1="78" y1="50" x2="94" y2="50" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="2.5" fill={GOLD} fillOpacity="0.7" />
    </svg>
  )
}

// 角落 L 形括号
function Corners() {
  const b = 'absolute h-10 w-10 border-amber/30'
  return (
    <>
      <span className={`${b} left-4 top-4 border-l border-t`} />
      <span className={`${b} right-4 top-4 border-r border-t`} />
      <span className={`${b} left-4 bottom-4 border-l border-b`} />
      <span className={`${b} right-4 bottom-4 border-r border-b`} />
    </>
  )
}

export default function InstrumentHUD() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden font-mono">
      <Bezel />
      <RotorRing />
      <Crosshair />
      <Corners />

      <Reticle className="right-[12%] top-[20%]" size={58} />
      <Reticle className="left-[9%] top-[44%]" size={44} />

      {/* 左下：星图编目 */}
      <div className="absolute bottom-24 left-6 space-y-0.5 text-[10px] leading-relaxed text-amber/45">
        <p className="tracking-[0.3em] text-amber/60">星 图 编 目 · STELLAR CATALOG</p>
        <p>SECTOR / 声音星图 SOUND-ATLAS</p>
        <p>OPEN ▣ 02 &nbsp; LOCKED ▢ 16</p>
        <p className="text-amber/30">— drag · zoom · select —</p>
      </div>

      {/* 右中：仪表读数 */}
      <div className="absolute right-6 top-[34%] space-y-0.5 text-right text-[10px] leading-relaxed text-amber/45">
        <p className="tracking-[0.3em] text-amber/60">AZ 114.2° · ALT 22.3°</p>
        <p>FREQ 1983 — 2008</p>
        <p>SIG ▮▮▮▮▯ STABLE</p>
      </div>

      {/* 颗粒 + 扫描线，做旧 */}
      <div className="instr-grain absolute inset-0" />
      <div className="instr-scan absolute inset-0" />
    </div>
  )
}
