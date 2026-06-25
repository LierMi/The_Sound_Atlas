// 优先使用展品里固化的 30 秒试听；没有时再走后端 /api/preview → iTunes Search
// 无结果返回 null
export async function fetchPreview(itemOrSong, maybeArtist) {
  try {
    const item = typeof itemOrSong === 'object' ? itemOrSong : null
    if (item?.previewUrl) return item.previewUrl

    const song = item?.song || itemOrSong
    const artist = item?.artist || maybeArtist
    const q = `song=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}`
    const r = await fetch(`/api/preview?${q}`)
    if (!r.ok) return null
    const data = await r.json()
    return data.previewUrl || null
  } catch {
    return null
  }
}
