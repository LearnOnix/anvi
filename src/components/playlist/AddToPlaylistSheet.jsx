import { useState } from 'react'
import { Check, ListMusic, Plus, X } from 'lucide-react'
import { useLibrary } from '../../store/libraryStore'
import { useUI } from '../../store/uiStore'
import { thumbUrl } from '../../utils/song'

export default function AddToPlaylistSheet() {
  const song = useUI((s) => s.pendingPlaylistSong)
  const closeAddToPlaylist = useUI((s) => s.closeAddToPlaylist)

  const playlists = useLibrary((s) => s.playlists)
  const isSongInPlaylist = useLibrary((s) => s.isSongInPlaylist)
  const toggleSongInPlaylist = useLibrary((s) => s.toggleSongInPlaylist)
  const createPlaylist = useLibrary((s) => s.createPlaylist)

  const [newName, setNewName] = useState('')
  const [justCreatedId, setJustCreatedId] = useState(null)

  const open = !!song

  function handleCreateAndAdd() {
    const name = newName.trim()
    if (!name || !song) return
    const id = createPlaylist(name)
    toggleSongInPlaylist(id, song)
    setNewName('')
    setJustCreatedId(id)
    setTimeout(() => setJustCreatedId(null), 1400)
  }

  const list = Object.values(playlists)

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Add to playlist"
    >
      <button
        aria-label="Close"
        onClick={closeAddToPlaylist}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      {/* stopPropagation sirf yahan, sheet ke root pe — taaki andar ka
          koi bhi click backdrop tak bubble ho ke sheet band na kar de.
          Ye event delegation ke liye kaafi hai, preventDefault ki
          zaroorat kahi nahi hai (usse input focus/typing block hota hai) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex w-full flex-col rounded-t-3xl border-t border-white/10 bg-[rgba(9,15,11,0.98)] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '78vh' }}
      >
        <div className="px-5 pt-3">
          <div className="mb-3 flex justify-center">
            <div className="h-1.5 w-10 rounded-full bg-white/25" />
          </div>

          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              add to playlist
            </span>
            <button
              onClick={closeAddToPlaylist}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>

          {song && (
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3.5 py-3">
              <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
  <img
    src={thumbUrl(song)}
    alt=""
    className="h-full w-full object-cover"
  />
</span>
              <span className="truncate text-sm font-semibold">{song.name}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {list.length === 0 && (
            <div className="py-6 text-center text-sm text-muted">
              koi playlist nahi hai abhi — neeche se ek banao.
            </div>
          )}

          <div className="flex flex-col gap-1.5 pb-2">
            {song &&
              list.map((pl) => {
                const added = isSongInPlaylist(pl.id, song)
                const justCreated = pl.id === justCreatedId
                return (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => toggleSongInPlaylist(pl.id, song)}
                    className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors ${
                      justCreated
                        ? 'border-mote/50 bg-mote/[0.08]'
                        : 'border-transparent bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-mote">
                      <ListMusic size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{pl.name}</span>
                      <span className="block text-xs text-muted">{pl.songs.length} songs</span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                        added ? 'border-transparent bg-mote text-bg0' : 'border-white/20 text-transparent'
                      }`}
                    >
                      <Check size={13} />
                    </span>
                  </button>
                )
              })}
          </div>
        </div>

        <div className="border-t border-line bg-[rgba(9,15,11,0.98)] px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-faint">
            create new
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateAndAdd()}
              placeholder="playlist name..."
              className="flex-1 rounded-xl border border-line bg-white/[0.05] px-3.5 py-3 text-sm text-ink placeholder:text-faint focus:border-mote/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCreateAndAdd}
              disabled={!newName.trim()}
              aria-label="Create playlist"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mote text-bg0 transition-transform active:scale-90 disabled:opacity-40"
            >
              <Plus size={19} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}