import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import PricingCard from '../cards/PricingCard'
import ServiceModal from '../modals/ServiceModal'
import { FEATURES, PRICING_PLANS, SERVICE_DETAILS as _SERVICE_DETAILS } from '../constants'
import type { ServiceDetail } from '../types'

const SERVICE_DETAILS = _SERVICE_DETAILS as ServiceDetail[]

const gradients = [
  'from-blue-600 to-indigo-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-violet-600 to-purple-600',
]

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openServiceModal = (serviceId: string) => {
    const detail = SERVICE_DETAILS.find((s: any) => s.id === serviceId)
    if (detail) {
      setSelectedService(detail)
      setModalOpen(true)
    }
  }

  return (
    <Section
      id="services"
      variant="alt"
      subtitle="Our Services"
      title="Comprehensive solutions for your institute"
      description="From core management to advanced analytics, every service is designed with coaching institutes in mind."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {FEATURES.map((feature: any, i: number) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group card-premium p-6 sm:p-8 cursor-pointer"
            onClick={() => openServiceModal(feature.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mb-4 shadow-md`}>
              <feature.icon className="text-white" size={24} aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {feature.description}
            </p>
            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 group-hover:gap-2.5 transition-all">
              Read More <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Choose the right plan for your institute</h3>
        <p className="text-gray-500 mt-2">All plans include core features. Upgrade as you grow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PRICING_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <PricingCard {...plan} />
          </motion.div>
        ))}
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedService(null) }}
        service={selectedService}
      />
    </Section>
  )
}
