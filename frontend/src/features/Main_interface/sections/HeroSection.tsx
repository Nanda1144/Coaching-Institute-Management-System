import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles, GraduationCap, BookOpen, Users, BarChart3, Zap } from 'lucide-react'
import type { HeroProps } from '../types'
import Button from '../components/Button'
import Container from '../components/Container'
import TypewriterText from '../components/TypewriterText'

const floatingIcons = [
  { Icon: GraduationCap, x: '15%', y: '20%', size: 28, delay: 0, color: 'text-blue-400/20' },
  { Icon: BookOpen, x: '80%', y: '30%', size: 24, delay: 1, color: 'text-indigo-400/20' },
  { Icon: Users, x: '10%', y: '70%', size: 32, delay: 0.5, color: 'text-emerald-400/20' },
  { Icon: BarChart3, x: '85%', y: '65%', size: 26, delay: 1.5, color: 'text-purple-400/20' },
  { Icon: Zap, x: '50%', y: '15%', size: 22, delay: 2, color: 'text-amber-400/20' },
]

const stats = [
  { value: '15K+', label: 'Active Students', gradient: 'from-blue-600 to-indigo-600' },
  { value: '500+', label: 'Expert Faculty', gradient: 'from-emerald-600 to-teal-600' },
  { value: '200+', label: 'Courses Offered', gradient: 'from-purple-600 to-pink-600' },
  { value: '98%', label: 'Satisfaction', gradient: 'from-amber-500 to-orange-600' },
]

export default function HeroSection({
  title = 'Empowering Educators, Shaping Futures',
  subtitle,
  description = 'Streamline your institute operations with our all-in-one management platform.',
  primaryCta,
  secondaryCta,
}: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const titleParts = title.split(', ')

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950">
      {/* Parallax gradient orbs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] animate-float" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-amber-500/5 blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/3 blur-[150px]" />
      </motion.div>

      {/* Floating educational icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {floatingIcons.map(({ Icon, x, y, size, delay, color }) => (
          <motion.div
            key={delay}
            className={`absolute ${color}`}
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + delay, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
            >
              <Icon size={size} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <Container className="relative z-10 py-20 sm:py-32">
        <motion.div style={{ opacity }} className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles size={14} className="text-amber-500" />
              {subtitle}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            <TypewriterText
              text={titleParts[0]}
              speed={50}
              glowIntensity="strong"
            />
            {titleParts[1] && (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]"
                style={{ textShadow: '0 0 20px rgba(59,130,246,0.2)' }}
              >
                , {titleParts[1]}
              </motion.span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg sm:text-xl text-blue-200/80 leading-relaxed max-w-2xl mx-auto mb-10"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {primaryCta && (
              <Button variant="gradient" size="xl" icon={<ArrowRight size={20} />} iconPosition="right" href={primaryCta.href} onClick={primaryCta.onClick}>
                {primaryCta.label}
              </Button>
            )}
            {secondaryCta && (
              <Button variant="outline" size="xl" href={secondaryCta.href} onClick={secondaryCta.onClick}>
                {secondaryCta.label}
              </Button>
            )}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative group p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                  <div className="w-3 h-3 rounded-full bg-white/80" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-blue-200/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-blue-300/60"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ChevronDown size={20} aria-hidden="true" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
