import { Suspense, useState } from 'react'
import { eras } from '../data/eras'
import UniverseScene from './UniverseScene'
import InstrumentHUD from './InstrumentHUD'

export default function HomePage({ onSelect, memory, onMemoryChange, onPassport, onPartner, stampCount = 0 }) {
  const openCount = eras.filter((e) => e.status === 'open').length
  const [enterAccent, setEnterAccent] = useState(null) // 俯冲进入时的转场色

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {/* 3D 宇宙：全屏背景，可拖拽环视 */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-xs tracking-[0.3em] text-stone-600">
              正在点亮星海…
            </div>
          }
        >
          <UniverseScene onSelect={onSelect} onEnterStart={(era) => setEnterAccent(era.accent)} />
        </Suspense>
      </div>

      {/* 俯冲转场遮罩：随镜头扎进星球，由暖光淡入到黑，无缝交给 Loading */}
      {enterAccent && (
        <div
          className="dive-overlay pointer-events-none fixed inset-0 z-50"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${enterAccent}80 0%, ${enterAccent}30 18%, #0c0b0e 60%)`,
          }}
        />
      )}

      {/* 复古天文仪器 HUD（刻度环/准星/坐标注释/颗粒），事件穿透 */}
      <InstrumentHUD />

      {/* 顶部渐隐，让标题从深空里浮出来 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-64 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-ink/85 to-transparent" />

      {/* 探索护照（右上角的环境音乐开关在 App 里） */}
      <button
        onClick={onPassport}
        className="absolute left-5 top-5 z-30 min-h-11 rounded-full border border-amber/25 bg-ink/60 px-5 py-2 text-xs tracking-[0.16em] text-stone-300 backdrop-blur transition-colors hover:border-amber/60 hover:text-amber"
      >
        探索护照{stampCount > 0 ? ` · ${stampCount}` : ''}
      </button>

      {/* 商务合作入口（B 端：品牌/厂牌/文旅/教育共建时代馆） */}
      <button
        onClick={onPartner}
        className="absolute bottom-5 left-5 z-30 min-h-11 rounded-full border border-amber/25 bg-ink/60 px-5 py-2 text-xs tracking-[0.16em] text-stone-300 backdrop-blur transition-colors hover:border-amber/60 hover:text-amber"
      >
        商务合作
      </button>

      {/* 顶部 HUD：标题 + 记忆输入 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-16 text-center md:pt-14">
        <p className="mb-3 text-xs tracking-[0.42em] text-amber/75 fade-up">
          声音星图 / THE SOUND ATLAS
        </p>
        <h1
          className="font-serif text-3xl font-semibold leading-tight text-stone-100 fade-up md:text-5xl"
          style={{ animationDelay: '0.1s', textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
        >
          你想去哪个音乐时空？
        </h1>
        <p
          className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-400 fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          拖动环视星海，点亮一颗发光坐标进入展厅。
        </p>

        <div
          className="pointer-events-auto mx-auto mt-5 max-w-xl fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <input
            type="text"
            value={memory}
            onChange={(e) => onMemoryChange(e.target.value)}
            maxLength={60}
            placeholder="写一句你和音乐的记忆，AI 馆长会为你定制这座展厅…"
            className="min-h-11 w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-center text-sm text-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-stone-500 focus:border-amber/50 focus:outline-none"
          />
          {memory.trim() ? (
            <p className="mt-2 text-xs tracking-wide text-amber/85">
              ✓ 已记下 · 进入后 AI 馆长会把它写成只属于你的「私人回声」
            </p>
          ) : (
            <p className="mt-2 text-[11px] tracking-wide text-stone-500">
              ✦ 可选 · 写下它，让这趟旅程为你一个人定制
            </p>
          )}
        </div>
      </div>

      {/* 底部状态条 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 px-6 pb-7 text-center">
        <p className="text-xs tracking-[0.18em] text-stone-500">
          已点亮 {openCount} 座展厅 · 更多时空陆续解锁
        </p>
        <p className="text-[10px] tracking-[0.28em] text-stone-600">拖拽旋转 · 滚轮缩放 · 点击进入</p>
      </div>
    </div>
  )
}
