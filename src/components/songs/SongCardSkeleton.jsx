export default function SongCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/[0.03] p-2.5">
      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-white/[0.04]">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
      <div className="relative h-3 overflow-hidden rounded-md bg-white/[0.04]">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
      <div className="relative h-2.5 w-[70%] overflow-hidden rounded-md bg-white/[0.04]">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
    </div>
  )
}
