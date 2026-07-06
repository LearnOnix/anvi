import { useCallback, useEffect, useState } from 'react'

// --- What this actually does --------------------------------------------
// Chrome/Edge on desktop AND Chrome on Android both fire a
// `beforeinstallprompt` event on `window` when the site qualifies as
// installable. We stash that event (you can only call .prompt() on it
// once), and expose `promptInstall()` to fire it from any button.
//
// IMPORTANT — this hook alone does not make the app installable.
// `beforeinstallprompt` only fires if ALL of these are true:
//   1. Served over https (or localhost)
//   2. A linked web app manifest.json exists with: name/short_name,
//      icons (at least 192px + 512px), start_url, display: "standalone"
//      (or "fullscreen"/"minimal-ui")
//   3. A service worker is registered (even a trivial one is enough)
//   4. The user hasn't already installed it / dismissed it too recently
//      (Chrome throttles repeat prompts for a few months per-origin)
// If any of those are missing, `canInstall` just stays false forever —
// that's the browser deciding it's not eligible, not a bug in this hook.
//
// iOS Safari never fires beforeinstallprompt (Apple doesn't support the
// API), so canInstall will be false there too — "Add to Home Screen" on
// iOS is manual, from Safari's share sheet, and can't be triggered by JS.
// --------------------------------------------------------------------------

export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const alreadyStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    setInstalled(alreadyStandalone)

    function onBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredEvent(e)
    }
    function onAppInstalled() {
      setInstalled(true)
      setDeferredEvent(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredEvent) return 'unavailable'
    deferredEvent.prompt()
    const { outcome } = await deferredEvent.userChoice // 'accepted' | 'dismissed'
    // a used prompt event can't be reused — clear it either way
    setDeferredEvent(null)
    return outcome
  }, [deferredEvent])

  return {
    canInstall: !!deferredEvent && !installed,
    installed,
    promptInstall,
  }
}