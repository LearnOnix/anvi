import { useState } from 'react'
import {
  ChevronDown,
  Plus,
  Check,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Repeat1,
} from 'lucide-react'
import { usePlayer } from '../../store/playerStore'
import { useLibrary } from '../../store/libraryStore'
import { useUI } from '../../store/uiStore'
import { artistName, thumbUrl } from '../../utils/song'
import { fmtTime } from '../../utils/format'
import PlaybackControls from './PlaybackControls'

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%230f1d16'/></svg>"

// Decodes HTML entities like &quot; &amp; etc. that come from the API
function decodeHtmlEntities(str) {
  if (!str) return str
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

// Full-screen "now playing" view. Minimal, quiet composition — one soft
// bloom behind the artwork, a few drifting sparks instead of busy motion,
// generous whitespace, thin type. The goal is a calm, anime-key-visual
// feel rather than a "control panel."
export default function FullPlayerSheet() {
  const isExpanded = useUI((s) => s.isPlayerExpanded)
  const closePlayer = useUI((s) => s.closePlayer)

  const song = usePlayer((s) => s.currentSong())
  const isPlaying = usePlayer((s) => s.isPlaying)
  const currentTime = usePlayer((s) => s.currentTime)
  const duration = usePlayer((s) => s.duration)
  const requestSeek = usePlayer((s) => s.requestSeek)
  const volume = usePlayer((s) => s.volume) // store uses a 0–100 scale
  const setVolume = usePlayer((s) => s.setVolume)
  const [lastVolume, setLastVolume] = useState(volume || 80)

  const repeatMode = usePlayer((s) => s.repeatMode) ?? 'off'
  const cycleRepeatMode = usePlayer((s) => s.cycleRepeatMode)

  const isInPlaylist = useLibrary((s) => s.isInPlaylist)
  const toggleInPlaylist = useLibrary((s) => s.toggleInPlaylist)

  if (!song) return null // nothing has ever played — nothing to expand into

  const added = isInPlaylist(song)
  const pct = duration ? (currentTime / duration) * 100 : 0
  const art = thumbUrl(song) || PLACEHOLDER
  const repeatLabel =
    repeatMode === 'one' ? 'Repeat one' : repeatMode === 'all' ? 'Repeat all' : 'Repeat'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isExpanded ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      {/* Quiet gradient wash — no artwork bleed, no heavy blur bloom */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-bg0),var(--color-bg1)_60%,var(--color-bg2))]" />

      {/* A handful of soft drifting sparks — the only ambient motion */}
      <span className="pointer-events-none absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-mote/70 motion-reduce:hidden" style={{ animation: 'spark1 7s ease-in-out infinite' }} />
      <span className="pointer-events-none absolute right-[22%] top-[34%] h-[3px] w-[3px] rounded-full bg-amber/60 motion-reduce:hidden" style={{ animation: 'spark2 9s ease-in-out infinite' }} />
      <span className="pointer-events-none absolute left-[28%] bottom-[26%] h-1 w-1 rounded-full bg-mote/50 motion-reduce:hidden" style={{ animation: 'spark3 11s ease-in-out infinite' }} />

      {/* Drag handle */}
      <div className="relative z-10 flex justify-center pt-3 pb-1 sm:hidden">
        <div className="h-1 w-8 rounded-full bg-white/20" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 pt-3 pb-1 sm:pt-6">
        <button
          type="button"
          onClick={closePlayer}
          aria-label="Collapse player"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:text-ink active:scale-90"
        >
          <ChevronDown size={20} strokeWidth={1.5} />
        </button>
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted/70">
          now playing
        </div>
        <button
          type="button"
          onClick={() => toggleInPlaylist(song)}
          aria-label={added ? 'Remove from playlist' : 'Add to playlist'}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-90 ${
            added ? 'text-mote' : 'text-muted hover:text-ink'
          }`}
        >
          {added ? <Check size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 sm:gap-10 px-8 pt-2 pb-[max(2.5rem,env(safe-area-inset-bottom))] overflow-y-auto">
        {/* Artwork — one soft static bloom behind a slim ring, no clutter */}
        <div className="relative aspect-square w-full max-w-[220px] sm:max-w-[270px] shrink-0">
          <div
            className="absolute -inset-6 rounded-full opacity-40 blur-[50px] transition-opacity duration-700"
            style={{ background: 'var(--color-mote)', opacity: isPlaying ? 0.4 : 0.2 }}
          />
          <img
            src={art}
            alt=""
            className={`relative z-[1] h-full w-full rounded-full object-cover ring-1 ring-white/10 transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-[0.96]'
            }`}
          />
          {repeatMode === 'one' && (
            <div className="absolute bottom-0 right-0 z-[2] flex h-8 w-8 items-center justify-center rounded-full bg-bg0 text-mote ring-1 ring-white/10">
              <Repeat1 size={14} strokeWidth={1.75} />
            </div>
          )}
        </div>

        {/* Title / artist — quiet, no card, just type */}
        <div className="w-full max-w-[300px] text-center">
          <div className="mb-1 truncate font-display text-lg font-medium">{decodeHtmlEntities(song.name)}</div>
          <div className="truncate text-sm font-light text-muted">{decodeHtmlEntities(artistName(song))}</div>
        </div>

        {/* Seek bar */}
        <div className="w-full max-w-[300px]">
          <input
            type="range"
            className="kd-range w-full"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => requestSeek(Number(e.target.value))}
            style={{
              background: `linear-gradient(90deg, var(--color-mote) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
            }}
            aria-label="Seek"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[0.65rem] text-muted/70">
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration)}</span>
          </div>
        </div>

        <div className="scale-105 sm:scale-110">
          <PlaybackControls />
        </div>

        {/* Repeat — quiet ghost toggle, no pill/border noise */}
        <button
          type="button"
          onClick={cycleRepeatMode}
          aria-label={repeatLabel}
          title={repeatLabel}
          className={`flex items-center gap-1.5 text-xs font-light tracking-wide transition-colors active:scale-95 ${
            repeatMode !== 'off' ? 'text-mote' : 'text-muted/60 hover:text-muted'
          }`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 size={14} strokeWidth={1.5} />
          ) : (
            <Repeat size={14} strokeWidth={1.5} />
          )}
          {repeatLabel}
        </button>

        {/* Volume — thin track, icon only, no pill container */}
        <div className="flex w-full max-w-[300px] items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (volume > 0) {
                setLastVolume(volume)
                setVolume(0)
              } else {
                setVolume(lastVolume || 80)
              }
            }}
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            className="flex h-7 w-7 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink active:scale-90"
          >
            {volume === 0 ? (
              <VolumeX size={16} strokeWidth={1.5} />
            ) : volume < 50 ? (
              <Volume1 size={16} strokeWidth={1.5} />
            ) : (
              <Volume2 size={16} strokeWidth={1.5} />
            )}
          </button>
          <input
            type="range"
            className="kd-range w-full"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              background: `linear-gradient(90deg, var(--color-mote) ${volume}%, rgba(255,255,255,0.1) ${volume}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      <style>{`
        @keyframes spark1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          50% { transform: translate(10px, -14px); opacity: 0.2; }
        }
        @keyframes spark2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(-14px, 10px); opacity: 0.15; }
        }
        @keyframes spark3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(8px, 12px); opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}