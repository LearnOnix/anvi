import { TrendingUp, History, ListMusic } from 'lucide-react'

const TABS = [
  { id: 'trending', label: 'trending', icon: TrendingUp },
  { id: 'recent', label: 'recently played', icon: History, countKey: 'recentCount' },
  { id: 'playlist', label: 'my playlist', icon: ListMusic, countKey: 'playlistCount' },
]

export default function TabBar({ active, onChange, recentCount, playlistCount }) {
  const counts = { recentCount, playlistCount }

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 mt-1.5 mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TABS.map(({ id, label, icon: Icon, countKey }) => {
        const isActive = active === id
        const count = countKey ? counts[countKey] : 0
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[0.82rem] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
              isActive
                ? 'border-mote/40 bg-mote/10 text-mote'
                : 'border-line bg-white/[0.02] text-muted hover:border-mote/25 hover:text-ink'
            }`}
          >
            <Icon size={15} />
            {label}
            {count > 0 && <span className="font-mono text-[0.68rem] opacity-75">· {count}</span>}
          </button>
        )
      })}
    </div>
  )
}
