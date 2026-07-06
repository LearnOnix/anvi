import SongRow from './SongRow'
import { MOOD_CATEGORIES, TOP_SINGERS } from '../../config/moodCategories'

export default function MoodsPage() {
  return (
    <div>
      {MOOD_CATEGORIES.map((cat) => (
        <SongRow key={cat.id} title={cat.label} query={cat.query} />
      ))}

      <div className="my-5 border-t border-line" />

      <div className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">top singers</div>
      {TOP_SINGERS.map((singer) => (
        <SongRow key={singer.id} title={singer.label} query={singer.query} />
      ))}
    </div>
  )
}