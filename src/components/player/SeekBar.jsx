import { usePlayer } from '../../store/playerStore'
import { fmtTime } from '../../utils/format'

export default function SeekBar() {
  const currentTime = usePlayer((s) => s.currentTime)
  const duration = usePlayer((s) => s.duration)
  const requestSeek = usePlayer((s) => s.requestSeek)

  const pct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="col-span-full order-3 flex min-w-0 items-center gap-2.5 sm:col-auto sm:order-none">
      <span className="w-9 flex-none font-mono text-xs text-muted">{fmtTime(currentTime)}</span>
      <input
        type="range"
        className="kd-range w-full"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => requestSeek(Number(e.target.value))}
        style={{
          background: `linear-gradient(90deg, var(--color-mote) ${pct}%, rgba(255,255,255,0.12) ${pct}%)`,
        }}
        aria-label="Seek"
      />
      <span className="w-9 flex-none text-right font-mono text-xs text-muted">{fmtTime(duration)}</span>
    </div>
  )
}
