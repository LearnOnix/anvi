import { create } from 'zustand'

// Small bit of pure UI state: is the full-screen "now playing" sheet open.
// Kept separate from playerStore because it's about presentation, not playback.
export const useUI = create((set) => ({
  isPlayerExpanded: false,
  openPlayer: () => set({ isPlayerExpanded: true }),
  closePlayer: () => set({ isPlayerExpanded: false }),
  togglePlayer: () => set((s) => ({ isPlayerExpanded: !s.isPlayerExpanded })),
}))
