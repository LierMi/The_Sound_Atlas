// 展厅主体文案（馆长手记/解说）已预置在 eras.js —— 秒开，无需实时生成。
// 只有用户写了"私人记忆"时，才实时调轻量端点 /api/echo 生成一句"私人回声"。
// 失败/无记忆返回 null，由调用方回退到静态文案。
export async function generateExhibition(era, memory = '') {
  const m = (memory || '').trim()
  if (!m) return null // 无记忆 → 全用预置文案，不发任何网络请求（秒开）

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 12000) // 短请求，12s 足够；超时回退静态
  try {
    const r = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: era.title,
        period: era.period,
        place: era.place,
        memory: m,
      }),
      signal: ctrl.signal,
    })
    if (!r.ok) return null
    const data = await r.json()
    if (!data || data.error) return null
    return data // { memoryNote }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
