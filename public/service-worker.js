// Minimal service worker.
// Two jobs: (1) its mere presence + registration is what unlocks the
// install prompt on Chrome/Edge/Android, (2) it gives a basic offline
// fallback so the shell still loads with no connection.
//
// Bump this on every deploy that changes cached files, so old caches
// get cleaned up instead of serving stale assets forever.
const CACHE_VERSION = 'moon-v1'
const APP_SHELL = ['/', '/index.html', '/manifest.json']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  )
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

  // cache-first for everything else (hashed static assets, images)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
        }
        return response
      })
    })
  )
})