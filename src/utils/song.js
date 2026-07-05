// JioSaavn's API sometimes hands back titles with raw HTML entities baked
// in (e.g. `&quot;`) instead of the actual character. Decode once, here,
// so every place that shows a title just gets clean text.
function decodeHtmlEntities(str) {
  if (!str) return str
  if (typeof document === 'undefined') return str
  const el = document.createElement('textarea')
  el.innerHTML = str
  return el.value
}

export function songTitle(song) {
  return decodeHtmlEntities(song?.name) || 'untitled echo'
}

export function artistName(song) {
  const primary = song?.artists?.primary
  if (primary?.length) return decodeHtmlEntities(primary.map((a) => a.name).join(', '))
  const all = song?.artists?.all
  if (all?.length) return decodeHtmlEntities(all[0].name)
  return decodeHtmlEntities(song?.primaryArtists) || 'unknown voice'
}

export function thumbUrl(song) {
  const imgs = song?.image || []
  if (!imgs.length) return ''
  return imgs[imgs.length - 1]?.url || imgs[0]?.url || ''
}

export function audioUrl(song) {
  const list = song?.downloadUrl || []
  if (!list.length) return null
  const preferred =
    list.find((d) => d.quality === '320kbps') ||
    list.find((d) => d.quality === '160kbps') ||
    list[list.length - 1]
  return preferred?.url || null
}

export function songId(song) {
  return String(song?.id || `${song?.name}::${artistName(song)}`)
}