import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchPreview } from '../lib/preview'
import { eras, serialOf } from '../data/eras'

// 展厅编号：按时空在「已开放」列表中的次序（港乐 01 / 千禧中国风 02…）
const openEras = eras.filter((e) => e.status === 'open')
const hallNoOf = (era) =>
  String((openEras.findIndex((e) => e.id === era.id) + 1) || 1).padStart(2, '0')

// 展品封面：保留专辑封面；播放时叠加一张旋转黑胶
function Vinyl({ item, active = false }) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl transition-all duration-300 ${
        active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
      style={{
        background:
          'repeating-radial-gradient(circle at center, #1a1a1d 0 2px, #070708 2px 4px, #222228 4px 5px)',
        animation: active ? 'vinylSpin 4.8s linear infinite' : undefined,
      }}
    >
      <div className="absolute inset-[9%] rounded-full border border-white/10" />
      <div className="absolute inset-[20%] rounded-full border border-white/5" />
      <div
        className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-inner"
        style={{ background: item.accent }}
      >
        <span className="font-serif text-xs font-semibold text-ink">{item.year}</span>
      </div>
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-black/40" />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_28%,transparent_62%,rgba(255,255,255,0.08))]" />
    </div>
  )
}

// 唱臂：SVG 绘制（封面为正方形，viewBox 0-100 不变形），唱针准确落在唱片凹槽上
function Tonearm({ active = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute inset-0 z-20 h-full w-full transition-all duration-500 ease-out ${
        active ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
      }`}
      style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.6))' }}
    >
      {/* 配重（转轴后端）—— 黑色金属 + 顶面高光 */}
      <rect x="88.3" y="8.4" width="8.6" height="8" rx="2.4" fill="#17171a" stroke="#000000" strokeWidth="0.4" />
      <rect x="88.7" y="9.1" width="7.8" height="1.3" rx="0.65" fill="#55555d" opacity="0.7" />
      {/* 臂管：黑色光泽管（深底 + 中调 + 细镜面高光线） */}
      <line x1="85.5" y1="14.5" x2="60.5" y2="34" stroke="#0d0d0f" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="85.5" y1="14.5" x2="60.5" y2="34" stroke="#3a3a40" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="84.8" y1="15.5" x2="61.4" y2="33.4" stroke="#74747d" strokeWidth="0.45" strokeLinecap="round" opacity="0.75" />
      {/* 唱头 / 头壳 —— 黑色塑壳 + 一丝金属反光 */}
      <g transform="rotate(39 59 34)">
        <rect x="54.6" y="31.1" width="8" height="5.6" rx="1" fill="#131316" stroke="#000000" strokeWidth="0.4" />
        <rect x="55.2" y="31.6" width="6.8" height="0.9" rx="0.45" fill="#52525a" opacity="0.6" />
      </g>
      {/* 唱针：落在唱片凹槽——深色座 + 极小金属尖 */}
      <circle cx="60.5" cy="35.6" r="0.95" fill="#08080a" />
      <circle cx="60.5" cy="35.6" r="0.34" fill="#9a9aa2" opacity="0.85" />
      {/* 转轴底座（压在臂根上方）—— 黑色金属盘 + 银环 + 顶面高光 */}
      <circle cx="86" cy="14" r="6.6" fill="#15151a" stroke="#3c3c42" strokeWidth="0.8" />
      <circle cx="86" cy="14" r="3" fill="#0b0b0d" stroke="#57575f" strokeWidth="0.5" />
      <circle cx="84.2" cy="12.3" r="1.1" fill="#5a5a62" opacity="0.5" />
    </svg>
  )
}

// 正在播放：跳动的声波均衡器（错相 4 条）
function Equalizer() {
  return (
    <span className="flex h-3 items-end gap-[2px]">
      {[0, 0.18, 0.36, 0.12].map((d, i) => (
        <i
          key={i}
          className="eq-bar block h-3 w-[2px] rounded-sm bg-amber"
          style={{ animationDelay: `${d}s` }}
        />
      ))}
    </span>
  )
}

// 正在播放徽标：滚动展品行时也能一眼看出哪件在响
function NowPlayingBadge() {
  return (
    <div className="pointer-events-none absolute left-3 top-3 z-30 flex items-center gap-2 rounded-full border border-amber/30 bg-ink/75 px-3 py-1.5 backdrop-blur-sm">
      <Equalizer />
      <span className="text-[10px] font-medium tracking-[0.22em] text-amber">正在播放</span>
    </div>
  )
}

// hover 时封面中央浮出的播放提示（未播放时才出现）
function CoverHint({ isPlaying }) {
  if (isPlaying) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber/60 bg-ink/55 text-xl text-amber backdrop-blur-sm">
        ▶
      </span>
    </div>
  )
}

function Cover({ item, isPlaying, onToggle }) {
  if (item.cover) {
    return (
      <div
        onClick={onToggle}
        className="relative mb-6 mt-5 aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-ink"
      >
        <img
          src={item.cover}
          alt={item.song}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            isPlaying ? 'scale-105 opacity-45 saturate-75' : 'opacity-100'
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
        <Vinyl item={item} active={isPlaying} />
        <Tonearm active={isPlaying} />
        {isPlaying && <NowPlayingBadge />}
        <CoverHint isPlaying={isPlaying} />
      </div>
    )
  }
  return (
    <div
      onClick={onToggle}
      className="relative mb-6 mt-5 aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-charcoal to-ink"
    >
      {/* 黑胶唱片 */}
      <div
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-[1400ms] ease-out group-hover:rotate-[160deg]"
        style={{
          background:
            'repeating-radial-gradient(circle at center, #1b1b20 0 2px, #0d0d10 2px 4px)',
          animation: isPlaying ? 'vinylSpin 4.8s linear infinite' : undefined,
        }}
      >
        {/* 中心标签 */}
        <div
          className="absolute left-1/2 top-1/2 flex h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-inner"
          style={{ background: item.accent }}
        >
          <span className="font-serif text-sm font-semibold text-ink">{item.year}</span>
        </div>
        {/* 中心轴孔 */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-black/40" />
      </div>
      {/* 高光 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.07),transparent_55%)]" />
      <Tonearm active={isPlaying} />
      {isPlaying && <NowPlayingBadge />}
      <CoverHint isPlaying={isPlaying} />
    </div>
  )
}

// 2D 示意路线图：按大致方位摆站，折线串联，科幻/机械风（网格+刻度边框+罗盘+准星）
function RouteMap({ stops, active, setActive, accent }) {
  const pts = stops.map((s) => `${s.map?.x ?? 50},${s.map?.y ?? 50}`).join(' ')
  const grid = [20, 40, 60, 80]
  const edgeTicks = Array.from({ length: 21 }, (_, i) => i * 5)
  return (
    <div className="relative px-7 pt-6">
      <div
        className="relative w-full overflow-hidden rounded-xl border border-amber/20 bg-ink/60"
        style={{ aspectRatio: '16 / 10' }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* 网格 */}
          {grid.map((g) => (
            <g key={g}>
              <line x1={g} y1="0" x2={g} y2="100" stroke="#c9a24b" strokeOpacity="0.07" strokeWidth="0.25" />
              <line x1="0" y1={g} x2="100" y2={g} stroke="#c9a24b" strokeOpacity="0.07" strokeWidth="0.25" />
            </g>
          ))}
          {/* 中心十字 */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#c9a24b" strokeOpacity="0.13" strokeWidth="0.25" strokeDasharray="1 2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#c9a24b" strokeOpacity="0.13" strokeWidth="0.25" strokeDasharray="1 2" />
          {/* 边框刻度 */}
          {edgeTicks.map((x) => {
            const major = x % 20 === 0
            return (
              <g key={x}>
                <line x1={x} y1="0" x2={x} y2={major ? 3 : 1.6} stroke="#c9a24b" strokeOpacity="0.3" strokeWidth="0.25" />
                <line x1={x} y1="100" x2={x} y2={major ? 97 : 98.4} stroke="#c9a24b" strokeOpacity="0.3" strokeWidth="0.25" />
              </g>
            )
          })}
          {/* 路线折线（流动虚线） */}
          <polyline
            className="route-flow"
            points={pts}
            fill="none"
            stroke={accent}
            strokeOpacity="0.8"
            strokeWidth="0.32"
            strokeDasharray="1.3 1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 罗盘方位 */}
        <span className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 font-mono text-[9px] tracking-widest text-amber/50">N</span>
        <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-amber/50">S</span>
        <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-amber/50">W</span>
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-amber/50">E</span>

        {/* 角落括号 */}
        <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-amber/40" />
        <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-amber/40" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-amber/40" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-amber/40" />

        {/* 站点节点 */}
        {stops.map((s, i) => {
          const on = i === active
          const p = s.map || { x: 50, y: 50 }
          const below = p.y < 70
          return (
            <button
              key={s.no}
              onClick={() => setActive(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {on && (
                <span
                  className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border"
                  style={{ borderColor: accent, boxShadow: `0 0 10px ${accent}` }}
                />
              )}
              <span
                className="relative block h-2.5 w-2.5 rounded-full border"
                style={{
                  borderColor: accent,
                  background: on ? accent : '#0c0b0e',
                  boxShadow: on ? `0 0 8px 2px ${accent}` : 'none',
                }}
              />
              <span
                className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[15px] font-semibold leading-none ${below ? 'top-4' : 'bottom-4'}`}
                style={{ color: on ? '#fdfcf9' : '#d6d3cd', textShadow: '0 1px 6px #000, 0 0 3px #000' }}
              >
                <span className="mr-1 font-mono text-[11px] text-amber/80">{s.no}</span>
                {s.place}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-center font-mono text-[9px] tracking-[0.25em] text-stone-600">
        声音漫游路线图 · ROUTE MAP（示意方位）
      </p>
    </div>
  )
}

// 详细路线弹窗：2D 路线图 + 选中站的展开叙述 + 途经地点
function RouteModal({ era, stops, active, setActive, onClose }) {
  const stop = stops[active]
  if (!stop) return null
  const accent = era.accent
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border border-amber/25 bg-charcoal/95 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cosmic-starfield pointer-events-none absolute inset-0 opacity-25" />

        {/* 头部 */}
        <div className="relative flex items-start justify-between border-b border-white/10 px-7 py-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-amber/80">详细路线 · ITINERARY</p>
            <h3 className="mt-1.5 font-serif text-2xl text-stone-100">
              {era.routeTitle || '跟着音乐去旅行'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-2xl leading-none text-stone-400 transition-colors hover:text-amber"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 2D 示意路线图 */}
        <RouteMap stops={stops} active={active} setActive={setActive} accent={accent} />

        {/* 选中站详情 */}
        <div className="relative px-7 py-6">
          <div className="flex items-center justify-between">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 bg-[#efe4cc] font-serif text-sm font-semibold"
              style={{ borderColor: accent, color: accent }}
            >
              {stop.no}
            </span>
            <span className="font-mono text-[10px] tracking-[0.22em] text-stone-500">
              {stop.coord} · {stop.time}
            </span>
          </div>

          <p className="mt-4 text-xs tracking-[0.26em] text-amber/75">{stop.place}</p>
          <h4 className="mt-1.5 font-serif text-2xl font-semibold text-stone-100">{stop.title}</h4>
          <p className="mt-2 flex items-center gap-2 text-sm text-amber/80">
            <span>♪</span>
            {stop.cue}
          </p>

          <p className="mt-5 text-[15px] leading-loose text-stone-200">{stop.detail || stop.note}</p>

          {stop.landmarks?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-stone-500">途经 · WAYPOINTS</p>
              <div className="flex flex-wrap gap-2">
                {stop.landmarks.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-amber/25 px-3 py-1 text-xs text-stone-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 上一站 / 下一站 */}
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
            <button
              onClick={() => setActive(active - 1)}
              disabled={active === 0}
              className="text-sm text-stone-400 transition-colors hover:text-amber disabled:opacity-30 disabled:hover:text-stone-400"
            >
              ← 上一站
            </button>
            <span className="font-mono text-[10px] tracking-[0.3em] text-stone-600">
              {String(active + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
            </span>
            <button
              onClick={() => setActive(active + 1)}
              disabled={active === stops.length - 1}
              className="text-sm text-stone-400 transition-colors hover:text-amber disabled:opacity-30 disabled:hover:text-stone-400"
            >
              下一站 →
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function TravelRoute({ era, onIntent }) {
  const stops = era.routeStops || []
  const [active, setActive] = useState(null)
  if (!stops.length) return null

  return (
    <section className="mt-12 fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber/60" />
            <span className="text-xs uppercase tracking-[0.3em] text-amber/80">下一站</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-stone-100 md:text-4xl">
            {era.routeTitle || '跟着音乐去旅行'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400">
            {era.routeSubtitle}
          </p>
        </div>
        <div className="rounded-full border border-amber/30 px-4 py-2 text-xs tracking-[0.22em] text-amber/80">
          点击站点 · 查看详细路线
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-amber/15 bg-charcoal/55 p-5 md:p-6">
        <div className="pointer-events-none absolute inset-x-8 top-[5.4rem] hidden h-px bg-gradient-to-r from-amber/0 via-amber/35 to-amber/0 md:block" />
        <div className="grid gap-4 md:grid-cols-4">
          {stops.map((stop, i) => (
            <button
              key={stop.no}
              onClick={() => setActive(i)}
              className="group relative rounded-xl border border-white/8 bg-ink/55 p-5 text-left shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:bg-ink/75"
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-[#efe4cc] font-serif text-sm font-semibold"
                  style={{ borderColor: era.accent, color: era.accent }}
                >
                  {stop.no}
                </span>
                <span className="text-[10px] tracking-[0.22em] text-stone-500">{stop.time}</span>
              </div>
              <p className="text-xs tracking-[0.26em] text-amber/75">{stop.place}</p>
              <h3 className="mt-2 font-serif text-xl font-semibold leading-tight text-stone-100">
                {stop.title}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-stone-500">{stop.cue}</p>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">{stop.note}</p>
              <span className="mt-4 inline-block text-xs text-amber/0 transition-colors group-hover:text-amber/80">
                查看详细路线 →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 文旅/票务导流（商业入口 #6） */}
      <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-amber/15 bg-amber/[0.04] px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-stone-300">
          喜欢这条线？把「{era.routeTitle || '跟着音乐去旅行'}」带到现实——文旅路线 / 同城演出与线下展。
        </p>
        <button
          onClick={() =>
            onIntent?.({
              badge: '✦ 声音旅线',
              title: `把「${era.routeTitle || '跟着音乐去旅行'}」带到现实`,
              desc: '预订这条声音旅线的文旅路线，或同城演出与线下展门票，跟着音乐真正走一趟。',
              ctaLabel: '看旅线与票务 →',
              href: 'https://y.qq.com/',
            })
          }
          className="shrink-0 rounded-full border border-amber/40 px-5 py-2 text-sm text-amber transition-colors hover:bg-amber/10"
        >
          看旅线与票务 →
        </button>
      </div>

      {active !== null && (
        <RouteModal era={era} stops={stops} active={active} setActive={setActive} onClose={() => setActive(null)} />
      )}
    </section>
  )
}

// 会员钩子（商业入口 #2）：解锁完整歌单 —— 演示入口，开通跳转占位到 TME
function UnlockPlaylist({ era }) {
  const [open, setOpen] = useState(false)
  const count = era.playlistCount || era.exhibits.length
  return (
    <section className="mt-12 fade-up">
      <div className="flex flex-col gap-5 overflow-hidden rounded-2xl border border-amber/25 bg-gradient-to-br from-amber/[0.08] to-transparent p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[11px] tracking-[0.18em] text-amber">
            ◈ 时空会员
          </span>
          <h3 className="mt-3 font-serif text-2xl text-stone-100">
            解锁《{era.title}》完整歌单
          </h3>
          <p className="mt-2 text-sm text-stone-400">
            本馆精选 {era.exhibits.length} 首 · 完整歌单 {count} 首，会员畅听无损原声
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-amber px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
        >
          开通会员收听 →
        </button>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-amber/25 bg-charcoal/95 p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[11px] tracking-[0.18em] text-amber">
                ◈ 时空会员
              </span>
              <h4 className="mt-4 font-serif text-2xl text-stone-100">
                畅听《{era.title}》完整歌单
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-stone-400">
                开通时空会员，在 QQ 音乐 · 酷狗 · 酷我畅听本时代 {count} 首完整原声，并解锁全部时代展馆歌单。
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => window.open('https://y.qq.com/', '_blank')}
                  className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
                >
                  去开通 →
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-stone-300 transition-colors hover:border-amber/50 hover:text-amber"
                >
                  暂不
                </button>
              </div>
              <p className="mt-4 text-[10px] tracking-widest text-stone-600">
                演示入口 · 实际跳转 TME 会员开通页
              </p>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

// 复用意向弹窗（商业入口 #5/#6/#7 共用）—— 演示入口，CTA 跳转占位到 TME
function IntentModal({ badge, title, desc, ctaLabel, href, onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-amber/25 bg-charcoal/95 p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[11px] tracking-[0.18em] text-amber">
          {badge}
        </span>
        <h4 className="mt-4 font-serif text-2xl text-stone-100">{title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-stone-400">{desc}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => window.open(href, '_blank')}
            className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            {ctaLabel}
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-stone-300 transition-colors hover:border-amber/50 hover:text-amber"
          >
            暂不
          </button>
        </div>
        <p className="mt-4 text-[10px] tracking-widest text-stone-600">演示入口 · 实际对接 TME</p>
      </div>
    </div>,
    document.body
  )
}

export default function HallPage({ era, onHome, onStamp, onPassport, stampCount = 0 }) {
  const audioRef = useRef(null)
  const previewCache = useRef({}) // no -> url | null（null=查过但没有）
  const [playingNo, setPlayingNo] = useState(null)
  const [loadingNo, setLoadingNo] = useState(null)
  const [, forceRender] = useState(0)
  const [stamped, setStamped] = useState(false)
  const [showStampFx, setShowStampFx] = useState(false)
  const [intent, setIntent] = useState(null) // 商业入口 #5/#6/#7 共用弹窗

  // 离开展厅时停止播放
  useEffect(() => () => audioRef.current?.pause(), [])

  const handleStamp = () => {
    onStamp?.(era)
    setStamped(true)
    setShowStampFx(true)
    setTimeout(() => setShowStampFx(false), 1500)
  }

  const handlePlay = async (item) => {
    if (playingNo === item.no) {
      audioRef.current?.pause()
      setPlayingNo(null)
      return
    }
    let url = previewCache.current[item.no]
    if (url === undefined) {
      setLoadingNo(item.no)
      url = await fetchPreview(item)
      previewCache.current[item.no] = url
      setLoadingNo(null)
      forceRender((n) => n + 1)
    }
    if (!url) return // 暂无试听
    if (!audioRef.current) audioRef.current = new Audio()
    audioRef.current.src = url
    audioRef.current.onended = () => setPlayingNo(null)
    audioRef.current.play().catch(() => {})
    setPlayingNo(item.no)
  }

  return (
    <div className="min-h-screen bg-ink text-stone-200 selection:bg-amber/30">
      {/* 顶部氛围光 */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[45vh] bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.12),_transparent_70%)]" />

      {/* 盖章动画 */}
      {showStampFx && (
        <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink/70 backdrop-blur-sm">
          <div
            className="stamp-in flex h-48 w-48 flex-col items-center justify-center rounded-full border-[6px] bg-[#efe4cc] text-center shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
            style={{ borderColor: era.accent, color: era.accent }}
          >
            <span
              className="absolute inset-[10px] rounded-full border-2"
              style={{ borderColor: era.accent, opacity: 0.72 }}
            />
            <span className="relative px-4 font-serif text-2xl font-semibold leading-tight">
              {era.title}
            </span>
            <span className="relative mt-2 text-[11px] font-semibold tracking-[0.4em]">已入馆</span>
            <span className="relative mt-1 text-[10px] tracking-[0.18em] opacity-70">
              {new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
          <div className="fade-up text-center">
            <p className="text-sm tracking-[0.3em] text-amber/90">
              数字纪念票 · No.{serialOf(era.id)} / 9999
            </p>
            <p className="mt-1.5 text-xs tracking-[0.25em] text-stone-400">
              第 {stampCount} 枚 · 已收入音乐护照
            </p>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* 返回 */}
        <button
          onClick={onHome}
          className="mb-10 text-xs tracking-[0.2em] text-stone-500 transition-colors hover:text-amber"
        >
          ← 返回时空地图
        </button>

        {/* 展厅标题 */}
        <header className="fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber/80">
            声音星图 · 时空展厅 No.{hallNoOf(era)}
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-stone-100 md:text-7xl">
            {era.title}
          </h1>
          <p className="mt-4 text-sm tracking-[0.3em] text-stone-400 md:text-base">
            {era.period} · {era.place}
          </p>
          {era.visitorMemory && (
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-[11px] tracking-[0.22em] text-amber">
              ✦ 本馆为你定制
            </span>
          )}
        </header>

        {/* 馆长手记 */}
        <section className="mt-14 max-w-2xl fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber/60" />
            <span className="text-xs uppercase tracking-[0.3em] text-amber/80">AI馆长手记</span>
          </div>
          <div className="relative pl-7">
            <span className="pointer-events-none absolute -left-1 -top-5 select-none font-serif text-6xl leading-none text-amber/25">
              “
            </span>
            <p className="font-serif text-lg italic leading-loose text-stone-300 md:text-xl">
              {era.curatorNote}
            </p>
            <p className="mt-5 text-right text-xs tracking-[0.3em] text-amber/55">
              —— AI 馆长 · 亲笔
            </p>
          </div>
          {/* 有声纪录片入口（商业入口 #5） */}
          <button
            onClick={() =>
              setIntent({
                badge: '◍ 有声纪录片',
                title: `《${era.title}》完整有声纪录片`,
                desc: '由 AI 馆长串讲的 40 分钟深度有声纪录片，在 TME 长音频 · 播客付费收听，会员畅听。',
                ctaLabel: '去收听 →',
                href: 'https://y.qq.com/',
              })
            }
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber/30 px-4 py-2 text-xs text-amber/90 transition-colors hover:bg-amber/10"
          >
            <span>◍</span> 收听完整有声纪录片 · 约 40 分钟 →
          </button>
        </section>

        {era.visitorMemory && (
          <section
            className="mt-8 max-w-2xl rounded-2xl border border-amber/15 bg-amber/[0.04] p-5 fade-up"
            style={{ animationDelay: '0.22s' }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-amber/50" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber/80">为你定制 · 私人回声</span>
            </div>
            <p className="font-serif text-base italic leading-relaxed text-amber/90">
              「{era.visitorMemory}」
            </p>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">{era.memoryNote}</p>
          </section>
        )}

        {/* 展品 · 横向滚动 */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-xs uppercase tracking-[0.3em] text-stone-500">
              馆藏 · {era.exhibits.length} 件
            </h2>
            <span className="text-xs text-stone-600">← 横向滑动浏览展品 →</span>
          </div>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8">
            {era.exhibits.map((item, i) => (
              <article
                key={item.no}
                className="group w-[300px] shrink-0 snap-start fade-up md:w-[360px]"
                style={{ animationDelay: `${0.1 * i + 0.2}s` }}
              >
                <div className="relative h-full rounded-2xl border border-white/5 bg-charcoal/60 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-amber/30 hover:bg-charcoal hover:shadow-[0_28px_60px_rgba(0,0,0,0.4)]">
                  {/* 聚光灯 */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm tracking-widest text-amber">
                        馆藏 No.{item.no}
                      </span>
                      <span className="text-xs text-stone-500">{item.year}</span>
                    </div>

                    <Cover
                      item={item}
                      isPlaying={playingNo === item.no}
                      onToggle={() => handlePlay(item)}
                    />

                    <h3 className="font-serif text-3xl font-semibold text-stone-100">
                      {item.song}
                    </h3>
                    <p className="mt-1 text-sm tracking-wide text-stone-400">{item.artist}</p>

                    <p className="mt-5 font-serif text-base italic leading-relaxed text-amber/90">
                      「{item.lyric}」
                    </p>

                    {/* 馆长解说（AI 生成的核心内容） */}
                    <div className="mt-5 border-l-2 border-amber/40 pl-3">
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-amber/70">
                        AI馆长解说
                      </p>
                      <p className="text-sm leading-relaxed text-stone-200">{item.note}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center gap-5">
                      {(() => {
                        const url = previewCache.current[item.no]
                        const noPreview = url === null
                        const isPlaying = playingNo === item.no
                        const isLoading = loadingNo === item.no
                        return (
                          <button
                            onClick={() => handlePlay(item)}
                            disabled={noPreview}
                            className={`flex items-center gap-2 text-sm transition-colors hover:text-amber disabled:cursor-not-allowed disabled:text-stone-600 disabled:hover:text-stone-600 ${
                              isPlaying ? 'text-amber' : 'text-stone-300'
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                                isPlaying
                                  ? 'border-amber bg-amber text-ink shadow-[0_0_16px_rgba(201,162,75,0.55)]'
                                  : 'border-amber/40 text-amber'
                              }`}
                            >
                              {isLoading ? '⋯' : isPlaying ? '⏸' : '▶'}
                            </span>
                            {noPreview ? '暂无试听' : isPlaying ? '暂停' : '试听'}
                          </button>
                        )
                      })()}
                      {/* 去全民K歌（商业入口 #7：UGC 导流） */}
                      <button
                        onClick={() =>
                          setIntent({
                            badge: '♪ 全民K歌',
                            title: `点唱《${item.song}》`,
                            desc: `去全民 K 歌演唱 ${item.artist} 的《${item.song}》，和这个时代同框。`,
                            ctaLabel: '去 K 歌 →',
                            href: 'https://kg.qq.com/',
                          })
                        }
                        className="flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-amber"
                      >
                        <span>♪</span> 去K歌
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TravelRoute era={era} onIntent={setIntent} />

        <UnlockPlaylist era={era} />

        {/* 底部行动：盖章（收藏）+ 探索护照（查看）是两个功能 */}
        <footer className="mt-16 fade-up">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleStamp}
              disabled={stamped}
              className={`rounded-full px-7 py-3 text-sm font-medium transition-transform ${
                stamped
                  ? 'cursor-default border border-amber/30 bg-transparent text-amber/70'
                  : 'bg-amber text-ink hover:scale-105'
              }`}
            >
              {stamped ? '✓ 已收入护照' : '把这座展厅盖章带走'}
            </button>
            <button
              onClick={onPassport}
              className={`rounded-full px-7 py-3 text-sm transition-all ${
                stamped
                  ? 'bg-amber text-ink shadow-[0_0_22px_rgba(201,162,75,0.45)] hover:scale-105'
                  : 'border border-amber/40 text-amber hover:bg-amber/10'
              }`}
            >
              翻开探索护照 →
            </button>
          </div>
          {stamped && (
            <p className="mt-4 text-sm tracking-wide text-stone-400 fade-up">
              这座展厅已收进你的音乐护照 —— 翻开看看新点亮的星座 →
            </p>
          )}
        </footer>
      </div>

      {intent && <IntentModal {...intent} onClose={() => setIntent(null)} />}
    </div>
  )
}
