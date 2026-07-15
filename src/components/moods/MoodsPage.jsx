import { useRef } from 'react'
import SongRow from './SongRow'
import { MUSIC_CATEGORIES } from '../../config/moodCategories'

// Order + friendly copy for each category type. "home" is skipped here on
// purpose — trending / top charts already live on the Home tab, so this
// page stays focused on discovery instead of repeating it.
const SECTIONS = [
  { type: 'mood', title: 'Moods', subtitle: 'Music for how you feel right now' },
  { type: 'language', title: 'Languages', subtitle: 'Explore by language' },
  { type: 'genre', title: 'Genres', subtitle: 'Pick a sound' },
  { type: 'era', title: 'Decades', subtitle: 'Travel back in time' },
  { type: 'artist', title: 'Top artists', subtitle: 'Fan favourites' },
  { type: 'special', title: 'For the occasion', subtitle: 'Festivals, reels and moments' },
]

export default function MoodsPage() {
  const sectionRefs = useRef({})

  const scrollToSection = (type) => {
    sectionRefs.current[type]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const grouped = SECTIONS.map((section) => ({
    ...section,
    items: MUSIC_CATEGORIES.filter((c) => c.type === section.type),
  })).filter((section) => section.items.length > 0)

  return (
    <div className="pb-6">
      {/* Page intro — quiet, sets the tone before anything else loads */}
      <div className="px-4 pt-5 pb-4">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted/70">browse</div>
        <div className="mt-1 font-display text-2xl font-medium">Find your next favourite</div>
        <div className="mt-1 text-sm font-light text-muted">Curated by mood, language, era and more</div>
      </div>

      {/* Sticky quick-jump pill bar — the thing that makes this feel
          navigable instead of an endless scroll */}
      <div className="sticky top-0 z-10 -mx-4 mb-2 border-b border-line/60 bg-bg0/85 px-4 py-2.5 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {grouped.map((section) => (
            <button
              key={section.type}
              type="button"
              onClick={() => scrollToSection(section.type)}
              className="shrink-0 rounded-full border border-line/70 px-3.5 py-1.5 text-xs font-light text-muted transition-colors hover:border-mote/50 hover:text-ink active:scale-95"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {grouped.map((section, i) => (
        <section
          key={section.type}
          ref={(el) => (sectionRefs.current[section.type] = el)}
          className="scroll-mt-16 px-4 pt-5"
        >
          <div className="mb-3">
            <div className="font-display text-lg font-medium">{section.title}</div>
            <div className="text-xs font-light text-muted">{section.subtitle}</div>
          </div>

          <div className="-mx-4 space-y-1">
            {section.items.map((cat) => (
              <SongRow key={cat.id} title={cat.label} query={cat.query} />
            ))}
          </div>

          {i < grouped.length - 1 && <div className="mt-5 border-t border-line/60" />}
        </section>
      ))}
    </div>
  )
}