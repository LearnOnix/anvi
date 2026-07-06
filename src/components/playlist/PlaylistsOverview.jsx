import { useState } from 'react'
import { ListMusic, Plus, Trash2 } from 'lucide-react'
import { useLibrary } from '../../store/libraryStore'

export default function PlaylistsOverview({ onOpenPlaylist }) {
  const playlists = useLibrary((s) => s.playlists)
  const createPlaylist = useLibrary((s) => s.createPlaylist)
  const deletePlaylist = useLibrary((s) => s.deletePlaylist)
  const [newName, setNewName] = useState('')

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    createPlaylist(name)
    setNewName('')
  }

  const list = Object.values(playlists)

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="new playlist name..."
          className="flex-1 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-mote/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mote text-bg0 disabled:opacity-40"
          aria-label="Create playlist"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {list.map((pl) => (
          <div
            key={pl.id}
            className="flex items-center gap-3 rounded-2xl border border-transparent bg-panel p-3 transition-colors hover:border-mote/25"
          >
            <button
              type="button"
              onClick={() => onOpenPlaylist(pl.id)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-mote">
                <ListMusic size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{pl.name}</span>
                <span className="block text-xs text-muted">{pl.songs.length} songs</span>
              </span>
            </button>

            {pl.id !== 'default' && (
              <button
                type="button"
                onClick={() => deletePlaylist(pl.id)}
                aria-label="Delete playlist"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-red-300"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}