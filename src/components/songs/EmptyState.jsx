export default function EmptyState({ title, sub }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-line px-5 py-11 text-center text-sm text-muted">
      <strong className="mb-1.5 block font-display text-base font-bold text-ink">{title}</strong>
      {sub}
    </div>
  )
}
