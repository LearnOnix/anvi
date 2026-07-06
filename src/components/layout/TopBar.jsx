import { useEffect, useMemo, useRef, useState } from 'react'
import NowPlaying from '../player/NowPlaying'

// --- Design notes -----------------------------------------------------
// Palette add-ons (layered on top of your existing bg0 / mote tokens):
//   sakura  #FFB7C9   — petal fill, warm accent line
//   yozora  #8FA3FF   — cool "night sky" companion to sakura, used in the
//                        top hairline gradient + burst petal variant
//   koharu  #FFE29A   — faint gold, used only on the sparkle glint
//
// Signature move: a hairline sakura→yozora gradient sits on the very top
// edge of the bar (like light catching the rim of a glass), a few petals
// drift ambiently behind the glass at all times, and when `trackId`
// changes (i.e. a new song starts) a short burst of petals falls across
// the bar — the "song just started" moment you asked for. Everything
// else stays quiet so it reads minimal, not busy.
//
// Usage: <TopBar trackId={currentTrack?.id} />
// If you don't have a stable id handy, any value that changes when a new
// song starts (title+artist string, queue index, etc.) works fine.
// ------------------------------------------------------------------------

const AMBIENT_PETALS = [
  { left: 6, size: 7, dur: 14, delay: 0, drift: -18, tone: 'sakura', op: 0.22 },
  { left: 22, size: 5, dur: 11, delay: 3, drift: 14, tone: 'yozora', op: 0.16 },
  { left: 41, size: 6, dur: 16, delay: 1.5, drift: -10, tone: 'sakura', op: 0.18 },
  { left: 63, size: 5, dur: 12.5, delay: 5, drift: 20, tone: 'sakura', op: 0.14 },
  { left: 80, size: 7, dur: 15, delay: 2.2, drift: -16, tone: 'yozora', op: 0.2 },
  { left: 93, size: 4, dur: 10, delay: 6.5, drift: 12, tone: 'sakura', op: 0.15 },
]

function Petal({ size = 6, tone = 'sakura', className = '', style }) {
  const fill = tone === 'sakura' ? '#FFB7C9' : '#8FA3FF'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 1c3 3.4 6 6.7 6 10a6 6 0 1 1-12 0c0-3.3 3-6.6 6-10z"
        fill={fill}
      />
    </svg>
  )
}

function AmbientPetals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {AMBIENT_PETALS.map((p, i) => (
        <Petal
          key={i}
          size={p.size}
          tone={p.tone}
          className="absolute top-[-12px]"
          style={{
            left: `${p.left}%`,
            opacity: p.op,
            animation: `petal-fall ${p.dur}s linear ${p.delay}s infinite`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

function BurstPetals({ burstId }) {
  const petals = useMemo(() => {
    if (!burstId) return []
    return Array.from({ length: 14 }, (_, i) => {
      const seed = (burstId * 31 + i * 17) % 97
      return {
        left: (seed * 3.7) % 100,
        size: 5 + (seed % 5),
        dur: 1.6 + (seed % 9) / 10,
        delay: (i % 7) * 0.06,
        drift: ((seed % 2 === 0 ? 1 : -1) * (20 + (seed % 30))),
        tone: seed % 3 === 0 ? 'yozora' : 'sakura',
      }
    })
  }, [burstId])

  if (!petals.length) return null

  return (
    <div
      key={burstId}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {petals.map((p, i) => (
        <Petal
          key={i}
          size={p.size}
          tone={p.tone}
          className="absolute top-[-14px]"
          style={{
            left: `${p.left}%`,
            animation: `petal-burst ${p.dur}s cubic-bezier(0.22,0.61,0.36,1) ${p.delay}s forwards`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export default function TopBar({ trackId }) {
  const [burstId, setBurstId] = useState(0)
  const prevTrack = useRef(trackId)
  const clearTimer = useRef(null)

  useEffect(() => {
    if (trackId === undefined) return
    if (prevTrack.current !== trackId && prevTrack.current !== undefined) {
      setBurstId((n) => n + 1)
      clearTimeout(clearTimer.current)
      clearTimer.current = setTimeout(() => setBurstId(0), 2600)
    }
    prevTrack.current = trackId
    return () => clearTimeout(clearTimer.current)
  }, [trackId])

  return (
    <div className="sticky top-0 z-20 overflow-hidden border-b border-white/10 bg-bg0/70 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      {/* rim light: hairline gradient catching the top edge of the glass */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent, #FFB7C9, #8FA3FF, transparent)',
          animation: 'rim-sweep 9s ease-in-out infinite',
          opacity: 0.55,
        }}
      />

      <AmbientPetals />
      <BurstPetals burstId={burstId} />

      <div className="relative mx-auto flex max-w-[1180px] items-center justify-between gap-2 px-4 py-3 sm:gap-3.5 sm:px-5 sm:py-3.5">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="group relative flex h-7 w-7 items-center justify-center">
            {/* crescent moon glyph, replaces the plain dot */}
            <span
              className="absolute inset-0 rounded-full opacity-40 blur-md transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: 'radial-gradient(circle, #8FA3FF, transparent 70%)' }}
            />
            <svg viewBox="0 0 24 24" className="relative h-4.5 w-4.5">
              <path
                d="M15.5 3.5a8.5 8.5 0 1 0 0 17 8.9 8.9 0 0 1 0-17z"
                fill="currentColor"
                className="text-mote"
              />
            </svg>
            <span
              className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-[#FFE29A]"
              style={{ animation: 'twinkle 2.4s ease-in-out infinite' }}
            />
          </div>

          <div className="font-display text-lg font-black tracking-tight">
            Moon<span className="text-mote">.</span>
          </div>

          {/* tiny equalizer accent — quiet, only reads as "alive" up close */}
          <div className="ml-1 flex items-end gap-[2px]" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[2.5px] rounded-full bg-[#FFB7C9]/70"
                style={{
                  height: 6,
                  animation: `eq-bar 1.1s ease-in-out ${i * 0.18}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 max-w-[65%] flex-1 justify-end overflow-hidden sm:max-w-[70%]">
          {/* second glass tier: a soft pill behind NowPlaying so it sits
              on its own layer of depth rather than flush on the bar */}
          <div className="min-w-0 rounded-full bg-white/[0.04] px-1 py-0.5 ring-1 ring-white/[0.06] backdrop-blur-md">
            <NowPlaying />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes rim-sweep {
          0%, 100% { background-position: 0% 0; }
          50% { background-position: 100% 0; }
        }
        @keyframes eq-bar {
          0%, 100% { height: 4px; opacity: 0.5; }
          50% { height: 11px; opacity: 1; }
        }
        @keyframes petal-fall {
          0% { transform: translate(0, -10px) rotate(0deg); }
          100% { transform: translate(var(--drift), 64px) rotate(160deg); }
        }
        @keyframes petal-burst {
          0% { transform: translate(0, -14px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(var(--drift), 90px) rotate(280deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}