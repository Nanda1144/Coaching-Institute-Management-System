import { useRef, useEffect, useState } from 'react'

interface ParallaxState {
  x: number
  y: number
}

export function useMouseParallax(factor = 0.05): [React.RefObject<HTMLDivElement | null>, ParallaxState] {
  const ref = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState<ParallaxState>({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId: number
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX - cx) * factor
      mouseY = (e.clientY - cy) * factor
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })

    const animate = () => {
      currentX += (mouseX - currentX) * 0.05
      currentY += (mouseY - currentY) * 0.05
      setOffset({ x: currentX, y: currentY })
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [factor])

  return [ref, offset]
}
