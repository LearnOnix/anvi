const API = import.meta.env.VITE_JIOSAAVN_API

async function safeFetch(url, signal) {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`bad response ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error('api reported failure')
  return json.data
}

// Trending songs are fetched from the API once on mount, and pinned songs

export async function getTrending() {
  const data = await safeFetch(`${API}/api/trending/songs?page=1&limit=16`)
  return data?.results || []
}

export async function searchSongs(query, signal) {
  const data = await safeFetch(
    `${API}/api/search/songs?query=${encodeURIComponent(query)}&page=0&limit=20`,
    signal
  )
  return data?.results || []
}