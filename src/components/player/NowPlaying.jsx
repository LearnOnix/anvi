import { usePlayer } from '../../store/playerStore'
import { useUI } from '../../store/uiStore'
import { artistName, thumbUrl, songTitle } from '../../utils/song'

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%230f1d16'/></svg>"

export default function NowPlaying() {
  const song = usePlayer((s) => s.currentSong())
  const isPlaying = usePlayer((s) => s.isPlaying)
  const openPlayer = useUI((s) => s.openPlayer)

  const ring1Duration = isPlaying ? '3.4s' : '9s'
  const ring2Duration = isPlaying ? '5.2s' : '13s'

  return (
    <button
      type="button"
      onClick={() => song && openPlayer()}
      disabled={!song}
      aria-label={song ? 'Open full player' : undefined}
      className="flex min-w-0 items-center gap-3 text-left disabled:cursor-default"
    >
      <div className="relative h-[38px] w-[38px] flex-none rounded-full sm:h-[46px] sm:w-[46px]">
        {/* orbit ring 1 */}
        <span className="absolute -inset-2 rotate-[12deg] rounded-full motion-reduce:hidden">
          <span
            className="absolute inset-0 rounded-full border border-mote/20"
            style={{ animation: `spin ${ring1Duration} linear infinite` }}
          >
            <i className="absolute -top-[2.5px] left-1/2 -ml-[2.5px] h-[5px] w-[5px] rounded-full bg-mote shadow-[0_0_6px_1px_rgba(216,247,155,0.9)]" />
          </span>
        </span>
        {/* orbit ring 2, reverse direction */}
        <span className="absolute -inset-4 rotate-[-24deg] scale-y-[0.78] rounded-full motion-reduce:hidden">
          <span
            className="absolute inset-0 rounded-full border border-amber/20"
            style={{ animation: `spin ${ring2Duration} linear infinite reverse` }}
          >
            <i className="absolute -top-[2.5px] left-1/2 -ml-[2.5px] h-[5px] w-[5px] rounded-full bg-amber shadow-[0_0_6px_1px_rgba(255,184,107,0.9)]" />
          </span>
        </span>

        <img
          src={song ? thumbUrl(song) || PLACEHOLDER : PLACEHOLDER}
          alt=""
          className="relative z-[2] h-full w-full rounded-full border border-white/15 object-cover shadow-[0_2px_10px_-2px_rgba(0,0,0,0.6)]"
        />
        <span
          className={`absolute -inset-[5px] rounded-full border border-amber/40 ${
            isPlaying ? 'opacity-100 animate-breathe' : 'opacity-0'
          }`}
        />
      </div>

      <div className="min-w-0">
        <div className="truncate text-[0.88rem] font-bold">
          {song ? songTitle(song) : 'no particle in orbit yet'}
        </div>
        <div className="truncate text-xs text-muted">
          {song ? artistName(song) : 'pick one below to set it spinning'}
        </div>
      </div>

      {/* keyframes for the plain 'spin' animation used via inline style above */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}