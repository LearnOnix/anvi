import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import AnuField from './components/background/AnuField'
import TopBar from './components/layout/TopBar'
import SearchBar from './components/layout/SearchBar'
import Hero from './components/layout/Hero'
import BottomNav from './components/tabs/BottomNav'
import MoreSheet from './components/tabs/MoreSheet'
import SongGrid from './components/songs/SongGrid'
import PlayerBar from './components/player/PlayerBar'
import MoodsPage from './components/moods/MoodsPage'
import PlaylistsOverview from './components/playlist/PlaylistsOverview'
import { getTrending, searchSongs } from './api/jiosaavn'
import { useDebounce } from './hooks/useDebounce'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useLibrary } from './store/libraryStore'
import { PINNED_TRENDING } from './config/pinnedSongs'
import { usePlayer } from './store/playerStore'
import { songId } from './utils/song'
import AddToPlaylistSheet from './components/playlist/AddToPlaylistSheet'

export default function App() {
  useAudioEngine()

  const currentSong = usePlayer((s) => s.currentSong())

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 420)
  const isSearching = debouncedQuery.trim().length > 0

  const [activeTab, setActiveTab] = useState('trending')
  const [moreOpen, setMoreOpen] = useState(false)
  const [activePlaylistId, setActivePlaylistId] = useState(null)

  const [trending, setTrending] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const recent = useLibrary((s) => s.recent)
  const playlists = useLibrary((s) => s.playlists)
  const clearRecent = useLibrary((s) => s.clearRecent)
  const clearPlaylistSongs = useLibrary((s) => s.clearPlaylistSongs)

  const playlistCount = Object.values(playlists).reduce((sum, pl) => sum + pl.songs.length, 0)

  useEffect(() => {
    let cancelled = false
    setTrendingLoading(true)
    Promise.all([
      getTrending(),
      Promise.all(
        PINNED_TRENDING.map((name) =>
          searchSongs(name).then((r) => r?.[0] || null).catch(() => null)
        )
      ),
    ])
      .then(([results, pinnedResults]) => {
        if (cancelled) return
        const pinnedSongs = pinnedResults.filter(Boolean)
        const pinnedIds = new Set(pinnedSongs.map(songId))
        setTrending([...pinnedSongs, ...results.filter((s) => !pinnedIds.has(songId(s)))])
      })
      .catch(() => { if (!cancelled) setTrending([]) })
      .finally(() => { if (!cancelled) setTrendingLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isSearching) { setSearchResults([]); return }
    const controller = new AbortController()
    setSearchLoading(true)
    searchSongs(debouncedQuery, controller.signal)
      .then((results) => setSearchResults(results))
      .catch((err) => { if (err.name !== 'AbortError') setSearchResults([]) })
      .finally(() => setSearchLoading(false))
    return () => controller.abort()
  }, [debouncedQuery, isSearching])

  function handleTabChange(tab) {
    setActiveTab(tab)
    setQuery('')
    if (tab !== 'playlist') setActivePlaylistId(null)
  }

  const activePlaylist = activePlaylistId ? playlists[activePlaylistId] : null

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

  const showPlaylistsOverview = activeTab === 'playlist' && !activePlaylist && !isSearching
  const showMoodsPage = activeTab === 'moods' && !isSearching
  const showSongGrid = !showMoodsPage && !showPlaylistsOverview

  return (
    <>
      <AnuField />
      <TopBar
       trackId={currentSong ? songId(currentSong) : null}
       onSearchClick={() => handleTabChange('search')} />

      <div className="relative z-[1] mx-auto max-w-[1180px] px-3.5 pb-[210px] sm:px-5 sm:pb-[170px]">
  {activeTab === 'trending' && !isSearching && <Hero />}

        {activeTab === 'search' && (
          <SearchBar query={query} onQueryChange={setQuery} onClear={() => setQuery('')} />
        )}

        {showMoodsPage && (
          <section className="mt-4">
            <MoodsPage />
          </section>
        )}

        {showPlaylistsOverview && (
          <section className="mt-4">
            <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              my playlists
            </div>
            <PlaylistsOverview onOpenPlaylist={setActivePlaylistId} />
          </section>
        )}

        {showSongGrid && (
          <section className="mt-4">
            <div className="mb-3.5 flex items-baseline justify-between gap-2.5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {activePlaylist && (
                  <button
                    type="button"
                    onClick={() => setActivePlaylistId(null)}
                    aria-label="Back to playlists"
                    className="text-ink hover:text-mote"
                  >
                    <ChevronLeft size={15} />
                  </button>
                )}
                {view.label}
              </div>
              <div className="flex items-center gap-3">
                {view.showClear && (
                  <button
                    type="button"
                    onClick={view.onClear}
                    className="font-mono text-[0.68rem] text-faint underline decoration-1 underline-offset-2 hover:text-amber"
                  >
                    clear
                  </button>
                )}
                <div className="font-mono text-xs text-faint">{view.count}</div>
              </div>
            </div>

            <SongGrid
              songs={view.songs}
              loading={view.loading}
              emptyTitle={view.emptyTitle}
              emptySub={view.emptySub}
            />
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col">
        <PlayerBar />
        <BottomNav
          active={activeTab}
          onChange={handleTabChange}
          recentCount={recent.length}
          playlistCount={playlistCount}
          onOpenMore={() => setMoreOpen(true)}
        />
      </div>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
        <AddToPlaylistSheet />
    </>
  )
}