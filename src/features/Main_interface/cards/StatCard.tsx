import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Stat } from '../types'
import { staggerItem } from '../animations/variants'
import { cn } from '../utils/cn'

interface StatCardProps extends Stat {
  index?: number
}

const GLOW_COLORS = [
  'rgba(59,130,246,0.1)',
  'rgba(139,92,246,0.1)',
  'rgba(6,182,212,0.1)',
  'rgba(245,158,11,0.1)',
  'rgba(16,185,129,0.1)',
  'rgba(236,72,153,0.1)',
]

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) ref.current = requestAnimationFrame(animate)
    }
    ref.current = requestAnimationFrame(animate)
    return () => { if (ref.current) cancelAnimationFrame(ref.current) }
  }, [target, duration, start])

  return count
}

export default function StatCard({ value, suffix, prefix, label, icon: Icon, trend, trendValue, index = 0 }: StatCardProps) {
  const [inView, setInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.3 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(value, 2000, inView)
  const glowColor = useMemo(() => GLOW_COLORS[index % GLOW_COLORS.length], [index])

  return (
    <motion.div
      ref={containerRef}
      variants={staggerItem}
      className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6 sm:p-8 text-center overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)`,
        }}
      />
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center mx-auto mb-4">
          <Icon className="text-blue-600" size={24} aria-hidden="true" />
        </div>
      )}

      <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tabular-nums">
        {prefix}{count.toLocaleString()}{suffix}
      </div>

      <p className="text-sm text-gray-500 font-medium">{label}</p>

      {trend && (
        <div className={cn(
          'flex items-center justify-center gap-1 mt-3 text-xs font-semibold',
          trend === 'up' ? 'text-emerald-600' : 'text-red-600',
        )}>
          {trend === 'up' ? <TrendingUp size={14} aria-hidden="true" /> : <TrendingDown size={14} aria-hidden="true" />}
          <span>{trendValue} this month</span>
        </div>
      )}
    </motion.div>
  )
}
