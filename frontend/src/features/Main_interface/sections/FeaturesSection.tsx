import Section from '../components/Section'
import { FEATURES } from '../constants'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const gradients = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-violet-600 to-purple-600',
]

export default function FeaturesSection() {
  const navigate = useNavigate()

  return (
    <Section
      id="features"
      subtitle="Features"
      title="Everything you need to manage your institute"
      description="Powerful tools designed specifically for coaching institutes. From student management to analytics, we've got you covered."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              onClick={() => feature.href && navigate(feature.href)}
              className="group card-premium p-6 sm:p-8 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="text-white" size={24} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {feature.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
                Learn more <ArrowRight size={16} aria-hidden="true" />
              </span>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
