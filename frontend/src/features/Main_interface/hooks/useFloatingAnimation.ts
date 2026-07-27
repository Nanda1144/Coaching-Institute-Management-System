import { useRef, useEffect, useState } from 'react'

export function useFloatingAnimation(amplitude = 6, duration = 3000) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    let startTime: number
    let rafId: number

    const animate = (time: number) => {
      if (!startTime) startTime = time
      const elapsed = time - startTime
      const y = Math.sin((elapsed / duration) * Math.PI * 2) * amplitude
      setStyle({ transform: `translateY(${y}px)` })
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafId)
  }, [amplitude, duration])

  return [ref, style] as const
}
