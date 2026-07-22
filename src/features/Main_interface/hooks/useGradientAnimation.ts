import { useState, useEffect } from 'react'

interface GradientConfig {
  colors: string[]
  interval?: number
}

export function useGradientAnimation({ colors, interval = 4000 }: GradientConfig) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (colors.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % (colors.length - 1))
    }, interval)
    return () => clearInterval(timer)
  }, [colors, interval])

  return {
    from: colors[index],
    to: colors[index + 1] || colors[0],
    gradient: `linear-gradient(135deg, ${colors[index]}, ${colors[index + 1] || colors[0]})`,
  }
}
