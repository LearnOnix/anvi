import { useCallback, useEffect, useState } from 'react'
import { songId, audioUrl, thumbUrl , artistName } from '../utils/song'
import { saveDownload, getDownload, deleteDownload } from '../utils/downloadDB'
import { ID3Writer } from 'browser-id3-writer'

// status: 'checking' | 'idle' | 'downloading' | 'saved' | 'error'
export function useDownload(song) {
  const id = song ? songId(song) : null
  const [status, setStatus] = useState('checking')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (!id) return
    setStatus('checking')
    getDownload(id)
      .then((rec) => { if (!cancelled) setStatus(rec ? 'saved' : 'idle') })
      .catch(() => { if (!cancelled) setStatus('idle') })
    return () => { cancelled = true }
  }, [id])

  // Option A — save inside Moon: fetch the audio, keep the blob in
  // IndexedDB. Plays back offline from Moon's own "Downloaded" list,
  // never touches the OS Downloads folder.
  const saveInApp = useCallback(async () => {
    if (!song || !id) return
    setStatus('downloading')
    setProgress(0)
    try {
      const res = await fetch(audioUrl(song))
      if (!res.ok || !res.body) throw new Error('bad response')

      const total = Number(res.headers.get('content-length')) || 0
      const reader = res.body.getReader()
      const chunks = []
      let received = 0
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        if (total) setProgress(Math.min(1, received / total))
      }
      const blob = new Blob(chunks)
      // store the whole song object as meta — thumbUrl(meta) and
      // artistName(meta) both work later without re-fetching anything
      await saveDownload(id, song, blob)
      setStatus('saved')
    } catch (e) {
      console.error('Save in Moon failed:', e)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 1600)
    }
  }, [song, id])

  // Option B — save to device: a real file the user can find outside
  // Moon (Downloads folder / Files app). Tries fetch→blob first so the
  // filename is controlled and it never opens a new tab; if the CDN
  // blocks CORS, falls back to a plain anchor download.
  const saveToDevice = useCallback(async () => {
  if (!song) return 'idle'
  const url = audioUrl(song)
  const artist = artistName(song)
  const filename = `${song.name}${artist ? ' - ' + artist : ''}.mp3`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('bad response')
    const mp3Buffer = await res.arrayBuffer()

    // Try to embed cover art — if this fails for any reason, fall
    // back to the plain mp3 rather than blocking the download
    let finalBuffer = mp3Buffer
    try {
      const imgUrl = thumbUrl(song)
      if (imgUrl) {
        const imgRes = await fetch(imgUrl)
        if (imgRes.ok) {
          const imgBuffer = await imgRes.arrayBuffer()
          const writer = new ID3Writer(mp3Buffer)
          writer.setFrame('TIT2', song.name)
          if (artist) writer.setFrame('TPE1', [artist])
          writer.setFrame('APIC', {
            type: 3, // front cover
            data: imgBuffer,
            description: 'Cover',
          })
          writer.addTag()
          finalBuffer = writer.arrayBuffer
        }
      }
    } catch (tagErr) {
      console.warn('Cover art embed failed, saving without it:', tagErr)
    }

    const blob = new Blob([finalBuffer], { type: 'audio/mpeg' })
    const objUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(objUrl), 4000)
    return 'downloaded'
  } catch (e) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.target = '_blank'
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    return 'fallback'
  }
}, [song])

  const remove = useCallback(async () => {
    if (!id) return
    await deleteDownload(id)
    setStatus('idle')
  }, [id])

  return { status, progress, saveInApp, saveToDevice, remove }
}