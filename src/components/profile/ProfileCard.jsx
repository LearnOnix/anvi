import { ChevronRight } from 'lucide-react'
import { useProfile } from '../../store/profileStore'

// Sits at the top of MoreSheet. Tapping anywhere opens ProfileEditSheet.
export default function ProfileCard({ onEdit }) {
  const name = useProfile((s) => s.name)
  const photo = useProfile((s) => s.photo)

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-4 py-3.5 text-left transition hover:border-mote/30"
    >
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-base font-bold text-muted">
            {name.trim().charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-sm font-bold">{name}</div>
        <div className="text-xs text-muted">edit profile</div>
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted" />
    </button>
  )
}