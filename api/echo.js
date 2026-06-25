import { generateMemoryEcho, getCuratorConfig } from './_curator-core.js'

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

// 私人回声：只为用户的私人记忆生成一句话（轻量、秒级）
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  try {
    const body = await readBody(req)
    const result = await generateMemoryEcho(body, getCuratorConfig(process.env))
    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
