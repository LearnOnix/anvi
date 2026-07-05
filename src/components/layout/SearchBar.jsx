import { X } from 'lucide-react'

// Lives at the top of the 'search' tab's content now, instead of always
// being pinned in TopBar — keeps the header calm and puts search where
// people expect it in an app: one tap away, not permanently in their face.
export default function SearchBar({ query, onQueryChange, onClear }) {
  return (
    <div className="sticky top-0 z-20 -mx-5 mb-3 border-b border-line bg-bg0/90 px-5 py-3 backdrop-blur-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="search a song, artist, a vibe…"
          autoComplete="off"
          autoFocus
          className="w-full rounded-full border border-line bg-white/[0.03] px-4 py-2.5 pr-10 text-sm text-ink placeholder:text-faint outline-none focus-visible:outline-2 focus-visible:outline-amber"
        />
        {query && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6.5 w-6.5 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}