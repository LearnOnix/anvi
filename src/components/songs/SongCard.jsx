import { Play, Plus, Check, Download } from 'lucide-react'
import { usePlayer } from '../../store/playerStore'
import { useLibrary } from '../../store/libraryStore'
import { useUI } from '../../store/uiStore'
import { useDownload } from '../../hooks/useDownload'
import { artistName, thumbUrl, songId } from '../../utils/song'

export default function SongCard({ song, list, index }) {
  const playFromQueue = usePlayer((s) => s.playFromQueue)
  const currentSong = usePlayer((s) => s.currentSong())
  const isSongInAnyPlaylist = useLibrary((s) => s.isSongInAnyPlaylist)
  const openAddToPlaylist = useUI((s) => s.openAddToPlaylist)
  const openDownloadOptions = useUI((s) => s.openDownloadOptions)

  const added = isSongInAnyPlaylist(song)
  const isActive = currentSong && songId(currentSong) === songId(song)
  const { status: downloadStatus } = useDownload(song)

  return (
    <div
      className={`group relative flex flex-col gap-2 rounded-2xl border p-2.5 transition-all hover:-translate-y-1 hover:border-mote/25 hover:bg-mote/[0.045] focus-within:-translate-y-1 focus-within:border-mote/25 ${
        isActive ? 'border-amber/55 bg-amber/[0.06]' : 'border-transparent bg-panel'
      }`}
    >
      <button
        type="button"
        onClick={() => playFromQueue(list, index)}
        className="flex w-full flex-col gap-2 text-left"
      >
        <span className="relative block aspect-square overflow-hidden rounded-[10px] bg-white/[0.04]">
          <img loading="lazy" src={thumbUrl(song)} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-bg0/35 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Play size={26} fill="#eef6ea" stroke="none" className="drop-shadow-[0_0_8px_rgba(216,247,155,0.6)]" />
          </span>
        </span>
        <span className="line-clamp-1 text-[0.86rem] font-semibold leading-tight">{song.name}</span>
        <span className="line-clamp-1 text-xs text-muted">{artistName(song)}</span>
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); openAddToPlaylist(song) }}
        aria-label={added ? 'Manage playlists' : 'Add to playlist'}
        className={`absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all
          opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100
          [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100
          ${added
            ? 'border-transparent bg-mote text-bg0 opacity-100 scale-100'
            : 'border-white/15 bg-bg0/60 text-ink hover:border-mote/60'}`}
      >
        {added ? <Check size={14} /> : <Plus size={14} />}
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); openDownloadOptions(song) }}
        aria-label={downloadStatus === 'saved' ? 'Downloaded — manage' : 'Download'}
        className={`absolute left-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all
          opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100
          [@media(hover:none)]:opacity-100 [@media(hover:none)]:scale-100
          ${downloadStatus === 'saved'
            ? 'border-transparent bg-mote text-bg0 opacity-100 scale-100'
            : 'border-white/15 bg-bg0/60 text-ink hover:border-mote/60'}`}
      >
        {downloadStatus === 'saved' ? <Check size={14} /> : <Download size={13} />}
      </button>
    </div>
  )
}