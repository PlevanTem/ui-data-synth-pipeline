import { useEffect, useRef } from 'react'
import type { VoiceState } from '@/types'

interface VoiceWaveformProps {
  state: VoiceState
  className?: string
}

export default function VoiceWaveform({ state, className = '' }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 280
    canvas.height = 100

    const draw = () => {
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)
      timeRef.current += 0.05

      if (state === 'listening') {
        // Animated waveform bars
        const barCount = 24
        const barWidth = 4
        const gap = (w - barCount * barWidth) / (barCount + 1)

        for (let i = 0; i < barCount; i++) {
          const x = gap + i * (barWidth + gap)
          const phase = timeRef.current + i * 0.35
          const amplitude = 0.3 + 0.7 * Math.abs(Math.sin(phase))
          const barH = 10 + amplitude * 35
          const y = (h - barH) / 2

          const gradient = ctx.createLinearGradient(x, y, x, y + barH)
          gradient.addColorStop(0, 'rgba(78, 158, 255, 0.9)')
          gradient.addColorStop(1, 'rgba(78, 158, 255, 0.3)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barH, 2)
          ctx.fill()
        }

        // Glow center dot
        const centerGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 40)
        centerGlow.addColorStop(0, 'rgba(78, 158, 255, 0.08)')
        centerGlow.addColorStop(1, 'rgba(78, 158, 255, 0)')
        ctx.fillStyle = centerGlow
        ctx.fillRect(0, 0, w, h)

      } else if (state === 'processing') {
        // Spinning dots
        const radius = 28
        const dotCount = 8
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + timeRef.current * 2
          const x = w / 2 + Math.cos(angle) * radius
          const y = h / 2 + Math.sin(angle) * radius
          const opacity = 0.3 + 0.7 * ((i / dotCount + timeRef.current * 0.5) % 1)
          ctx.beginPath()
          ctx.arc(x, y, 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(78, 158, 255, ${opacity})`
          ctx.fill()
        }

      } else if (state === 'success') {
        // Pulsing green rings
        const ring1Size = 20 + Math.sin(timeRef.current * 3) * 5
        const ring2Size = 35 + Math.sin(timeRef.current * 3 + 1) * 5
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, ring1Size, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(w / 2, h / 2, ring2Size, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Checkmark
        ctx.beginPath()
        ctx.moveTo(w / 2 - 10, h / 2)
        ctx.lineTo(w / 2 - 3, h / 2 + 8)
        ctx.lineTo(w / 2 + 12, h / 2 - 9)
        ctx.strokeStyle = '#34D399'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

      } else if (state === 'error') {
        // Shaking red rings
        const shake = Math.sin(timeRef.current * 15) * 3
        ctx.beginPath()
        ctx.arc(w / 2 + shake, h / 2, 25, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 92, 92, 0.6)'
        ctx.lineWidth = 2
        ctx.stroke()

        // X mark
        ctx.beginPath()
        ctx.moveTo(w / 2 - 10 + shake, h / 2 - 10)
        ctx.lineTo(w / 2 + 10 + shake, h / 2 + 10)
        ctx.moveTo(w / 2 + 10 + shake, h / 2 - 10)
        ctx.lineTo(w / 2 - 10 + shake, h / 2 + 10)
        ctx.strokeStyle = '#FF5C5C'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    if (state !== 'idle') {
      rafRef.current = requestAnimationFrame(draw)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [state])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '280px', height: '100px' }}
    />
  )
}
