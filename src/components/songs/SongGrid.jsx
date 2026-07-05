import SongCard from './SongCard'
import SongCardSkeleton from './SongCardSkeleton'
import EmptyState from './EmptyState'

export default function SongGrid({ songs, loading, skeletonCount = 10, emptyTitle, emptySub }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(122px,1fr))] gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(148px,1fr))] sm:gap-3">
      {loading &&
        Array.from({ length: skeletonCount }).map((_, i) => <SongCardSkeleton key={i} />)}

      {!loading && songs.length === 0 && <EmptyState title={emptyTitle} sub={emptySub} />}

      {!loading &&
        songs.map((song, idx) => (
          <SongCard key={`${song.id ?? song.name}-${idx}`} song={song} list={songs} index={idx} />
        ))}
    </div>
  )
}
