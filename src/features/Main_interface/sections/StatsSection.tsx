import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, BookOpen, Building2, Award } from 'lucide-react'
import Section from '../components/Section'
import { STATS } from '../constants'

const icons = [Users, BookOpen, Building2, Award]
const gradients = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-amber-500 to-orange-600',
]
const glows = [
  'rgba(37,99,235,0.2)',
  'rgba(16,185,129,0.2)',
  'rgba(147,51,234,0.2)',
  'rgba(245,158,11,0.2)',
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <span ref={ref} className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">
      {isInView ? (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {value.toLocaleString()}{suffix}
        </motion.span>
      ) : (
        '0'
      )}
    </span>
  )
}

export default function StatsSection() {
  return (
    <Section
      id="stats"
      variant="gradient"
      subtitle="Our Impact"
      title="Trusted by institutes nationwide"
      description="Join thousands of educational institutions that rely on CIMS for their daily operations."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => {
          const Icon = icons[i]
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${glows[i]}, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="text-white" size={24} aria-hidden="true" />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-blue-100 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
