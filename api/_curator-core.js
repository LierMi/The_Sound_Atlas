export function getCuratorConfig(env = process.env) {
  return {
    KEY: env.ZAI_API_KEY || env.ANTHROPIC_API_KEY || '',
    BASE: env.GLM_BASE_URL || 'https://api.z.ai/api/coding/paas/v4',
    MODEL: env.GLM_MODEL || 'glm-5.1',
  }
}

function parseLooseJson(text) {
  let t = String(text || '').trim()
  t = t.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim()
  const s = t.indexOf('{')
  const e = t.lastIndexOf('}')
  if (s >= 0 && e > s) t = t.slice(s, e + 1)
  return JSON.parse(t)
}

export async function generateCurator({ title, period, place, songs = [], memory = '' }, cfg = getCuratorConfig()) {
  if (!cfg.KEY) throw new Error('缺少 API key：请设置 ZAI_API_KEY')

  const songLines = songs
    .map((s) => `${s.no}.《${s.song}》— ${s.artist}（${s.year}）歌词:「${s.lyric}」`)
    .join('\n')

  const system =
    '你是"时音馆"的资深策展人（馆长），为一座音乐时空展厅撰写解说。文字考究、克制、有温度，像博物馆里被精心打磨的展签。避免浮夸套话与营销腔。'

  const memoryBlock = memory
    ? `\n\n这位观众留下了一句私人记忆："${memory}"。请在"馆长开场白"里自然地把这段记忆织进去——像馆长在对他一个人说话，让这个时代的声音与他的私人故事产生共鸣。不要生硬复述，要温柔承接。并额外写一句 memoryNote，像展厅里给这位观众的私人回声。`
    : ''

  const user = `这座展厅的主题是【${title}】（${period} · ${place}）。
以下是馆藏曲目：
${songLines}${memoryBlock}

请完成两件事：
1. 写一段"馆长开场白"（curatorNote），${memory ? '90–140' : '80–120'}字，引导观众走进这个时代的声音现场${memory ? '，并把上面那段私人记忆织进来' : ''}。
2. 为每首歌写一句解说词（40–70字），点出它在那个时代的意义或情感，不要复述歌词。

只返回严格的 JSON，不要 markdown 代码块，格式：
{"curatorNote":"...","memoryNote":"...","notes":{"001":"...","002":"..."}}`

  const r = await fetch(`${cfg.BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.KEY}`,
    },
    body: JSON.stringify({
      model: cfg.MODEL,
      temperature: 0.8,
      max_tokens: 1600,
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!r.ok) {
    const t = await r.text()
    throw new Error(`GLM ${r.status}: ${t.slice(0, 300)}`)
  }
  const data = await r.json()
  const content = data?.choices?.[0]?.message?.content || ''
  return parseLooseJson(content)
}

// 轻量：只为"私人记忆"生成一句"私人回声"（短 prompt，秒级返回）
// 展厅主体文案已预置在 eras.js，无需实时生成
export async function generateMemoryEcho({ title, period, place, memory = '' }, cfg = getCuratorConfig()) {
  if (!cfg.KEY) throw new Error('缺少 API key：请设置 ZAI_API_KEY')
  const m = String(memory || '').trim()
  if (!m) return { memoryNote: '' }

  const system =
    '你是"声音星图"的资深策展人（馆长）。文字考究、克制、有温度，像博物馆里被精心打磨的展签。避免浮夸套话与营销腔。'
  const user = `一座音乐时空展厅的主题是【${title}】（${period} · ${place}）。
一位观众在入口留下了一句私人记忆："${m}"。
请以馆长口吻，为这位观众写一句"私人回声"（30–55 字）——像在对他一个人说话，把这个时代的声音与他的私人记忆温柔地系在一起。不要复述他的原话，要温柔承接、点到为止。
只返回严格 JSON，不要 markdown 代码块，格式：{"memoryNote":"..."}`

  const r = await fetch(`${cfg.BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.KEY}`,
    },
    body: JSON.stringify({
      model: cfg.MODEL,
      temperature: 0.85,
      max_tokens: 300,
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!r.ok) {
    const t = await r.text()
    throw new Error(`GLM ${r.status}: ${t.slice(0, 300)}`)
  }
  const data = await r.json()
  const content = data?.choices?.[0]?.message?.content || ''
  return parseLooseJson(content)
}
