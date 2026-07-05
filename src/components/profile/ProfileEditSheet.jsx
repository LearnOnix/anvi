import { useRef, useState } from 'react'
import { X, Camera, Check } from 'lucide-react'
import { useProfile } from '../../store/profileStore'
import { resizeImageToDataUrl } from '../../utils/image'

// Opened from ProfileCard inside MoreSheet. Purely local edits — nothing
// leaves the device, nothing needs a "Cancel" confirmation since Save is
// the only thing that commits the draft name.
export default function ProfileEditSheet({ isOpen, onClose }) {
  const name = useProfile((s) => s.name)
  const photo = useProfile((s) => s.photo)
  const setName = useProfile((s) => s.setName)
  const setPhoto = useProfile((s) => s.setPhoto)

  const [draftName, setDraftName] = useState(name)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      setPhoto(dataUrl)
    } catch {
      // bad/corrupt image file — just ignore, avatar stays as-is
    }
    e.target.value = '' // lets the same file be re-picked later if needed
  }

  const handleSave = () => {
    setName(draftName)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      <div className="w-full max-w-[380px] rounded-t-3xl border border-white/10 bg-bg0/95 p-6 backdrop-blur-2xl sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-fg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change photo"
            className="relative h-24 w-24 shrink-0 rounded-full transition active:scale-95"
          >
            {/* Avatar circle — solid tint + mote border so it actually reads
                as a circle instead of a floating letter */}
            <div className="h-full w-full overflow-hidden rounded-full border-2 border-mote/30 bg-mote/10">
              {photo ? (
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-mote">
                  {draftName.trim().charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Camera badge — always visible, not hover-only, so it reads as
                tappable on touch devices too */}
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-bg0 bg-mote text-bg0 shadow-md">
              <Camera size={14} />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoPick}
            className="hidden"
          />

          <input
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Your name"
            maxLength={24}
            className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-center font-display text-base font-semibold text-ink outline-none transition focus:border-mote/50"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-mote py-3 font-semibold text-bg0 transition active:scale-[0.98]"
        >
          <Check size={16} />
          Save
        </button>
      </div>
    </div>
  )
}