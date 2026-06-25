import { useState } from 'react'
import { useAmbient } from './hooks/useAmbient'
import HomePage from './components/HomePage'
import LoadingPage from './components/LoadingPage'
import HallPage from './components/HallPage'
import PassportPage from './components/PassportPage'
import PartnerPage from './components/PartnerPage'

// 印章收藏：持久化到 localStorage
const STAMP_KEY = 'sonic-stamps'
const loadStamps = () => {
  try {
    return JSON.parse(localStorage.getItem(STAMP_KEY) || '[]')
  } catch {
    return []
  }
}
const saveStamps = (s) => {
  try {
    localStorage.setItem(STAMP_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

function buildMemoryNote(era, memory) {
  const m = memory.trim()
  if (!m) return ''
  return `AI 馆长把你这句话别在了${era.title}的展签上——往后每当${era.place}的旧声音响起，这座展厅都只为你一个人重播。它是为你定制的。`
}

// 把 AI 生成的文案合并进展厅数据（失败则用静态文案和静态记忆回声）
function mergeAI(era, result, memory = '') {
  if (!era) return era
  const visitorMemory = memory.trim()
  const notes = result.notes || {}
  return {
    ...era,
    curatorNote: result.curatorNote || era.curatorNote,
    visitorMemory,
    memoryNote: result.memoryNote || buildMemoryNote(era, visitorMemory),
    exhibits: era.exhibits.map((ex) => ({ ...ex, note: notes[ex.no] || ex.note })),
  }
}

export default function App() {
  const [view, setView] = useState('home') // home | loading | hall | passport | partner
  const [selected, setSelected] = useState(null)
  const [hallEra, setHallEra] = useState(null)
  const [memory, setMemory] = useState('') // 用户的私人记忆（"把你放进去"）
  const [stamps, setStamps] = useState(loadStamps)
  const { on, toggle } = useAmbient()

  const enterEra = (era) => {
    setSelected(era)
    setView('loading')
  }

  const onGenerated = (result) => {
    setHallEra(mergeAI(selected, result || {}, memory))
    setView('hall')
  }

  // 盖章带走：把当前展厅收进护照（幂等），返回是否为新增
  const stampEra = (era) => {
    if (!era) return false
    const exists = stamps.some((s) => s.id === era.id)
    if (!exists) {
      const next = [
        ...stamps,
        {
          id: era.id,
          title: era.title,
          period: era.period,
          place: era.place,
          accent: era.accent,
          date: new Date().toLocaleDateString('zh-CN'),
        },
      ]
      setStamps(next)
      saveStamps(next)
    }
    return !exists
  }

  // 探索护照：独立入口，翻开看印章收藏
  const viewPassport = () => setView('passport')

  return (
    <>
      {/* 环境音乐开关：贯穿整个流程 */}
      <button
        onClick={toggle}
        className="fixed right-5 top-5 z-50 flex items-center gap-2 rounded-full border border-amber/30 bg-ink/70 px-4 py-2 text-xs text-stone-300 backdrop-blur transition-colors hover:border-amber/60 hover:text-amber"
      >
        <span className={on ? 'text-amber' : 'animate-pulse text-stone-500'}>♪</span>
        环境音乐 · {on ? '开' : '关'}
      </button>

      {view === 'home' && (
        <HomePage
          onSelect={enterEra}
          memory={memory}
          onMemoryChange={setMemory}
          onPassport={viewPassport}
          onPartner={() => setView('partner')}
          stampCount={stamps.length}
        />
      )}
      {view === 'loading' && (
        <LoadingPage era={selected} memory={memory} onDone={onGenerated} />
      )}
      {view === 'hall' && (
        <HallPage
          era={hallEra}
          onHome={() => setView('home')}
          onStamp={stampEra}
          onPassport={viewPassport}
          stampCount={stamps.length}
        />
      )}
      {view === 'passport' && (
        <PassportPage stamps={stamps} onHome={() => setView('home')} />
      )}
      {view === 'partner' && <PartnerPage onHome={() => setView('home')} />}
    </>
  )
}
