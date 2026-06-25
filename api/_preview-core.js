export async function lookupPreview(song, artist) {
  const term = encodeURIComponent(`${song || ''} ${artist || ''}`.trim())
  if (!term) return { previewUrl: null }

  const r = await fetch(
    `https://itunes.apple.com/search?term=${term}&media=music&entity=song&limit=5&country=HK`
  )
  if (!r.ok) throw new Error(`iTunes ${r.status}`)

  const data = await r.json()
  const hit = (data.results || []).find((x) => x.previewUrl) || null
  return hit
    ? {
        previewUrl: hit.previewUrl,
        artwork: hit.artworkUrl100,
        track: hit.trackName,
        artist: hit.artistName,
      }
    : { previewUrl: null }
}
