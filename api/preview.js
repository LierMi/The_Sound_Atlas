import { lookupPreview } from './_preview-core.js'

const cache = new Map()

export default async function handler(req, res) {
  try {
    const song = req.query?.song || ''
    const artist = req.query?.artist || ''
    const key = `${song}|${artist}`
    if (cache.has(key)) return res.status(200).json(cache.get(key))

    const out = await lookupPreview(song, artist)
    cache.set(key, out)
    return res.status(200).json(out)
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e), previewUrl: null })
  }
}
