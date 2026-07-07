import { useEffect, useState } from 'react'
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
import DownloadsPage from './components/playlist/DownloadsPage'
import { getTrending, searchSongs } from './api/jiosaavn'
import { useDebounce } from './hooks/useDebounce'
import { useAudioEngine } from './hooks/useAudioEngine'
import { useAppView } from './hooks/useAppView'
import { useLibrary } from './store/libraryStore'
import { PINNED_TRENDING } from './config/pinnedSongs'
import { usePlayer } from './store/playerStore'
import { songId } from './utils/song'
import AddToPlaylistSheet from './components/playlist/AddToPlaylistSheet'
import DownloadOptionSheet from './components/playlist/DownloadOptionSheet'

export default function App() {
  useAudioEngine()

  const currentSong = usePlayer((s) => s.currentSong())

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 420)
  const isSearching = debouncedQuery.trim().length > 0

  const [moreOpen, setMoreOpen] = useState(false)

  const [trending, setTrending] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)

  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const recent = useLibrary((s) => s.recent)
  const playlists = useLibrary((s) => s.playlists)
  const clearRecent = useLibrary((s) => s.clearRecent)
  const clearPlaylistSongs = useLibrary((s) => s.clearPlaylistSongs)

  const playlistCount = Object.values(playlists).reduce((sum, pl) => sum + pl.songs.length, 0)

  const {
    activeTab,
    setActivePlaylistId,
    handleTabChange: handleTabChangeBase,
    activePlaylist,
    showDownloads,
    showPlaylistsOverview,
    showMoodsPage,
    showSongGrid,
    view,
  } = useAppView({
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
  })

  function handleTabChange(tab) {
    handleTabChangeBase(tab)
    setQuery('')
  }

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

        {showDownloads && (
          <section className="mt-4">
            <DownloadsPage onBack={() => setActivePlaylistId(null)} />
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
      <DownloadOptionSheet />
      <AddToPlaylistSheet />
    </>
  )
}