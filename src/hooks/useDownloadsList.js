import { useCallback, useEffect, useRef, useState } from 'react'
import { listDownloads } from '../utils/downloadDB'

// How long to wait before revoking a blob URL that's no longer in the
// current downloads list. Gives any <img>/<audio> element that's still
// mid-render with the old URL a chance to finish, instead of yanking
// the URL out from under it and causing ERR_FILE_NOT_FOUND.
const REVOKE_DELAY_MS = 2000

export function useDownloadsList() {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  // id -> object URL, kept alive only while the record exists
  const urlMapRef = useRef(new Map())
  const revokeTimerRef = useRef(null)

  const refresh = useCallback(() => {
    listDownloads().then((recs) => {
      const sorted = recs.sort((a, b) => b.savedAt - a.savedAt)
      const currentIds = new Set(sorted.map((r) => r.id))

      // create URLs for any new records FIRST, so nothing ever reads an
      // undefined/missing URL for a record that does exist
      for (const rec of sorted) {
        if (!urlMapRef.current.has(rec.id)) {
          urlMapRef.current.set(rec.id, URL.createObjectURL(rec.blob))
        }
      }

      setDownloads(sorted)
      setLoading(false)

      // revoke stale URLs after a short delay rather than immediately —
      // avoids invalidating a blob URL some element is still using
      if (revokeTimerRef.current) clearTimeout(revokeTimerRef.current)
      revokeTimerRef.current = setTimeout(() => {
        for (const [id, url] of urlMapRef.current) {
          if (!currentIds.has(id)) {
            URL.revokeObjectURL(url)
            urlMapRef.current.delete(id)
          }
        }
      }, REVOKE_DELAY_MS)
    })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('moon:downloads-changed', refresh)
    return () => {
      window.removeEventListener('moon:downloads-changed', refresh)
      if (revokeTimerRef.current) clearTimeout(revokeTimerRef.current)
      for (const url of urlMapRef.current.values()) URL.revokeObjectURL(url)
      urlMapRef.current.clear()
    }
  }, [refresh])

  // Real song objects (rec.meta is the full song, saved as-is) but with
  // downloadUrl swapped for the local blob — audioUrl(song) reads that
  // same field it always has, so nothing in the player/audio engine
  // needs to know these came from IndexedDB instead of the network.
  //
  // Filtered to only records that actually have a URL ready — closes the
  // gap where a song could briefly render with an empty/undefined src.
  const playableSongs = downloads
    .filter((rec) => urlMapRef.current.has(rec.id))
    .map((rec) => ({
      ...rec.meta,
      downloadUrl: [{ quality: '320kbps', url: urlMapRef.current.get(rec.id) }],
    }))

  return { downloads, playableSongs, loading, refresh }
}