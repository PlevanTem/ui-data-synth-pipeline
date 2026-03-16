import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 600, decimals = 1) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const startValueRef = useRef(0)

  useEffect(() => {
    startValueRef.current = value
    startTimeRef.current = undefined

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValueRef.current + (target - startValueRef.current) * eased

      setValue(parseFloat(current.toFixed(decimals)))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals])

  return value
}
