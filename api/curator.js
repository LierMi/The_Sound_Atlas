import { generateCurator, getCuratorConfig } from './_curator-core.js'

const cache = new Map()

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return req.body ? JSON.parse(req.body) : {}

  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const body = await readBody(req)
    const key = JSON.stringify({
      t: body.title,
      p: body.period,
      s: (body.songs || []).map((x) => x.no),
      m: body.memory || '',
    })
    if (cache.has(key)) return res.status(200).json(cache.get(key))

    const result = await generateCurator(body, getCuratorConfig(process.env))
    cache.set(key, result)
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
