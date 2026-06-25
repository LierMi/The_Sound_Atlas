import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { QRCodeSVG } from 'qrcode.react'
import { eras, serialOf } from '../data/eras'

// 票券条形码（inline，导出友好）
const BARCODE =
  'repeating-linear-gradient(90deg, #d6d3cd 0 1px, transparent 1px 2px, #d6d3cd 2px 4px, transparent 4px 5px, #d6d3cd 5px 6px, transparent 6px 9px, #d6d3cd 9px 11px, transparent 11px 12px)'

// 邀请码：按已点亮时代确定性生成（同一收藏恒定）
const inviteCodeOf = (stamps) => {
  const s = stamps.map((x) => x.id).join('|') || 'pending'
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return 'SA-' + ((h % 9000) + 1000)
}

// 每个时代在星图上的固定坐标（收集到就点亮）
const SKY = [
  { x: 20, y: 24 }, { x: 38, y: 15 }, { x: 58, y: 21 }, { x: 76, y: 17 }, { x: 87, y: 33 },
  { x: 13, y: 45 }, { x: 31, y: 39 }, { x: 50, y: 33 }, { x: 68, y: 41 }, { x: 85, y: 53 },
  { x: 22, y: 63 }, { x: 41, y: 57 }, { x: 59, y: 64 }, { x: 75, y: 69 }, { x: 88, y: 78 },
  { x: 15, y: 80 }, { x: 35, y: 83 }, { x: 55, y: 81 },
]

const posFor = (id) => {
  const idx = eras.findIndex((e) => e.id === id)
  return idx < 0 ? null : SKY[idx % SKY.length]
}

// 一颗星：点亮(收集) or 暗星(未收集)
function Star({ pos, lit, accent, title, period, place, date, latest }) {
  if (!lit) {
    return (
      <span
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stone-500/40"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      />
    )
  }
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <span
        className={`relative mx-auto block h-3 w-3 rounded-full ${latest ? 'animate-pulse' : ''}`}
        style={{ background: accent, boxShadow: `0 0 10px 2px ${accent}, 0 0 22px 6px ${accent}66` }}
      />
      <div className="mt-1.5 whitespace-nowrap">
        <p className="font-serif text-[12px] leading-tight text-stone-100" style={{ textShadow: '0 1px 8px #000' }}>
          {title}
        </p>
        <p className="text-[8px] tracking-[0.18em] text-amber/60">
          {period} · {place}
        </p>
        <p className="text-[8px] tracking-[0.16em] text-stone-500">{date}</p>
      </div>
    </div>
  )
}

export default function PassportPage({ stamps = [], onHome }) {
  const date = new Date().toLocaleDateString('zh-CN')
  const lit = stamps.length
  const total = eras.length
  const latest = stamps[stamps.length - 1]
  const latestId = latest?.id
  const ticketCode = latest ? `SA-${latest.id.toUpperCase().slice(0, 6)}` : 'SA-PENDING'
  const serial = latest ? serialOf(latest.id) : '----' // 数字藏品序列号
  const inviteCode = inviteCodeOf(stamps) // 邀请码（裂变）
  const inviteUrl = `https://y.qq.com/atlas?invite=${inviteCode}` // 演示：邀请深链占位
  const posterRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mintOpen, setMintOpen] = useState(false)

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`我在声音星图点亮了 ${lit} 个音乐时代，用我的邀请码 ${inviteCode} 进来逛逛：${inviteUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      alert('复制失败，请手动复制邀请码：' + inviteCode)
    }
  }

  // 按收集顺序连成星座轨迹
  const path = stamps.map((s) => posFor(s.id)).filter(Boolean)

  const download = async () => {
    if (!posterRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0c0b0e',
      })
      const a = document.createElement('a')
      a.download = '声音星图-音乐护照.png'
      a.href = dataUrl
      a.click()
    } catch (e) {
      alert('导出失败：' + (e?.message || e))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[40vh] bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.12),_transparent_70%)]" />

      <div className="relative w-full max-w-lg fade-up">
        <div
          ref={posterRef}
          className="relative overflow-hidden rounded-[20px] border border-amber/25 bg-ink"
        >
          {/* 入馆券票根 */}
          <div className="relative border-b border-dashed border-amber/20 px-8 py-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs tracking-[0.4em] text-amber/80">你的音乐护照</p>
                  <span className="rounded-full border border-amber/40 px-2 py-0.5 text-[8px] tracking-[0.18em] text-amber/80">
                    限量数字藏品
                  </span>
                </div>
                <h1 className="mt-3 font-serif text-3xl tracking-wide text-stone-100">
                  {latest ? latest.title : '待开启的音乐时空'}
                </h1>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-stone-500">
                  THE SOUND ATLAS · ADMIT ONE
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[9px] tracking-[0.28em] text-stone-600">TICKET</p>
                <p className="mt-2 font-serif text-lg text-amber">{ticketCode}</p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
              <div>
                <p className="text-[8px] tracking-[0.25em] text-stone-600">PERIOD</p>
                <p className="mt-1 text-xs text-stone-300">{latest?.period || '未盖章'}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.25em] text-stone-600">PLACE</p>
                <p className="mt-1 text-xs text-stone-300">{latest?.place || '声音星图'}</p>
              </div>
              <div>
                <p className="text-[8px] tracking-[0.25em] text-stone-600">DATE</p>
                <p className="mt-1 text-xs text-stone-300">{latest?.date || date}</p>
              </div>
            </div>
          </div>

          {/* 星座天穹 */}
          <div className="relative min-h-[400px] overflow-hidden px-2 py-2">
            <div className="cosmic-starfield absolute inset-0 opacity-80" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(201,162,75,0.1),transparent_60%)]" />

            {/* 仪器味侧标 + 角落括号 */}
            <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] tracking-[0.35em] text-stone-600">
              SOUND ATLAS · 印章
            </span>
            <span className="absolute right-3 top-3 h-6 w-6 border-r border-t border-amber/25" />
            <span className="absolute bottom-3 right-3 h-6 w-6 border-b border-r border-amber/25" />

            {/* 星座连线（收集轨迹） */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {path.slice(1).map((p, i) => (
                <line
                  key={i}
                  x1={path[i].x}
                  y1={path[i].y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#c9a24b"
                  strokeOpacity="0.5"
                  strokeWidth="0.25"
                  strokeDasharray="1 1.2"
                />
              ))}
            </svg>

            {/* 所有时代：收集到的点亮，其余暗星 */}
            <div className="relative h-[400px]">
              {eras.map((era) => {
                const pos = posFor(era.id)
                if (!pos) return null
                const stamp = stamps.find((s) => s.id === era.id)
                return (
                  <Star
                    key={era.id}
                    pos={pos}
                    lit={!!stamp}
                    accent={stamp?.accent || era.accent}
                    title={era.title}
                    period={era.period}
                    place={era.place}
                    date={stamp?.date}
                    latest={era.id === latestId}
                  />
                )
              })}
            </div>

            {/* 空状态提示 */}
            {lit === 0 && (
              <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
                <p className="text-sm leading-relaxed text-stone-400">
                  入馆券还没盖章。
                  <br />
                  去任意开放展厅，点「把这座展厅盖章带走」，
                  <br />
                  盖下你的第一枚章。
                </p>
              </div>
            )}
          </div>

          {/* 票尾：邀请二维码（#3）+ 数字藏品序列号（#4）+ 条形码 + 进度 */}
          <div className="border-t border-dashed border-white/10 px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              {/* 左：邀请裂变 */}
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-white p-1.5">
                  <QRCodeSVG value={inviteUrl} size={54} bgColor="#ffffff" fgColor="#0c0b0e" level="M" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] tracking-[0.25em] text-stone-600">SCAN · 扫码加入</p>
                  <p className="mt-1 font-mono text-xs text-amber">{inviteCode}</p>
                  <p className="mt-0.5 text-[8px] tracking-[0.14em] text-stone-600">用我的邀请码进声音星图</p>
                </div>
              </div>
              {/* 右：数字藏品序列号 */}
              <div className="text-right">
                <p className="text-[8px] tracking-[0.25em] text-stone-600">数字藏品 · COLLECTIBLE</p>
                <p className="mt-1 font-serif text-sm text-stone-100">No. {serial} / 9999</p>
                <div className="ml-auto mt-1.5 h-5 w-24 opacity-55" style={{ backgroundImage: BARCODE }} />
              </div>
            </div>
            <p className="mt-4 text-center font-mono text-[10px] tracking-[0.3em] text-stone-600">
              声音漫游护照 · 已点亮 {lit} / {total} 座 · 签发于 {date}
            </p>
          </div>
        </div>

        {/* 操作 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={download}
            disabled={exporting || lit === 0}
            className="rounded-full bg-amber px-7 py-3 text-sm font-medium text-ink transition-transform hover:scale-105 disabled:opacity-50"
          >
            {exporting ? '生成中…' : '下载护照'}
          </button>
          <button
            onClick={copyInvite}
            disabled={lit === 0}
            className="rounded-full border border-amber/40 px-6 py-3 text-sm text-amber transition-colors hover:bg-amber/10 disabled:opacity-40"
          >
            {copied ? '✓ 邀请链接已复制' : '复制邀请链接'}
          </button>
          <button
            onClick={() => setMintOpen(true)}
            disabled={lit === 0}
            className="rounded-full border border-amber/40 px-6 py-3 text-sm text-amber transition-colors hover:bg-amber/10 disabled:opacity-40"
          >
            铸造数字藏品
          </button>
          <button
            onClick={onHome}
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-stone-300 transition-colors hover:border-amber/50 hover:text-amber"
          >
            返回时空地图
          </button>
        </div>
      </div>

      {/* 数字藏品铸造（商业入口 #4）—— 演示入口，对接 TME 数字藏品 */}
      {mintOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4 backdrop-blur-sm"
          onClick={() => setMintOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-amber/25 bg-charcoal/95 p-7 text-center shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[11px] tracking-[0.18em] text-amber">
              ✦ 数字藏品
            </span>
            <h4 className="mt-4 font-serif text-2xl text-stone-100">铸造你的数字纪念票</h4>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              把《{latest?.title}》纪念票 No.{serial} / 9999 铸造为链上数字藏品，永久收藏、可转赠，凭票享对应时代展馆与歌单权益。
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => window.open('https://y.qq.com/', '_blank')}
                className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
              >
                前往铸造 →
              </button>
              <button
                onClick={() => setMintOpen(false)}
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-stone-300 transition-colors hover:border-amber/50 hover:text-amber"
              >
                暂不
              </button>
            </div>
            <p className="mt-4 text-[10px] tracking-widest text-stone-600">
              演示入口 · 实际对接 TME 数字藏品平台
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
