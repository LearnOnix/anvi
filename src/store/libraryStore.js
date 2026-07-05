import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { songId } from '../utils/song'

const RECENT_MAX = 24

// Persists to localStorage under the key "anu-library".
// Survives refresh automatically via zustand's persist middleware —
// this is the direct equivalent of the old anu_recent_v1 / anu_playlist_v1 keys.
export const useLibrary = create(
  persist(
    (set, get) => ({
      recent: [],
      playlist: [],

      addToRecent: (song) => {
        const id = songId(song)
        const withoutDupe = get().recent.filter((s) => songId(s) !== id)
        set({ recent: [song, ...withoutDupe].slice(0, RECENT_MAX) })
      },

      isInPlaylist: (song) => {
        const id = songId(song)
        return get().playlist.some((s) => songId(s) === id)
      },

      // returns true if the song was just added, false if it was just removed
      toggleInPlaylist: (song) => {
        const id = songId(song)
        const exists = get().playlist.some((s) => songId(s) === id)
        const next = exists
          ? get().playlist.filter((s) => songId(s) !== id)
          : [song, ...get().playlist]
        set({ playlist: next })
        return !exists
      },

      clearRecent: () => set({ recent: [] }),
      clearPlaylist: () => set({ playlist: [] }),
    }),
    { name: 'anu-library' }
  )
)
