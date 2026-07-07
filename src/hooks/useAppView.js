import { useMemo, useState } from 'react'
import { DOWNLOADS_ID } from '../components/playlist/PlaylistsOverview'

// Owns everything about "what is currently on screen": active tab,
// active playlist, whether we're on the Downloads pseudo-playlist, and
// the derived `view` object SongGrid needs (label/count/songs/empty
// copy/clear handler). Pulled out of App.jsx so App.jsx only wires
// components together instead of also carrying this branching logic.
export function useAppView({
  isSearching,
  debouncedQuery,
  searchResults,
  searchLoading,
  trending,
  trendingLoading,
  recent,
  clearRecent,
  playlists,
  clearPlaylistSongs,
}) {
  const [activeTab, setActiveTab] = useState('trending')
  const [activePlaylistId, setActivePlaylistId] = useState(null)

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab !== 'playlist') setActivePlaylistId(null)
  }

  const showDownloads = activeTab === 'playlist' && activePlaylistId === DOWNLOADS_ID

  const activePlaylist =
    activeTab === 'playlist' && activePlaylistId && activePlaylistId !== DOWNLOADS_ID
      ? playlists[activePlaylistId]
      : null

  const showPlaylistsOverview =
    activeTab === 'playlist' && !activePlaylist && !showDownloads && !isSearching
  const showMoodsPage = activeTab === 'moods' && !isSearching
  const showSongGrid = !showMoodsPage && !showPlaylistsOverview && !showDownloads

  const view = useMemo(() => {
    if (isSearching) {
      return {
        label: `results for "${debouncedQuery}"`,
        count: searchLoading ? '' : `${searchResults.length} found`,
        songs: searchResults,
        loading: searchLoading,
        emptyTitle: 'no echoes answered back.',
        emptySub: 'the search trail went cold — try another word.',
        showClear: false,
      }
    }
    if (activeTab === 'recent') {
      return {
        label: 'recently played',
        count: `${recent.length} echoes`,
        songs: recent,
        loading: false,
        emptyTitle: 'nothing echoed back yet.',
        emptySub: "play a song and it'll show up here — even after you refresh.",
        showClear: recent.length > 0,
        onClear: clearRecent,
      }
    }
    if (activeTab === 'playlist' && activePlaylist) {
      return {
        label: activePlaylist.name,
        count: `${activePlaylist.songs.length} songs`,
        songs: activePlaylist.songs,
        loading: false,
        emptyTitle: 'this playlist is quiet.',
        emptySub: 'tap the + on any song to keep it here.',
        showClear: activePlaylist.songs.length > 0,
        onClear: () => clearPlaylistSongs(activePlaylist.id),
      }
    }
    if (activeTab === 'search') {
      return {
        label: 'search', count: '', songs: [], loading: false,
        emptyTitle: 'type something above.',
        emptySub: 'search for a song, an artist, or just a vibe.',
        showClear: false,
      }
    }
    return {
      label: 'trending now',
      count: trendingLoading ? '' : `${trending.length} echoes`,
      songs: trending,
      loading: trendingLoading,
      emptyTitle: 'the forest went quiet.',
      emptySub: "couldn't reach the trending feed — try again in a moment.",
      showClear: false,
    }
  }, [
    isSearching, debouncedQuery, searchResults, searchLoading,
    activeTab, recent, trending, trendingLoading,
    activePlaylist, clearRecent, clearPlaylistSongs,
  ])

  return {
    activeTab,
    activePlaylistId,
    setActivePlaylistId,
    handleTabChange,
    activePlaylist,
    showDownloads,
    showPlaylistsOverview,
    showMoodsPage,
    showSongGrid,
    view,
  }
}