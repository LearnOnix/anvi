import { TrendingUp, History, ListMusic, Search, MoreHorizontal, Sparkles } from 'lucide-react'

const TABS = [
  { id: 'trending', label: 'trending', icon: TrendingUp },
  { id: 'moods', label: 'moods', icon: Sparkles },
  { id: 'recent', label: 'recent', icon: History, countKey: 'recentCount' },
  { id: 'playlist', label: 'playlist', icon: ListMusic, countKey: 'playlistCount' },
  { id: 'search', label: 'search', icon: Search },
  { id: 'more', label: 'more', icon: MoreHorizontal, isAction: true },
]

export default function BottomNav({ active, onChange, recentCount, playlistCount, onOpenMore }) {
  const counts = { recentCount, playlistCount }

  return (
    <nav
      className="border-t border-line bg-bg0/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-[560px] items-stretch justify-between px-1">
        {TABS.map(({ id, label, icon: Icon, countKey, isAction }) => {
          const isActive = !isAction && active === id
          const count = countKey ? counts[countKey] : 0

          return (
            <button
              key={id}
              type="button"
              onClick={() => (isAction ? onOpenMore() : onChange(id))}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-muted transition-colors active:scale-95"
            >
              <span
                className={`absolute top-1 h-8 w-11 rounded-full bg-mote/10 transition-all duration-300 ${
                  isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}
              />
              <span className="relative">
                <Icon size={19} className={isActive ? 'text-mote' : ''} strokeWidth={isActive ? 2.4 : 2} />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-amber px-[3px] font-mono text-[0.55rem] font-bold text-bg0">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </span>
              <span
                className={`relative font-mono text-[0.58rem] uppercase tracking-[0.06em] ${
                  isActive ? 'text-mote' : ''
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}