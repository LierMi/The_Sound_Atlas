import { useRef, useState } from 'react'

// 生成式环境音乐引擎（Web Audio，无需音频文件）
// 用 A 小调五声音阶随机弹奏柔和钟琴音符 + 反馈回声营造空间 + 极轻声垫保暖
// 五声音阶任意组合都和谐，所以听起来永远是"音乐"而不是噪音
export function useAmbient() {
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const timerRef = useRef(null)
  const playingRef = useRef(false)
  const [on, setOn] = useState(false)

  // A 小调五声音阶（A C D E G，跨两个八度）
  const SCALE = [220, 261.63, 293.66, 329.63, 392.0, 440, 523.25, 587.33, 659.25]

  // 单个音符：柔和起音 + 长衰减，滤波随时间收住，像被轻敲的钟
  const playNote = (ctx, dest, freq, when, velocity) => {
    const o1 = ctx.createOscillator()
    o1.type = 'triangle'
    o1.frequency.value = freq

    const o2 = ctx.createOscillator() // 高八度微失谐，增加钟琴光泽
    o2.type = 'sine'
    o2.frequency.value = freq * 2.001
    const o2g = ctx.createGain()
    o2g.gain.value = 0.16

    const g = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'

    o1.connect(g)
    o2.connect(o2g)
    o2g.connect(g)
    g.connect(filter)
    filter.connect(dest)

    const peak = 0.22 * velocity
    g.gain.setValueAtTime(0.0001, when)
    g.gain.exponentialRampToValueAtTime(peak, when + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, when + 3.4)

    filter.frequency.setValueAtTime(2600, when)
    filter.frequency.exponentialRampToValueAtTime(480, when + 3.2)

    o1.start(when)
    o2.start(when)
    o1.stop(when + 3.6)
    o2.stop(when + 3.6)
  }

  const start = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    // 干声总线
    const bus = ctx.createGain()
    bus.connect(master)

    // 反馈回声 → 空间感（像在一座空旷的展厅里）
    const delay = ctx.createDelay()
    delay.delayTime.value = 0.33
    const feedback = ctx.createGain()
    feedback.gain.value = 0.34
    const damp = ctx.createBiquadFilter()
    damp.type = 'lowpass'
    damp.frequency.value = 1500
    bus.connect(delay)
    delay.connect(damp)
    damp.connect(feedback)
    feedback.connect(delay)
    delay.connect(master)

    // 极轻声垫：低音根音，只给一点温暖底色（不再是刺耳嗡嗡）
    ;[110, 164.81].forEach((f) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const pad = ctx.createGain()
      pad.gain.value = 0.035
      const pf = ctx.createBiquadFilter()
      pf.type = 'lowpass'
      pf.frequency.value = 380
      o.connect(pad)
      pad.connect(pf)
      pf.connect(master)
      o.start()
    })

    // 2.5 秒淡入
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5)

    ctxRef.current = ctx
    masterRef.current = master
    playingRef.current = true

    // 随机弹奏循环
    const loop = () => {
      if (!playingRef.current) return
      const f = SCALE[Math.floor(Math.random() * SCALE.length)]
      playNote(ctx, bus, f, ctx.currentTime + 0.02, 0.6 + Math.random() * 0.4)
      // 35% 概率叠一个和声音符
      if (Math.random() < 0.35) {
        const f2 = SCALE[Math.floor(Math.random() * SCALE.length)]
        playNote(ctx, bus, f2, ctx.currentTime + 0.25, 0.35)
      }
      const next = 1400 + Math.random() * 1900 // 1.4 – 3.3 秒
      timerRef.current = setTimeout(loop, next)
    }
    loop()

    setOn(true)
  }

  const stop = () => {
    const ctx = ctxRef.current
    const master = masterRef.current
    playingRef.current = false
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
    setTimeout(() => ctx.close(), 1500)
    ctxRef.current = null
    masterRef.current = null
    setOn(false)
  }

  const toggle = () => (on ? stop() : start())
  return { on, toggle }
}
