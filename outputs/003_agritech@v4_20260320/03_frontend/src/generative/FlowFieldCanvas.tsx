import { useEffect, useRef } from 'react'

type Props = { speedBoost: number; reducedMotion: boolean }

export function FlowFieldCanvas({ speedBoost, reducedMotion }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let running = true
    let raf = 0
    const particles = Array.from({ length: reducedMotion ? 40 : 140 }, (_, i) => ({ x: (i * 17) % window.innerWidth, y: (i * 31) % window.innerHeight }))
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    const loop = () => {
      if (!running) return
      ctx.fillStyle = 'rgba(7,11,20,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      if (!reducedMotion) {
        particles.forEach((p, i) => {
          const a = ((p.x + p.y + i * 9) * 0.002 + speedBoost) % (Math.PI * 2)
          p.x = (p.x + Math.cos(a) * (0.2 + speedBoost * 0.2) + canvas.width) % canvas.width
          p.y = (p.y + Math.sin(a) * (0.2 + speedBoost * 0.2) + canvas.height) % canvas.height
          ctx.fillStyle = 'rgba(34,211,238,0.22)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
          ctx.fill()
        })
      }
      raf = requestAnimationFrame(loop)
    }
    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden
    })
    loop()
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion, speedBoost])
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 opacity-70" aria-hidden="true" />
}
