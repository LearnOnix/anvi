import { useEffect, useRef, useState } from 'react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'
import { usePlayer } from '../../store/playerStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function VolumeControl() {
  const volume = usePlayer((s) => s.volume)
  const setVolume = usePlayer((s) => s.setVolume)
  // single source of truth for the narrow/wide split — both the popover
  // logic and the inline-slider visibility read from this same value now,
  // so they can never disagree about which layout is active.
  const isNarrow = useMediaQuery('(max-width: 860px)')
  const [open, setOpen] = useState(false)
  const [lastVolume, setLastVolume] = useState(volume > 0 ? volume : 80)
  const wrapRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  function toggleMute() {
    if (volume > 0) {
      setLastVolume(volume) // remember exactly what it was
      setVolume(0)
    } else {
      setVolume(lastVolume || 80) // restore it, not a fixed default
    }
  }

  function handleSpeakerClick(e) {
    e.stopPropagation()
    if (isNarrow) setOpen((o) => !o)
    // on wide screens the inline slider is always visible, so the speaker
    // button doubles as a quick mute toggle
    else toggleMute()
  }

  const Icon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2

  return (
    <div ref={wrapRef} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={handleSpeakerClick}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-white/[0.06]"
      >
        <Icon size={16} className={volume === 0 ? 'text-red-300' : ''} />
      </button>

      {/* inline slider — only when JS agrees we're on a wide screen,
          same breakpoint the popover logic uses, so the two can't both
          show at once */}
      {!isNarrow && (
        <input
          type="range"
          className="kd-range w-20"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      )}

      {/* popover slider — narrow screens only */}
      {isNarrow && open && (
        <div className="absolute bottom-[52px] right-0 z-40 flex flex-col items-center gap-2.5 rounded-2xl border border-line bg-[rgba(9,15,11,0.97)] px-3 py-3.5 shadow-2xl">
          <span className="font-mono text-xs text-muted">{volume}%</span>
          <input
            type="range"
            className="kd-range h-24 w-1.5 [writing-mode:vertical-lr] [direction:rtl]"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  )
}