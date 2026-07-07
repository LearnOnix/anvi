import { Download, Smartphone, Check, X, Trash2 } from 'lucide-react'
import { useUI } from '../../store/uiStore'
import { useDownload } from '../../hooks/useDownload'
import { thumbUrl } from '../../utils/song'

// App-level sheet, same pattern as AddToPlaylistSheet: it reads the
// pending song from uiStore rather than being passed one directly, so
// any button anywhere (SongCard, FullPlayerSheet, ...) can open it with
// openDownloadOptions(song).
export default function DownloadOptionSheet() {
  const song = useUI((s) => s.pendingDownloadSong)
  const close = useUI((s) => s.closeDownloadOptions)
  const open = !!song

  const { status, progress, saveInApp, saveToDevice, remove } = useDownload(song)

  async function handleSaveInApp() {
    await saveInApp()
  }

  async function handleSaveToDevice() {
    await saveToDevice()
    close()
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end transition-opacity duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Download"
    >
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-full rounded-t-3xl border-t border-white/10 bg-[rgba(9,15,11,0.98)] px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mb-3 flex justify-center">
          <div className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">download</span>
          <button
            onClick={close}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {song && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3.5 py-3">
            <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
              <img src={thumbUrl(song)} alt="" className="h-full w-full object-cover" />
            </span>
            <span className="truncate text-sm font-semibold">{song.name}</span>
          </div>
        )}

        {/* Already saved in Moon — offer to remove instead of the two choices */}
        {status === 'saved' ? (
          <button
            type="button"
            onClick={async () => { await remove() }}
            className="flex w-full items-center gap-3 rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3.5 text-left transition-colors hover:bg-red-400/[0.1] active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-red-300">
              <Trash2 size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">Remove from Moon</span>
              <span className="block text-xs text-muted">Already saved for offline play — tap to delete it</span>
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSaveInApp}
              disabled={status === 'downloading'}
              className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-mote/25 bg-mote/[0.05] px-4 py-3.5 text-left transition-all hover:border-mote/40 hover:bg-mote/[0.08] active:scale-[0.99] disabled:active:scale-100"
            >
              {status === 'downloading' && (
                <span
                  className="absolute inset-y-0 left-0 bg-mote/[0.12]"
                  style={{ width: `${Math.max(6, progress * 100)}%`, transition: 'width 0.2s linear' }}
                />
              )}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mote/15 text-mote">
                {status === 'downloading' ? (
                  <span className="text-[11px] font-bold tabular-nums">{Math.round(progress * 100)}%</span>
                ) : (
                  <Download size={18} />
                )}
              </span>
              <span className="relative min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">Save in Moon</span>
                <span className="block text-xs text-muted">
                  {status === 'downloading' ? 'Downloading…' : 'Play offline, right here in the app · recommended'}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleSaveToDevice}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06] active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-muted">
                <Smartphone size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink">Save to device</span>
                <span className="block text-xs text-muted">A regular file, in your phone's Downloads</span>
              </span>
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-300">
            <X size={13} /> Couldn't save that — check your connection and try again.
          </div>
        )}
      </div>
    </div>
  )
}