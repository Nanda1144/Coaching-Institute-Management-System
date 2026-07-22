import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'
import Section from '../components/Section'
import Button from '../components/Button'
import StatCard from '../cards/StatCard'
import { STATS, FEATURES } from '../constants'

const highlights = [
  'Centralized student & faculty management',
  'Multi-mode attendance with biometric support',
  'Real-time analytics & performance tracking',
  'Automated fee reminders & notifications',
  'Role-based access control for security',
  'Seamless integration with existing tools',
]

export default function OverviewSection() {
  return (
    <Section
      id="overview"
      subtitle="Platform Overview"
      title="Your all-in-one institute management solution"
      description="CIMS brings every aspect of your coaching institute under one roof — from enrollment to analytics."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="text-emerald-600" size={14} aria-hidden="true" />
                </div>
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="pt-6"
          >
            <Button variant="gradient" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" href="#services">
              Explore All Features
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="glass-premium rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.slice(0, 4).map((f: any, i: number) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-white/80 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3`}>
                    <f.icon className="text-white" size={18} aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{f.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Feature Comparison</h3>
        <p className="text-gray-500 mt-2">See how CIMS compares to traditional institute management.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-x-auto mb-16"
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Traditional</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">CIMS</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Attendance Tracking', traditional: 'Manual registers', cims: 'AI-based multi-mode' },
              { feature: 'Fee Collection', traditional: 'Cash/Cheque', cims: 'Online + automated reminders' },
              { feature: 'Report Generation', traditional: 'Hours of manual work', cims: 'Real-time dashboards' },
              { feature: 'Communication', traditional: 'Phone calls / SMS', cims: 'Multi-channel automated' },
              { feature: 'Data Security', traditional: 'Paper records', cims: 'Encrypted & cloud-backed' },
              { feature: 'Scalability', traditional: 'Limited by staff', cims: 'Unlimited with automation' },
            ].map((row) => (
              <tr key={row.feature} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-700">{row.feature}</td>
                <td className="text-center py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-gray-400">
                    <Zap size={14} className="text-red-400" aria-hidden="true" /> {row.traditional}
                  </span>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle size={14} aria-hidden="true" /> {row.cims}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Our Impact in Numbers</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
