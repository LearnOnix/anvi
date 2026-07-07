import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Trash2, HardDriveDownload } from 'lucide-react'
import { useDownloadsList } from '../../hooks/useDownloadsList'
import { deleteDownload } from '../../utils/downloadDB'
import { thumbUrl, artistName } from '../../utils/song'

function formatSize(bytes) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

// Drop this at the top of PlaylistsOverview.jsx (or anywhere you want a
// "your saved-for-offline songs" section): <DownloadsSection />
// It reads straight from IndexedDB via useDownloadsList — this IS the
// answer to "kaha save ho rahi hai": right here, listed live.
export default function DownloadsSection() {
  const { downloads, loading } = useDownloadsList()
  const [playingId, setPlayingId] = useState(null)
  const audioRef = useRef(null)
  const objectUrlRef = useRef(null)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function togglePlay(rec) {
    if (playingId === rec.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    audioRef.current?.pause()
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)

    const url = URL.createObjectURL(rec.blob)
    objectUrlRef.current = url
    const audio = new Audio(url)
    audio.play()
    audio.onended = () => setPlayingId(null)
    audioRef.current = audio
    setPlayingId(rec.id)
  }

  async function handleRemove(id) {
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
    }
    await deleteDownload(id)
  }

  if (loading) return null
  if (downloads.length === 0) {
    return (
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-4 text-sm text-muted">
        <HardDriveDownload size={18} className="shrink-0" />
        Kuch bhi abhi Moon ke andar saved nahi hai — kisi song pe download button dabao aur "Save in Moon" choose karo.
      </div>
    )
  }

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          downloaded · {downloads.length}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {downloads.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-3 py-2.5"
          >
            <button
              type="button"
              onClick={() => togglePlay(rec)}
              aria-label={playingId === rec.id ? 'Pause' : 'Play'}
              className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10"
            >
              <img src={thumbUrl(rec.meta)} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-bg0/40 text-ink">
                {playingId === rec.id ? <Pause size={15} /> : <Play size={15} />}
              </span>
            </button>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{rec.meta?.name}</span>
              <span className="block truncate text-xs text-muted">
                {artistName(rec.meta)}{rec.blob?.size ? ` · ${formatSize(rec.blob.size)}` : ''}
              </span>
            </span>

            <button
              type="button"
              onClick={() => handleRemove(rec.id)}
              aria-label="Remove download"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-400/10 hover:text-red-300"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}