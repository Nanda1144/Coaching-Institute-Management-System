import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  neonColor?: string
  glowIntensity?: 'soft' | 'medium' | 'strong'
}

const NEON_COLORS = [
  { color: '#3b82f6', shadow: '0 0 7px #3b82f6, 0 0 21px #3b82f6, 0 0 42px #3b82f6' },
  { color: '#8b5cf6', shadow: '0 0 7px #8b5cf6, 0 0 21px #8b5cf6, 0 0 42px #8b5cf6' },
  { color: '#06b6d4', shadow: '0 0 7px #06b6d4, 0 0 21px #06b6d4, 0 0 42px #06b6d4' },
  { color: '#f59e0b', shadow: '0 0 7px #f59e0b, 0 0 21px #f59e0b, 0 0 42px #f59e0b' },
  { color: '#10b981', shadow: '0 0 7px #10b981, 0 0 21px #10b981, 0 0 42px #10b981' },
  { color: '#ec4899', shadow: '0 0 7px #ec4899, 0 0 21px #ec4899, 0 0 42px #ec4899' },
]

const INTENSITY_MAP = {
  soft: { spread: '10px', blur: '20px' },
  medium: { spread: '15px', blur: '35px' },
  strong: { spread: '25px', blur: '60px' },
}

export default function TypewriterText({
  text,
  speed = 50,
  className = '',
  neonColor,
  glowIntensity = 'medium',
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)

  const colors = NEON_COLORS
  const intensity = INTENSITY_MAP[glowIntensity]

  useEffect(() => {
    let idx = 0
    setDisplayed('')
    setIsComplete(false)

    const interval = setInterval(() => {
      idx++
      setDisplayed(text.slice(0, idx))
      if (idx >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    if (!isComplete) return
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isComplete, colors.length])

  const chosenColor = neonColor || colors[colorIndex].color
  const glowShadow = neonColor
    ? `0 0 ${intensity.spread} ${chosenColor}, 0 0 ${intensity.blur} ${chosenColor}`
    : colors[colorIndex].shadow

  return (
    <span className={className} style={{ position: 'relative' }}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          color: chosenColor,
          textShadow: glowShadow,
          transition: 'color 1s ease, text-shadow 1s ease',
        }}
      >
        {displayed}
      </motion.span>
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{
            color: chosenColor,
            textShadow: glowShadow,
            fontWeight: 100,
            marginLeft: 2,
          }}
        >
          |
        </motion.span>
      )}
    </span>
  )
}
