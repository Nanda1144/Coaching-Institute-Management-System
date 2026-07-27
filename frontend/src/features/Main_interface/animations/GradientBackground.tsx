import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GradientBackgroundProps {
  colors?: string[]
  duration?: number
  className?: string
}

const defaultColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#3b82f6']

export default function GradientBackground({
  colors = defaultColors,
  duration = 10,
  className = '',
}: GradientBackgroundProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % (colors.length - 1))
    }, duration * 1000)
    return () => clearInterval(interval)
  }, [colors, duration])

  return (
    <motion.div
      className={`absolute inset-0 -z-10 ${className}`}
      animate={{
        background: `linear-gradient(135deg, ${colors[index]}, ${colors[index + 1]})`,
      }}
      transition={{ duration: 3, ease: 'easeInOut' }}
    />
  )
}
