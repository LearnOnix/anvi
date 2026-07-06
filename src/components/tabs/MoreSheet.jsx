import { useState } from 'react'
import { Trash2, ListX, Info, X, Download, Check, Loader2 } from 'lucide-react'
import { useLibrary } from '../../store/libraryStore'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import ProfileCard from '../profile/ProfileCard'
import ProfileEditSheet from '../profile/ProfileEditSheet'

// Simple glass bottom sheet. Not tied to BottomNav's `active` state on
// purpose — it's an overlay action, not a page, so opening it never
// changes which tab you're "on" underneath.
export default function MoreSheet({ open, onClose }) {
  const clearRecent = useLibrary((s) => s.clearRecent)
  const clearPlaylist = useLibrary((s) => s.clearPlaylist)

  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const { canInstall, promptInstall } = useInstallPrompt()
  const [installPhase, setInstallPhase] = useState('idle') // idle | prompting | success
  const showInstallCard = canInstall || installPhase === 'success'

  async function handleInstall() {
    if (installPhase === 'prompting') return
    setInstallPhase('prompting')
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setInstallPhase('success')
      setTimeout(() => setInstallPhase('idle'), 1800)
    } else {
      setInstallPhase('idle')
    }
  }

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

        <ProfileCard onEdit={() => setIsEditingProfile(true)} />

        {showInstallCard && (
          <button
            type="button"
            onClick={handleInstall}
            disabled={installPhase === 'prompting'}
            className={`group relative mt-3 flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.99] ${
              installPhase === 'success'
                ? 'border-mote/50 bg-mote/[0.08]'
                : 'border-mote/25 bg-mote/[0.05] hover:border-mote/40 hover:bg-mote/[0.08]'
            }`}
          >
            {/* breathing glow ring behind the icon — the "look at me once" moment */}
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              {installPhase !== 'success' && (
                <span
                  className="absolute inset-0 rounded-full bg-mote/25"
                  style={{ animation: 'install-pulse 2.2s ease-in-out infinite' }}
                />
              )}
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-mote/15 text-mote">
                {installPhase === 'prompting' ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : installPhase === 'success' ? (
                  <span style={{ animation: 'pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
                    <Check size={18} />
                  </span>
                ) : (
                  <Download size={18} />
                )}
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">
                {installPhase === 'success' ? 'Installed!' : 'Install Moon'}
              </span>
              <span className="block text-xs text-muted">
                {installPhase === 'success'
                  ? 'Find it on your home screen or desktop'
                  : 'Add to your home screen or desktop, works offline'}
              </span>
            </span>
          </button>
        )}

        <div className="my-4 border-t border-line" />

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
              moon keeps your recently played and playlist saved on this device only —
              clearing here can't be undone.
            </span>
          </div>
        </div>
      </div>

      <ProfileEditSheet isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} />

      <style>{`
        @keyframes install-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}