import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface AmbientBackgroundProps {
  className?: string
}

export default function AmbientBackground({ className = '' }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    let t = 0
    const noise2D = createNoise2D()

    const colors = [
      { r: 13, g: 15, b: 20 },
      { r: 18, g: 23, b: 42 },
      { r: 15, g: 21, b: 32 },
      { r: 26, g: 16, b: 37 },
    ]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const scale = 3 // draw at 1/3 resolution for performance
      const sw = Math.ceil(w / scale)
      const sh = Math.ceil(h / scale)

      const imageData = ctx.createImageData(sw, sh)
      const data = imageData.data

      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const nx = x / sw * 2.5
          const ny = y / sh * 2.5
          const n1 = (noise2D(nx + t * 0.08, ny + t * 0.05) + 1) / 2
          const n2 = (noise2D(nx * 1.5 - t * 0.03, ny * 1.5 + t * 0.07) + 1) / 2
          const n = n1 * 0.6 + n2 * 0.4

          const colorIdx = Math.floor(n * (colors.length - 1))
          const nextIdx = Math.min(colorIdx + 1, colors.length - 1)
          const frac = n * (colors.length - 1) - colorIdx

          const c1 = colors[colorIdx]
          const c2 = colors[nextIdx]

          const idx = (y * sw + x) * 4
          data[idx] = Math.round(c1.r + (c2.r - c1.r) * frac)
          data[idx + 1] = Math.round(c1.g + (c2.g - c1.g) * frac)
          data[idx + 2] = Math.round(c1.b + (c2.b - c1.b) * frac)
          data[idx + 3] = 255
        }
      }

      // Draw low-res image scaled up
      const offscreen = document.createElement('canvas')
      offscreen.width = sw
      offscreen.height = sh
      const offCtx = offscreen.getContext('2d')!
      offCtx.putImageData(imageData, 0, 0)

      ctx.save()
      ctx.scale(scale, scale)
      ctx.drawImage(offscreen, 0, 0)
      ctx.restore()

      t += 0.3
      rafRef.current = requestAnimationFrame(draw)
    }

    if (!mq.matches) {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      // Static fallback
      ctx.fillStyle = '#0D0F14'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ opacity: 0.85 }}
    />
  )
}
