import { eras } from '../data/eras'

const nodePositions = [
  { left: 62, top: 39 },
  { left: 36, top: 63 },
  { left: 76, top: 64 },
  { left: 27, top: 39 },
  { left: 67, top: 22 },
  { left: 43, top: 24 },
  { left: 17, top: 57 },
  { left: 84, top: 44 },
  { left: 54, top: 15 },
  { left: 31, top: 80 },
  { left: 71, top: 82 },
  { left: 14, top: 28 },
  { left: 88, top: 25 },
  { left: 22, top: 74 },
  { left: 51, top: 88 },
  { left: 91, top: 70 },
  { left: 9, top: 78 },
  { left: 79, top: 14 },
]

const center = { left: 50, top: 51 }

function ConstellationLines({ nodes }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lineGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(231,229,222,0.85)" />
          <stop offset="55%" stopColor="rgba(201,162,75,0.32)" />
          <stop offset="100%" stopColor="rgba(201,162,75,0)" />
        </radialGradient>
      </defs>
      {nodes.map((node, i) => (
        <line
          key={node.id}
          x1={center.left}
          y1={center.top}
          x2={node.left}
          y2={node.top}
          stroke={node.open ? 'rgba(201,162,75,0.42)' : 'rgba(231,229,222,0.16)'}
          strokeWidth={node.open ? 0.22 : 0.12}
          strokeDasharray={node.open ? '1.2 1.4' : '0.6 1.8'}
          style={{ animationDelay: `${i * 0.34}s` }}
          className="cosmic-line"
        />
      ))}
      {nodes.map((node, i) => {
        const next = nodes[(i + 2) % nodes.length]
        return (
          <line
            key={`${node.id}-${next.id}`}
            x1={node.left}
            y1={node.top}
            x2={next.left}
            y2={next.top}
            stroke="rgba(231,229,222,0.12)"
            strokeWidth="0.08"
            strokeDasharray="0.35 1.35"
            style={{ animationDelay: `${i * 0.42 + 0.2}s` }}
            className="cosmic-line"
          />
        )
      })}
      <circle cx={center.left} cy={center.top} r="28" fill="none" stroke="url(#lineGlow)" strokeWidth="0.12" opacity="0.55" />
      <circle cx={center.left} cy={center.top} r="18" fill="none" stroke="rgba(231,229,222,0.16)" strokeWidth="0.1" strokeDasharray="0.8 1.6" />
    </svg>
  )
}

function CosmicCore() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[51%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 md:h-[36rem] md:w-[36rem]">
      <div className="cosmic-orbit cosmic-orbit-a absolute inset-[8%] rounded-full" />
      <div className="cosmic-orbit cosmic-orbit-b absolute inset-[20%] rounded-full" />
      <div className="cosmic-dust absolute inset-[6%] rounded-full" />
      <div className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_38%_34%,rgba(247,230,185,0.96),rgba(201,162,75,0.56)_28%,rgba(73,88,126,0.36)_52%,rgba(12,11,14,0.1)_72%,transparent_76%)] shadow-[0_0_64px_rgba(201,162,75,0.24),0_0_140px_rgba(88,111,164,0.18)]" />
      <div className="absolute left-1/2 top-1/2 h-[12%] w-[12%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-100 shadow-[0_0_34px_rgba(231,229,222,0.88)]" />
    </div>
  )
}

function EraNode({ era, position, onSelect }) {
  const open = era.status === 'open'

  return (
    <button
      onClick={() => open && onSelect(era)}
      style={{ left: `${position.left}%`, top: `${position.top}%` }}
      className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 text-left ${
        open ? 'cursor-pointer' : 'cursor-default'
      }`}
      aria-label={`${era.title}${open ? '，进入展厅' : '，即将开放'}`}
    >
      <span className="relative flex h-16 w-16 items-center justify-center md:h-20 md:w-20">
        <span
          className={`era-planet ${open ? '' : 'era-planet-muted'}`}
          style={{ '--era-accent': era.accent }}
        >
          <span className="era-planet-dust" />
          <span className="era-planet-core" />
        </span>
      </span>

      <span
        className={`pointer-events-none absolute left-1/2 top-16 z-20 min-w-36 -translate-x-1/2 whitespace-nowrap text-center transition-all duration-300 md:top-20 ${
          open ? 'opacity-100' : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
        }`}
      >
        <span
          className={`block font-serif ${open ? 'text-base text-stone-100' : 'text-sm text-stone-300'}`}
        >
          {era.title}
        </span>
        <span className="block text-[11px] tracking-[0.18em] text-stone-500">
          {era.period} / {era.place}
        </span>
        {!open && (
          <span className="block text-[10px] tracking-[0.28em] text-stone-600">即将开放</span>
        )}
      </span>
    </button>
  )
}

function CosmicOpening({ onSelect }) {
  const nodes = eras.map((era, index) => ({
    ...era,
    ...nodePositions[index % nodePositions.length],
    open: era.status === 'open',
  }))

  return (
    <div className="relative mx-auto h-[58vh] min-h-[420px] w-full max-w-[1500px] md:h-[66vh]">
      <div className="cosmic-starfield absolute inset-0 opacity-90" />
      <div className="cosmic-thread-stars absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,rgba(201,162,75,0.16),transparent_28%),radial-gradient(ellipse_at_46%_58%,rgba(68,82,130,0.24),transparent_48%)]" />
      <ConstellationLines nodes={nodes} />
      <CosmicCore />
      {nodes.map((era) => (
        <EraNode key={era.id} era={era} position={era} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default function HomePage({ onSelect, memory, onMemoryChange, onPassport, stampCount = 0 }) {
  const openCount = eras.filter((e) => e.status === 'open').length
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-ink">
      <button
        onClick={onPassport}
        className="fixed left-5 top-5 z-40 min-h-11 rounded-full border border-amber/25 bg-ink/72 px-5 py-2 text-xs tracking-[0.16em] text-stone-300 backdrop-blur transition-colors hover:border-amber/60 hover:text-amber"
      >
        探索护照{stampCount > 0 ? ` / ${stampCount}` : ''}
      </button>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(201,162,75,0.16),transparent_46%),linear-gradient(180deg,rgba(8,8,12,0.04),rgba(12,11,14,0.86)_88%)]" />
      <div className="pointer-events-none absolute inset-0 cosmic-faint-lines opacity-55" />

      <div className="pointer-events-none relative z-20 mx-auto max-w-4xl px-6 pt-20 text-center fade-up md:pt-14">
        <p className="mb-4 text-xs tracking-[0.42em] text-amber/75">
          时音馆 / SONIC TIME MACHINE
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-stone-100 md:text-6xl">
          你想去哪个音乐时空？
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-400 md:text-base">
          选中一颗发光坐标，进入被音乐、地点与年代重建的宇宙。
        </p>

        <div className="pointer-events-auto mx-auto mt-6 max-w-xl">
          <input
            type="text"
            value={memory}
            onChange={(e) => onMemoryChange(e.target.value)}
            placeholder="（可选）说一句你的音乐记忆，馆长会把你写进展厅…"
            className="min-h-11 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-center text-sm text-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-stone-500 focus:border-amber/50 focus:outline-none"
          />
        </div>
      </div>

      <CosmicOpening onSelect={onSelect} />

      <p className="relative z-10 px-6 pb-8 text-center text-xs tracking-[0.18em] text-stone-600">
        当前开放 {openCount} 座展厅 / 更多时空陆续解锁
      </p>
    </div>
  )
}
