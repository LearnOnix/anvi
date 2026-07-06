import { useEffect, useState } from 'react'
import { searchSongs } from '../../api/jiosaavn'
import SongCard from '../songs/SongCard'
import SongCardSkeleton from '../songs/SongCardSkeleton'

export default function SongRow({ title, query, limit = 10 }) {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    searchSongs(query)
      .then((results) => { if (!cancelled) setSongs(results.slice(0, limit)) })
      .catch(() => { if (!cancelled) setSongs([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query, limit])

  if (!loading && songs.length === 0) return null // search fail ho to row hi na dikhe

  return (
    <section className="mb-6">
      <div className="mb-2.5 font-mono text-xs uppercase tracking-[0.14em] text-muted">{title}</div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[122px] shrink-0 sm:w-[148px]">
              <SongCardSkeleton />
            </div>
          ))}
        {!loading &&
          songs.map((song, idx) => (
            <div key={`${song.id ?? song.name}-${idx}`} className="w-[122px] shrink-0 sm:w-[148px]">
              <SongCard song={song} list={songs} index={idx} />
            </div>
          ))}
      </div>
    </section>
  )
}