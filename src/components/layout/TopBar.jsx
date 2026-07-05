import NowPlaying from '../player/NowPlaying'

// Search moved out (see SearchBar.jsx, opened from BottomNav). In its
// place: whatever's currently spinning, always one tap from the full
// player, right where the eye lands first.
export default function TopBar() {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-bg0/70 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2 px-4 py-3 sm:gap-3.5 sm:px-5 sm:py-3.5">
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-mote"
              style={{ animation: 'twinkle 2.4s ease-in-out infinite' }}
            />
          </span>
          <div className="font-display text-lg font-black tracking-tight">
            Moon<span className="text-mote">.</span>
          </div>
        </div>

        <div className="flex min-w-0 max-w-[65%] flex-1 justify-end overflow-hidden sm:max-w-[70%]">
          <NowPlaying />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}