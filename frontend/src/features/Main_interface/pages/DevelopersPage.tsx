import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import Container from '../components/Container'
import StaggerContainer from '../animations/StaggerContainer'
import DeveloperCard from '../cards/DeveloperCard'
import DeveloperModal from '../modals/DeveloperModal'
import { FooterSection } from '../sections'
import { DEVELOPERS as _DEVELOPERS } from '../constants'
import { fadeInUp } from '../animations/variants'
import type { Developer } from '../types'

const DEVELOPERS = _DEVELOPERS as Developer[]

export default function DevelopersPage() {
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = (dev: Developer) => {
    setSelectedDev(dev)
    setModalOpen(true)
  }

  return (
    <MainLayout>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <Container className="relative z-10 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium mb-6"
            >
              <Code2 size={16} aria-hidden="true" />
              Development Team
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            >
              Meet Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                Development Team
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="text-lg sm:text-xl text-blue-200/80 leading-relaxed max-w-2xl mx-auto"
            >
              The talented engineers building and maintaining the CIMS platform. Passionate about education technology and crafting exceptional user experiences.
            </motion.p>
          </div>
        </Container>
      </section>

      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-gray-900 via-slate-900 to-[#0a0e27] overflow-hidden">
        {/* Tech background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Circuit pattern lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 L30 50 L30 20 L70 20 L70 80 L100 80" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                <circle cx="30" cy="50" r="2" fill="#3b82f6" />
                <circle cx="70" cy="20" r="2" fill="#3b82f6" />
                <circle cx="70" cy="80" r="2" fill="#3b82f6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>

          {/* Floating code brackets */}
          {['{ }', '< />', '() =>', 'npm i', 'git push', 'API', 'λ', '⚡'].map((s, i) => (
            <motion.div
              key={s}
              className="absolute text-blue-500/5 font-mono text-sm font-bold"
              style={{
                left: `${10 + (i * 12) % 80}%`,
                top: `${5 + (i * 18) % 90}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 0.05, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
                ease: 'easeInOut',
              }}
            >
              {s}
            </motion.div>
          ))}
        </div>

        <Container className="relative z-10">
          <StaggerContainer staggerDelay={0.08}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {DEVELOPERS.map((dev: Developer) => (
                <DeveloperCard
                  key={dev.id}
                  developer={dev}
                  onReadMore={openModal}
                />
              ))}
            </div>
          </StaggerContainer>
        </Container>
      </section>

      <DeveloperModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDev(null) }}
        developer={selectedDev}
      />

      <FooterSection />
    </MainLayout>
  )
}
