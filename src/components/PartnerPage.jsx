import { useState } from 'react'

// B 端产品（把「时代展馆」当容器卖）—— 商业入口 #8–#11
const OFFERINGS = [
  {
    no: '01',
    tag: '品牌 · IP',
    title: '品牌定制馆 / IP 联名馆',
    who: '面向品牌方 · 广告营销',
    desc: '以「时代馆」为容器做怀旧营销，新品 / 新专以沉浸式展馆首发，用户盖章带走品牌纪念票。',
    points: ['专属定制时代馆', '品牌纪念票 / 数字藏品', '护照裂变曝光'],
  },
  {
    no: '02',
    tag: '唱片公司 · 厂牌',
    title: '版权内容专馆',
    who: '面向唱片公司 · 厂牌',
    desc: '把独家曲库做成沉浸式宣发位，AI 馆长串讲专辑 / 艺人故事，试听直连完整播放。',
    points: ['独家曲库专馆', '艺人 / 专辑深度策展', '试听→播放转化'],
  },
  {
    no: '03',
    tag: '文旅 · 音乐节',
    title: '城市文旅 · 音乐地图馆',
    who: '面向地方文旅 · 音乐节',
    desc: '把一座城市的声音做成可漫游的音乐地图馆，线上展馆联动线下旅线、演出与票务。',
    points: ['城市音乐地图', '冠名 / 主题馆', '线上线下联动'],
  },
  {
    no: '04',
    tag: '教育 · 文化',
    title: '音乐通识 / 文化教育馆',
    who: '面向博物馆 · 学校 · 文化机构',
    desc: '把音乐史做成可进入的通识课与文化数字化项目，适配博物馆展陈与校园美育。',
    points: ['音乐通识课', '博物馆数字展陈', '文化遗产活化'],
  },
]

const STEPS = [
  { no: '1', t: '选时代 · 定主题', d: '选定时代坐标与合作主题' },
  { no: '2', t: '共创内容', d: 'AI 馆长 + 授权曲库共创展馆' },
  { no: '3', t: '上线 · 分享', d: '展馆上线，护照裂变传播' },
  { no: '4', t: '数据回收', d: '转化与情感数据回流' },
]

// 合作意向表单（演示 · 无后端，提交即本地反馈）
function LeadModal({ presetType, onClose }) {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    type: presetType || OFFERINGS[0].title,
    message: '',
  })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-amber/25 bg-charcoal/95 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber text-2xl text-amber">
              ✓
            </div>
            <h4 className="mt-5 font-serif text-2xl text-stone-100">已收到你的合作意向</h4>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              我们会尽快与「{form.company || '你'}」联系，共建专属时代馆。
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105"
            >
              好的
            </button>
            <p className="mt-4 text-[10px] tracking-widest text-stone-600">演示提交 · 实际对接 TME 商务</p>
          </div>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-3 py-1 text-[11px] tracking-[0.18em] text-amber">
              ✦ 合作洽谈
            </span>
            <h4 className="mt-4 font-serif text-2xl text-stone-100">提交合作意向</h4>
            <p className="mt-2 text-sm text-stone-400">留下信息，我们与你共建专属时代馆。</p>

            <div className="mt-5 space-y-3">
              <input
                value={form.company}
                onChange={set('company')}
                placeholder="公司 / 机构名称"
                className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber/50 focus:outline-none"
              />
              <input
                value={form.contact}
                onChange={set('contact')}
                placeholder="联系人 · 电话 / 邮箱"
                className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber/50 focus:outline-none"
              />
              <select
                value={form.type}
                onChange={set('type')}
                className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-stone-200 focus:border-amber/50 focus:outline-none"
              >
                {OFFERINGS.map((o) => (
                  <option key={o.title} value={o.title} className="bg-charcoal">
                    {o.title}
                  </option>
                ))}
              </select>
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={3}
                placeholder="想做的合作 / 时代主题（选填）"
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber/50 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-stone-300 transition-colors hover:border-amber/50 hover:text-amber"
              >
                取消
              </button>
              <button
                onClick={() => setSent(true)}
                disabled={!form.company.trim() || !form.contact.trim()}
                className="rounded-full bg-amber px-6 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105 disabled:opacity-40"
              >
                提交意向 →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PartnerPage({ onHome }) {
  const [lead, setLead] = useState(null) // null=关 | {type} =开

  return (
    <div className="min-h-screen bg-ink text-stone-200 selection:bg-amber/30">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[45vh] bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.12),_transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <button
          onClick={onHome}
          className="mb-10 text-xs tracking-[0.2em] text-stone-500 transition-colors hover:text-amber"
        >
          ← 返回星海
        </button>

        {/* Hero */}
        <header className="fade-up">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-amber/80">
            声音星图 · 商务合作 / FOR PARTNERS
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight text-stone-100 md:text-6xl">
            把你的时代，放进声音星图
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
            「时代展馆」是一个可被冠名、联名、共建的沉浸式音乐容器。品牌、唱片公司、文旅与文化教育机构，
            都能在这里把内容做成可进入、可播放、可盖章带走的时空，并借护照裂变触达年轻用户。
          </p>
        </header>

        {/* B 端产品 */}
        <section className="mt-14 grid gap-5 md:grid-cols-2">
          {OFFERINGS.map((o, i) => (
            <div
              key={o.title}
              className="group relative flex flex-col rounded-2xl border border-white/8 bg-charcoal/55 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:bg-charcoal fade-up"
              style={{ animationDelay: `${0.08 * i + 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl text-amber/40">{o.no}</span>
                <span className="rounded-full border border-amber/25 px-3 py-1 text-[10px] tracking-[0.2em] text-amber/80">
                  {o.tag}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-stone-100">{o.title}</h3>
              <p className="mt-1 text-xs tracking-[0.18em] text-amber/70">{o.who}</p>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">{o.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {o.points.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setLead({ type: o.title })}
                className="mt-6 self-start text-sm text-amber/80 transition-colors hover:text-amber"
              >
                洽谈这项合作 →
              </button>
            </div>
          ))}
        </section>

        {/* 合作流程 */}
        <section className="mt-16 fade-up">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-amber/60" />
            <span className="text-xs uppercase tracking-[0.3em] text-amber/80">合作流程</span>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.no} className="rounded-xl border border-white/8 bg-ink/55 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber/40 font-serif text-sm text-amber">
                  {s.no}
                </span>
                <h4 className="mt-4 font-serif text-lg text-stone-100">{s.t}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-center gap-5 rounded-2xl border border-amber/25 bg-gradient-to-br from-amber/[0.08] to-transparent px-6 py-10 text-center fade-up">
          <h2 className="font-serif text-3xl font-semibold text-stone-100">共建你的专属时代馆</h2>
          <p className="max-w-xl text-sm leading-relaxed text-stone-400">
            从一个时代坐标开始，我们用 AI 馆长与授权曲库，为你做一座能进入、能传播的沉浸式音乐展馆。
          </p>
          <button
            onClick={() => setLead({})}
            className="rounded-full bg-amber px-8 py-3 text-sm font-medium text-ink transition-transform hover:scale-105"
          >
            预约洽谈 →
          </button>
          <p className="text-[10px] tracking-[0.28em] text-stone-600">
            演示页 · 商务对接 partner@soundatlas.demo
          </p>
        </section>
      </div>

      {lead && <LeadModal presetType={lead.type} onClose={() => setLead(null)} />}
    </div>
  )
}
