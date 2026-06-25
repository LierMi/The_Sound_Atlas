import { useEffect, useRef, useState } from 'react'
import { generateExhibition } from '../lib/curator'

export default function LoadingPage({ era, memory, onDone }) {
  const steps = [
    `正在校准 ${era.period} 的频率…`,
    '正在唤醒沉睡的母带…',
    memory ? '馆长正在把你的记忆写进展厅…' : '馆长正在为你撰写解说…',
    '正在点亮展厅的灯光…',
  ]
  const [i, setI] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    let result // undefined=进行中, null=失败回退, object=成功
    let minElapsed = false

    const finish = () => {
      if (minElapsed && result !== undefined && !doneRef.current) {
        doneRef.current = true
        onDone(result)
      }
    }

    const step = setInterval(() => setI((p) => Math.min(p + 1, steps.length - 1)), 950)
    const minTimer = setTimeout(() => {
      minElapsed = true
      finish()
    }, 3000)

    // 调 AI 生成；挂太久（>30s）则放弃，回退静态
    generateExhibition(era, memory).then((r) => {
      result = r
      finish()
    })
    const hardTimer = setTimeout(() => {
      if (result === undefined) {
        result = null
        finish()
      }
    }, 30000)

    return () => {
      clearInterval(step)
      clearTimeout(minTimer)
      clearTimeout(hardTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      {/* 扩散光环 */}
      <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-amber/20" />
        <span
          className="absolute h-24 w-24 animate-ping rounded-full bg-amber/10"
          style={{ animationDelay: '0.4s' }}
        />
        <span
          className="relative h-3 w-3 rounded-full bg-amber"
          style={{ boxShadow: '0 0 24px #c9a24b' }}
        />
      </div>

      <p className="text-xs uppercase tracking-[0.4em] text-amber/70">时光机启动中</p>
      <h2 className="mt-4 font-serif text-2xl text-stone-100 md:text-3xl">
        正在重建 · {era.title}
      </h2>
      <p className="mt-2 text-xs tracking-[0.3em] text-stone-500">
        {era.period} · {era.place}
      </p>
      <p className="mt-6 h-5 text-sm text-stone-400 transition-opacity duration-500">
        {steps[i]}
      </p>

      {/* 步骤进度：已过/当前=长琥珀，未到=短灰 */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx <= i ? 'w-7 bg-amber' : 'w-3 bg-stone-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
