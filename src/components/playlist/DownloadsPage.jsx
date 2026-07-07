import { ChevronLeft, Trash2 } from 'lucide-react'
import { useDownloadsList } from '../../hooks/useDownloadsList'
import { deleteDownload } from '../../utils/downloadDB'
import { songId } from '../../utils/song'
import SongGrid from '../songs/SongGrid'

// Opened from the "Downloaded" tile in PlaylistsOverview, same way a
// regular playlist opens. Deliberately reuses SongGrid/SongCard instead
// of any bespoke list — tapping a card calls the exact same
// playFromQueue() the rest of the app uses, so there is only ever one
// player, one queue, one FullPlayerSheet. Downloaded songs are just
// another list to that pipeline.
export default function DownloadsPage({ onBack }) {
  const { downloads, playableSongs, loading } = useDownloadsList()

  async function handleRemove(e, id) {
    e.stopPropagation()
    await deleteDownload(id)
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-ink"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
          downloaded · {downloads.length}
        </span>
      </div>

      <SongGrid
        songs={playableSongs}
        loading={loading}
        skeletonCount={6}
        emptyTitle="Nothing downloaded yet"
        emptySub="Save a song for offline play from its download button"
      />

      {/* Per-song remove — small list below the grid so SongCard itself
          doesn't need a third corner button just for this one page */}
      {downloads.length > 0 && (
        <div className="mt-5 flex flex-col gap-1">
          <span className="mb-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint">
            manage
          </span>
          {downloads.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-muted"
            >
              <span className="truncate">{rec.meta?.name}</span>
              <button
                type="button"
                onClick={(e) => handleRemove(e, rec.id)}
                aria-label="Remove download"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}