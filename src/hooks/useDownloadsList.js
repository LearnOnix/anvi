import { useCallback, useEffect, useRef, useState } from 'react'
import { listDownloads } from '../utils/downloadDB'

export function useDownloadsList() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  // id -> object URL, kept alive only while the record exists
  const urlMapRef = useRef(new Map())

  const refresh = useCallback(() => {
    listDownloads().then((recs) => {
      const sorted = recs.sort((a, b) => b.savedAt - a.savedAt)

      const currentIds = new Set(sorted.map((r) => r.id))
      for (const [id, url] of urlMapRef.current) {
        if (!currentIds.has(id)) {
          URL.revokeObjectURL(url)
          urlMapRef.current.delete(id)
        }
      }
      for (const rec of sorted) {
        if (!urlMapRef.current.has(rec.id)) {
          urlMapRef.current.set(rec.id, URL.createObjectURL(rec.blob))
        }
      }

      setDownloads(sorted)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('moon:downloads-changed', refresh)
    return () => {
      window.removeEventListener('moon:downloads-changed', refresh)
      for (const url of urlMapRef.current.values()) URL.revokeObjectURL(url)
      urlMapRef.current.clear()
    }
  }, [refresh])

  // Real song objects (rec.meta is the full song, saved as-is) but with
  // downloadUrl swapped for the local blob — audioUrl(song) reads that
  // same field it always has, so nothing in the player/audio engine
  // needs to know these came from IndexedDB instead of the network.
  const playableSongs = downloads.map((rec) => ({
    ...rec.meta,
    downloadUrl: [{ quality: '320kbps', url: urlMapRef.current.get(rec.id) }],
  }))

  return { downloads, playableSongs, loading, refresh }
}