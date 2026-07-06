// Registers the service worker. Call once from main.jsx, after the app
// mounts — no need to block first paint on this.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((err) => console.error('Service worker registration failed:', err))
  })
}