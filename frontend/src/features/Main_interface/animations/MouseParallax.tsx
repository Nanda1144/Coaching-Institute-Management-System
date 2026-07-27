import { useRef, useEffect, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MouseParallaxProps {
  children: ReactNode
  factor?: number
  className?: string
}

export default function MouseParallax({ children, factor = 0.03, className }: MouseParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 100, damping: 30 })
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })

    const handleMouse = (e: MouseEvent) => {
      const dx = e.clientX - center.x
      const dy = e.clientY - center.y
      x.set(dx * factor)
      y.set(dy * factor)
    }

    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [center, factor, x, y])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
