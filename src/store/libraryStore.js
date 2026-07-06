import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { songId } from '../utils/song'

const RECENT_MAX = 24
const DEFAULT_PLAYLIST_ID = 'default'

function makePlaylist(id, name, songs = []) {
  return { id, name, songs, createdAt: Date.now() }
}

export const useLibrary = create(
  persist(
    (set, get) => ({
      recent: [],
      playlists: {
        [DEFAULT_PLAYLIST_ID]: makePlaylist(DEFAULT_PLAYLIST_ID, 'My Playlist'),
      },

      addToRecent: (song) => {
        const id = songId(song)
        const withoutDupe = get().recent.filter((s) => songId(s) !== id)
        set({ recent: [song, ...withoutDupe].slice(0, RECENT_MAX) })
      },
      clearRecent: () => set({ recent: [] }),

      // ---- named playlists ----
      createPlaylist: (name) => {
        const id = `pl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        set({ playlists: { ...get().playlists, [id]: makePlaylist(id, name.trim() || 'Untitled') } })
        return id
      },

      renamePlaylist: (id, name) => {
        const pl = get().playlists[id]
        if (!pl) return
        set({ playlists: { ...get().playlists, [id]: { ...pl, name: name.trim() || pl.name } } })
      },

      deletePlaylist: (id) => {
        if (id === DEFAULT_PLAYLIST_ID) return // ek playlist hamesha rahegi
        const next = { ...get().playlists }
        delete next[id]
        set({ playlists: next })
      },

      isSongInPlaylist: (id, song) => {
        const pl = get().playlists[id]
        if (!pl) return false
        const sid = songId(song)
        return pl.songs.some((s) => songId(s) === sid)
      },

      isSongInAnyPlaylist: (song) => {
        const sid = songId(song)
        return Object.values(get().playlists).some((pl) => pl.songs.some((s) => songId(s) === sid))
      },

      addSongToPlaylist: (id, song) => {
        const pl = get().playlists[id]
        if (!pl) return
        const sid = songId(song)
        if (pl.songs.some((s) => songId(s) === sid)) return
        set({ playlists: { ...get().playlists, [id]: { ...pl, songs: [song, ...pl.songs] } } })
      },

      removeSongFromPlaylist: (id, song) => {
        const pl = get().playlists[id]
        if (!pl) return
        const sid = songId(song)
        set({
          playlists: {
            ...get().playlists,
            [id]: { ...pl, songs: pl.songs.filter((s) => songId(s) !== sid) },
          },
        })
      },

      toggleSongInPlaylist: (id, song) => {
        const inPl = get().isSongInPlaylist(id, song)
        if (inPl) get().removeSongFromPlaylist(id, song)
        else get().addSongToPlaylist(id, song)
        return !inPl
      },

      clearPlaylistSongs: (id) => {
        const pl = get().playlists[id]
        if (!pl) return
        set({ playlists: { ...get().playlists, [id]: { ...pl, songs: [] } } })
      },

      // ---- back-compat: FullPlayerSheet abhi bhi ye purane naam use karta
      // hai, isliye inhe default playlist ki taraf point kar diya hai taaki
      // wo file edit kiye bina chalti rahe ----
      isInPlaylist: (song) => get().isSongInPlaylist(DEFAULT_PLAYLIST_ID, song),
      toggleInPlaylist: (song) => get().toggleSongInPlaylist(DEFAULT_PLAYLIST_ID, song),
      clearPlaylist: () => get().clearPlaylistSongs(DEFAULT_PLAYLIST_ID),
    }),
    {
      name: 'anu-library',
      version: 2,
      migrate: (persisted, version) => {
        if (version < 2 && persisted) {
          const oldSongs = persisted.playlist || []
          return {
            ...persisted,
            playlists: {
              [DEFAULT_PLAYLIST_ID]: makePlaylist(DEFAULT_PLAYLIST_ID, 'My Playlist', oldSongs),
            },
          }
        }
        return persisted
      },
    }
  )
)