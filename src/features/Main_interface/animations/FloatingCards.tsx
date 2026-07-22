import { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'

interface FloatingCardsProps {
  children: ReactNode
  amplitude?: number
  duration?: number
  delay?: number
  className?: string
  as?: 'div' | 'span'
}

export default function FloatingCards({
  children,
  amplitude = 6,
  duration = 3,
  delay = 0,
  className,
  as: _as = 'div',
}: FloatingCardsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const randomDelay = useMemo(() => delay + Math.random() * 0.5, [delay])

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      animate={inView ? { y: [-amplitude, amplitude, -amplitude] } : { y: 0 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: randomDelay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
