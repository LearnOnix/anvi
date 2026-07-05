import { SkipBack, SkipForward, Play, Pause } from 'lucide-react'
import { usePlayer } from '../../store/playerStore'

export default function PlaybackControls() {
  const isPlaying = usePlayer((s) => s.isPlaying)
  const togglePlay = usePlayer((s) => s.togglePlay)
  const next = usePlayer((s) => s.next)
  const prev = usePlayer((s) => s.prev)
  const hasSong = usePlayer((s) => s.currentIndex >= 0)

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous track"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white/[0.06]"
      >
        <SkipBack size={16} fill="currentColor" />
      </button>

      <button
        type="button"
        onClick={() => hasSong && togglePlay()}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-mote text-bg0 hover:bg-[#e9ffbd]"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next track"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white/[0.06]"
      >
        <SkipForward size={16} fill="currentColor" />
      </button>
    </div>
  )
}
