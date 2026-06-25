// 前端调用 AI 策展中间件；失败返回 null，由调用方回退到静态文案
// memory：用户可选的私人记忆，会被织进馆长开场白
export async function generateExhibition(era, memory = '') {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12000) // 超时中断，避免 Loading 无限挂起
  try {
    const songs = era.exhibits.map((e) => ({
      no: e.no,
      song: e.song,
      artist: e.artist,
      year: e.year,
      lyric: e.lyric,
    }))
    const r = await fetch('/api/curator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: era.title,
        period: era.period,
        place: era.place,
        songs,
        memory: memory || '',
      }),
      signal: ctrl.signal,
    })
    if (!r.ok) return null
    const data = await r.json()
    if (!data || data.error) return null
    return data // { curatorNote, memoryNote, notes }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
