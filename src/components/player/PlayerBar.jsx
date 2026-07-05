import { X } from 'lucide-react'
import { usePlayer } from '../../store/playerStore'
import PlaybackControls from './PlaybackControls'
import SeekBar from './SeekBar'
import VolumeControl from './VolumeControl'
import FullPlayerSheet from './FullPlayerSheet'

// Song load hote hi bar dikhti hai; cross dabate hi (ya song na hone par)
// khud gayab ho jati hai — permanent nahi rehti.
export default function PlayerBar() {
  const song = usePlayer((s) => s.currentSong())
  const isPlaying = usePlayer((s) => s.isPlaying)
  const clearCurrent = usePlayer((s) => s.clearCurrent)

  if (!song) return null

  return (
    <>
      <div
        className={`border-t border-line px-3 py-2.5 backdrop-blur-lg sm:px-4.5 ${
          isPlaying ? 'bg-[linear-gradient(180deg,rgba(8,14,10,0.7),rgba(6,9,7,0.96))]' : 'bg-bg0/95'
        }`}
      >
        {/* Mobile: compact 2-row layout — controls + volume + close share one row,
            seek bar sits below. Keeps the bar short instead of 4 stacked rows. */}
        <div className="mx-auto flex max-w-[1180px] flex-col gap-1.5 sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <PlaybackControls />
            <div className="flex items-center gap-1.5">
              <VolumeControl />
              <button
                type="button"
                onClick={() => clearCurrent()}
                aria-label="Close player"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <SeekBar />
        </div>

        {/* Desktop / tablet: unchanged working layout */}
        <div className="mx-auto hidden max-w-[1180px] sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-4.5">
          <PlaybackControls />
          <SeekBar />
          <VolumeControl />

          <button
            type="button"
            onClick={() => clearCurrent()}
            aria-label="Close player"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <FullPlayerSheet />
    </>
  )
}