import { useEffect, useRef } from 'react'

// The signature ambient animation: a slow constellation of "anu" (atoms of
// sound) that drift, link into faint bonds when close, and lean gently
// toward the cursor. Pure canvas, no React state — runs entirely inside
// a single effect so re-renders elsewhere in the app never restart it.
export default function AnuField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canvas || reduceMotion) return

    const ctx = canvas.getContext('2d')
    let W = 0, H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let raf = 0
    const mouse = { x: -9999, y: -9999, active: false }
    const LINK_DIST = 130
    const COLORS = ['216,247,155', '103,217,196', '255,184,107']
    const WEIGHTS = [0.62, 0.3, 0.08]

    function pickColor() {
      const r = Math.random()
      let acc = 0
      for (let i = 0; i < WEIGHTS.length; i++) {
        acc += WEIGHTS[i]
        if (r <= acc) return COLORS[i]
      }
      return COLORS[0]
    }

    function sizeCanvas() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const density = Math.max(38, Math.min(90, Math.round((W * H) / 19000)))
      particles = new Array(density).fill(0).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        r: 1 + Math.random() * 1.6,
        c: pickColor(),
        tw: Math.random() * Math.PI * 2,
      }))
    }

    function step(t) {
      ctx.clearRect(0, 0, W, H)

      if (mouse.active) {
        for (const p of particles) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const d2 = dx * dx + dy * dy
          if (d2 < 26000 && d2 > 4) {
            const f = 0.0009
            p.vx += dx * f * 0.02
            p.vy += dy * f * 0.02
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.996
        p.vy *= 0.996
        if (p.x < -20) p.x = W + 20
        if (p.x > W + 20) p.x = -20
        if (p.y < -20) p.y = H + 20
        if (p.y > H + 20) p.y = -20
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.16
            ctx.strokeStyle = `rgba(216,247,155,${alpha.toFixed(3)})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const twinkle = 0.55 + Math.sin(t * 0.0012 + p.tw) * 0.25
        let near = 0
        if (mouse.active) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const d = Math.sqrt(dx * dx + dy * dy)
          near = d < 160 ? 1 - d / 160 : 0
        }
        const alpha = Math.min(0.95, twinkle * 0.55 + near * 0.5)
        const rad = p.r + near * 1.4
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2)
        ctx.fill()
        if (near > 0.3) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(${p.c},${(near * 0.14).toFixed(3)})`
          ctx.arc(p.x, p.y, rad * 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(step)
    }

    const onResize = () => sizeCanvas()
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true }
    const onMouseLeave = () => { mouse.active = false }
    const onTouchMove = (e) => {
      if (e.touches?.[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.active = true }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    sizeCanvas()
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-90 motion-reduce:hidden"
    />
  )
}
