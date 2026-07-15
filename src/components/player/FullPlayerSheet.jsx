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

// Fake little equalizer bars — purely decorative, echoes the waveform
// strip you see in YouTube Music / the reference screenshot.
function Waveform({ active }) {
  const bars = [6, 12, 8, 16, 10, 14, 7, 11, 9, 15, 6, 12]
  return (
    <div className="flex items-end gap-[3px] h-4">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full bg-mote/70"
          style={{
            height: active ? undefined : `${Math.max(4, h * 0.4)}px`,
            animation: active
              ? `wfBar ${0.6 + (i % 4) * 0.15}s ease-in-out ${i * 0.05}s infinite alternate`
              : 'none',
          }}
        />
      ))}
    </div>
  )
}

// Full-screen "now playing" view, like tapping the mini-player in Spotify /
// Apple Music. Slides up from the bottom, glass-morphic surface with ambient
// color bleeding from the artwork, big seek bar, and larger playback controls.
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

  // --- Repeat / loop --------------------------------------------------
  // Prefer store-driven state (so the mini-player / audio engine can also
  // read it) but fall back to local state so this still works visually
  // even before the store wiring is added — see the store snippet you
  // were given alongside this file.
  const storeRepeatMode = usePlayer((s) => s.repeatMode)
  const storeCycleRepeatMode = usePlayer((s) => s.cycleRepeatMode)
  const [localRepeatMode, setLocalRepeatMode] = useState('off') // 'off' | 'all' | 'one'
  const repeatMode = storeRepeatMode ?? localRepeatMode
  const cycleRepeatMode =
    storeCycleRepeatMode ??
    (() =>
      setLocalRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off')))

  const isInPlaylist = useLibrary((s) => s.isInPlaylist)
  const toggleInPlaylist = useLibrary((s) => s.toggleInPlaylist)

  if (!song) return null // nothing has ever played — nothing to expand into

  const added = isInPlaylist(song)
  const pct = duration ? (currentTime / duration) * 100 : 0
  const art = thumbUrl(song) || PLACEHOLDER

  const repeatLabel =
    repeatMode === 'one' ? 'Repeat one' : repeatMode === 'all' ? 'Repeat all' : 'Repeat off'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isExpanded ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-[linear-gradient(190deg,var(--color-bg0),var(--color-bg1)_55%,var(--color-bg2))]" />

      {/* Ambient blurred artwork bleed — ties the whole sheet's color to the song */}
      <div
        className="absolute inset-0 opacity-60 transition-[background-image] duration-700"
        style={{
          backgroundImage: `url(${art})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(90px) saturate(160%)',
          transform: 'scale(1.3)',
        }}
      />
      <div className="absolute inset-0 bg-bg0/55 backdrop-blur-3xl" />

      {/* Floating glass orbs for ambient motion */}
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-mote/20 blur-[70px] motion-reduce:hidden" style={{ animation: 'driftA 14s ease-in-out infinite' }} />
      <div className="pointer-events-none absolute -right-10 bottom-32 h-64 w-64 rounded-full bg-amber/20 blur-[80px] motion-reduce:hidden" style={{ animation: 'driftB 18s ease-in-out infinite' }} />

      {/* Drag handle — mobile sheet affordance */}
      <div className="relative z-10 flex justify-center pt-3 pb-1 sm:hidden">
        <div className="h-1.5 w-10 rounded-full bg-white/25" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1 sm:pt-6">
        <button
          type="button"
          onClick={closePlayer}
          aria-label="Collapse player"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink backdrop-blur-md bg-white/[0.06] border border-white/10 transition-all hover:bg-white/[0.12] active:scale-90"
        >
          <ChevronDown size={22} />
        </button>
        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted backdrop-blur-md">
          now playing
        </div>
        <button
          type="button"
          onClick={() => toggleInPlaylist(song)}
          aria-label={added ? 'Remove from playlist' : 'Add to playlist'}
          className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 active:scale-90 ${
            added
              ? 'border-transparent bg-mote text-bg0 shadow-[0_0_20px_-2px_rgba(216,247,155,0.7)]'
              : 'border-white/10 bg-white/[0.06] text-ink hover:border-mote/50'
          }`}
        >
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 sm:gap-7 px-6 pt-2 pb-[max(2rem,env(safe-area-inset-bottom))] overflow-y-auto">
        {/* Circular glowing artwork — closer to the reference look */}
        <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[300px] shrink-0">
          {/* Neon glow ring behind everything */}
          <div
            className="absolute -inset-3 rounded-full opacity-70 blur-2xl"
            style={{
              background:
                'conic-gradient(from 0deg, var(--color-mote), var(--color-amber), var(--color-mote))',
              animation: `fullSpin ${isPlaying ? '6s' : '20s'} linear infinite`,
            }}
          />

          {/* Orbiting rings, only alive while playing */}
          <span className="absolute -inset-5 rotate-[12deg] rounded-full motion-reduce:hidden">
            <span
              className="absolute inset-0 rounded-full border border-mote/25"
              style={{ animation: `fullSpin ${isPlaying ? '3.4s' : '9s'} linear infinite` }}
            >
              <i className="absolute -top-[3px] left-1/2 -ml-[3px] h-[6px] w-[6px] rounded-full bg-mote shadow-[0_0_10px_3px_rgba(216,247,155,0.9)]" />
            </span>
          </span>
          <span className="absolute -inset-9 rotate-[-24deg] scale-y-[0.85] rounded-full motion-reduce:hidden">
            <span
              className="absolute inset-0 rounded-full border border-amber/25"
              style={{ animation: `fullSpin ${isPlaying ? '5.2s' : '13s'} linear infinite reverse` }}
            >
              <i className="absolute -top-[3px] left-1/2 -ml-[3px] h-[6px] w-[6px] rounded-full bg-amber shadow-[0_0_10px_3px_rgba(255,184,107,0.9)]" />
            </span>
          </span>

          {/* Glass ring frame — now circular, like a vinyl label */}
          <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]" />
          <img
            src={art}
            alt=""
            className={`relative z-[2] h-full w-full rounded-full border-2 border-white/15 object-cover shadow-2xl transition-transform duration-700 ${
              isPlaying ? 'scale-100' : 'scale-[0.97]'
            }`}
          />

          {/* Repeat-one badge sits right on the artwork when active */}
          {repeatMode === 'one' && (
            <div className="absolute -bottom-1 -right-1 z-[3] flex h-9 w-9 items-center justify-center rounded-full bg-mote text-bg0 shadow-[0_0_16px_-2px_rgba(216,247,155,0.8)] border-2 border-bg0">
              <Repeat1 size={16} />
            </div>
          )}
        </div>

        {/* Glass card for title / artist, now with a mini waveform accent */}
        <div className="w-full max-w-[340px] rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-left">
              <div className="mb-1 truncate font-display text-xl font-bold">{decodeHtmlEntities(song.name)}</div>
              <div className="truncate text-sm text-muted">{decodeHtmlEntities(artistName(song))}</div>
            </div>
            <Waveform active={isPlaying} />
          </div>
        </div>

        <div className="w-full max-w-[340px]">
          <input
            type="range"
            className="kd-range w-full"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => requestSeek(Number(e.target.value))}
            style={{
              background: `linear-gradient(90deg, var(--color-mote) ${pct}%, rgba(255,255,255,0.14) ${pct}%)`,
            }}
            aria-label="Seek"
          />
          <div className="mt-1.5 flex justify-between font-mono text-xs text-muted">
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration)}</span>
          </div>
        </div>

        {/* Playback controls + repeat toggle in one row */}
        <div className="flex w-full max-w-[340px] items-center justify-center gap-4 pb-2">
          <div className="scale-110 sm:scale-125">
            <PlaybackControls />
          </div>
        </div>

        <button
          type="button"
          onClick={cycleRepeatMode}
          aria-label={repeatLabel}
          title={repeatLabel}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all active:scale-95 ${
            repeatMode !== 'off'
              ? 'border-transparent bg-mote text-bg0 shadow-[0_0_16px_-2px_rgba(216,247,155,0.7)]'
              : 'border-white/10 bg-white/[0.06] text-muted hover:border-mote/50 hover:text-ink'
          }`}
        >
          {repeatMode === 'one' ? <Repeat1 size={15} /> : <Repeat size={15} />}
          {repeatLabel}
        </button>

        {/* Volume control — glass pill. Store has no mute flag, so muting
            just remembers the last non-zero volume and restores it. */}
        <div className="flex w-full max-w-[340px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 backdrop-blur-xl">
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink transition-all hover:bg-white/[0.08] active:scale-90"
          >
            {volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 50 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
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
              background: `linear-gradient(90deg, var(--color-mote) ${volume}%, rgba(255,255,255,0.14) ${volume}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>

      <style>{`
        @keyframes fullSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes driftA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 30px) scale(1.15); }
        }
        @keyframes driftB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -20px) scale(1.1); }
        }
        @keyframes wfBar {
          from { height: 4px; }
          to { height: 16px; }
        }
      `}</style>
    </div>
  )
}