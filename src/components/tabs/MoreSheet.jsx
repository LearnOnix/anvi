import { Trash2, ListX, Info, X } from 'lucide-react'
import { useLibrary } from '../../store/libraryStore'

// Simple glass bottom sheet. Not tied to BottomNav's `active` state on
// purpose — it's an overlay action, not a page, so opening it never
// changes which tab you're "on" underneath.
export default function MoreSheet({ open, onClose }) {
  const clearRecent = useLibrary((s) => s.clearRecent)
  const clearPlaylist = useLibrary((s) => s.clearPlaylist)

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="More"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div
        className={`relative z-10 w-full rounded-t-3xl border-t border-white/10 bg-[rgba(9,15,11,0.97)] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mb-3 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">more</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => { clearRecent(); onClose() }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-ink transition-colors hover:bg-white/[0.05] active:scale-[0.99]"
          >
            <ListX size={18} className="text-muted" />
            Clear recently played
          </button>

          <button
            type="button"
            onClick={() => { clearPlaylist(); onClose() }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-ink transition-colors hover:bg-white/[0.05] active:scale-[0.99]"
          >
            <Trash2 size={18} className="text-muted" />
            Clear my playlist
          </button>

          <div className="my-1 border-t border-line" />

          <div className="flex items-start gap-3 rounded-xl px-3 py-3 text-left text-sm text-muted">
            <Info size={18} className="mt-0.5 shrink-0" />
            <span>
              Anu keeps your recently played and playlist saved on this device only —
              clearing here can't be undone.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}