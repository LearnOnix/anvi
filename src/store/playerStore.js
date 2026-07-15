import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useLibrary } from './libraryStore'

// Playback intent lives here. The actual <audio> element is a plain module
// singleton (see src/audio/audioElement.js) wired up by useAudioEngine —
// this store never touches the DOM directly, it just describes what
// *should* be happening, and the engine hook makes it so.
//
// Persisted to localStorage under "anu-player" so a refresh keeps you on
// the same song, at the same spot, at the same volume. isPlaying is
// deliberately NOT persisted as true — browsers block autoplay without a
// fresh user gesture anyway, so we always come back paused and let the
// engine seek to the saved position, ready for the user to hit play.
export const usePlayer = create(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      volume: 80,
      currentTime: 0,
      duration: 0,
      seekTarget: null, // bumped whenever the user drags the seek bar
      repeatMode: 'off', // 'off' | 'all' | 'one'

      currentSong: () => {
        const { queue, currentIndex } = get()
        return currentIndex >= 0 ? queue[currentIndex] ?? null : null
      },


      clearCurrent: () => set({ currentIndex: -1, isPlaying: false }),
      
      playFromQueue: (list, idx) => {
        const song = list[idx]
        set({ queue: list, currentIndex: idx, isPlaying: true })
        if (song) useLibrary.getState().addToRecent(song)
      },

      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

      cycleRepeatMode: () =>
        set((s) => ({
          repeatMode:
            s.repeatMode === 'off' ? 'all' : s.repeatMode === 'all' ? 'one' : 'off',
        })),

      next: () => {
        const { queue, currentIndex } = get()
        if (!queue.length) return
        const n = (currentIndex + 1) % queue.length
        set({ currentIndex: n, isPlaying: true })
        useLibrary.getState().addToRecent(queue[n])
      },

      prev: () => {
        const { queue, currentIndex } = get()
        if (!queue.length) return
        const n = (currentIndex - 1 + queue.length) % queue.length
        set({ currentIndex: n, isPlaying: true })
        useLibrary.getState().addToRecent(queue[n])
      },

      setVolume: (v) => set({ volume: v }),
      setProgress: (currentTime, duration) => set({ currentTime, duration }),
      requestSeek: (t) => set({ seekTarget: t }),
    }),
    {
      name: 'anu-player',
      // only keep what's needed to restore playback — duration and
      // seekTarget are runtime-derived and would just be stale on reload
      partialize: (s) => ({
        queue: s.queue,
        currentIndex: s.currentIndex,
        volume: s.volume,
        currentTime: s.currentTime,
        repeatMode: s.repeatMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // never resume "playing" straight out of storage — force paused,
        // and point the engine at the saved timestamp so it can seek
        // there once the audio element has the right src loaded
        state.isPlaying = false
        state.seekTarget = state.currentTime
      },
    }
  )
)