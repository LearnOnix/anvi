export default function Hero() {
  return (
    <section className="max-w-[640px] pt-11 pb-4 sm:pt-8">
      <div className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase text-teal">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-teal" style={{ animation: 'twinkle 2.4s ease-in-out infinite' }} />
        </span>
        an echo player
      </div>
      <h1 className="font-display font-bold leading-[1.22] text-[clamp(1.7rem,4vw,2.5rem)]">
        little sounds that <em className="not-italic text-mote">find their way back</em> to you.
      </h1>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </section>
  )
}