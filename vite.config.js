import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateCurator, generateMemoryEcho, getCuratorConfig } from './api/_curator-core.js'
import { lookupPreview } from './api/_preview-core.js'

// 读取 POST 请求的 JSON body
function readJson(req) {
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

// 声音星图 AI 策展中间件（开发期）；部署时由 /api/curator.js 接管
function curatorApiPlugin(cfg) {
  const cache = new Map() // 同一展厅生成过一次就秒回（开发期内存缓存）
  return {
    name: 'curator-api',
    configureServer(server) {
      server.middlewares.use('/api/curator', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        res.setHeader('Content-Type', 'application/json')
        try {
          const body = await readJson(req)
          const key = JSON.stringify({
            t: body.title,
            p: body.period,
            s: (body.songs || []).map((x) => x.no),
            m: body.memory || '',
          })
          if (cache.has(key)) {
            return res.end(JSON.stringify(cache.get(key)))
          }
          const result = await generateCurator(body, cfg)
          cache.set(key, result)
          res.end(JSON.stringify(result))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e?.message || e) }))
        }
      })
    },
  }
}

// 私人回声中间件（开发期）；部署时由 /api/echo.js 接管
function echoApiPlugin(cfg) {
  const cache = new Map()
  return {
    name: 'echo-api',
    configureServer(server) {
      server.middlewares.use('/api/echo', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method Not Allowed')
        }
        res.setHeader('Content-Type', 'application/json')
        try {
          const body = await readJson(req)
          const key = `${body.title}|${body.memory || ''}`
          if (cache.has(key)) return res.end(JSON.stringify(cache.get(key)))
          const result = await generateMemoryEcho(body, cfg)
          cache.set(key, result)
          res.end(JSON.stringify(result))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e?.message || e) }))
        }
      })
    },
  }
}

// 试听中间件：开发期服务端查 iTunes Search，部署时由 /api/preview.js 接管
function previewApiPlugin() {
  const cache = new Map()
  return {
    name: 'preview-api',
    configureServer(server) {
      server.middlewares.use('/api/preview', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const u = new URL(req.url, 'http://localhost')
          const song = u.searchParams.get('song') || ''
          const artist = u.searchParams.get('artist') || ''
          const key = `${song}|${artist}`
          if (cache.has(key)) return res.end(JSON.stringify(cache.get(key)))

          const out = await lookupPreview(song, artist)
          cache.set(key, out)
          res.end(JSON.stringify(out))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: String(e?.message || e), previewUrl: null }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const cfg = getCuratorConfig(env)
  return {
    plugins: [react(), curatorApiPlugin(cfg), echoApiPlugin(cfg), previewApiPlugin()],
  }
})
