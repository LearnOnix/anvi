import { precacheAndRoute } from 'workbox-precaching'

// Vite-plugin-pwa injects the actual list of built files (hashed JS/CSS/HTML/
// icons) into this call at build time — this is what makes offline work on
// a fresh/incognito tab too, not just after the app is installed.
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  // network-first for navigations, so users always get fresh content
  // when online, and something usable when they're not
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // cache-first for everything else — precacheAndRoute already handles
  // all known build assets, this is just a safety net for anything else
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
    })
  )
})