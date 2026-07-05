import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Local-only profile — no accounts, no backend. Just a name and a photo
// that live on this device via zustand's persist middleware (localStorage
// under the hood). Good enough to personalize the app without ever
// touching auth.
export const useProfile = create(
  persist(
    (set) => ({
      name: 'Listener',
      photo: null, // small base64 data URL, or null for the initial-letter avatar

      setName: (name) => set({ name: name.trim() || 'Listener' }),
      setPhoto: (photo) => set({ photo }),
      clearPhoto: () => set({ photo: null }),
    }),
    { name: 'anu-profile' } // localStorage key
  )
)