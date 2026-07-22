import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Section from '../components/Section'
import { WORKING_MODEL as _WORKING_MODEL } from '../constants'

const WORKING_MODEL = _WORKING_MODEL as any

export default function WorkingModelSection() {
  return (
    <Section
      id="working-model"
      variant="alt"
      subtitle="Working Model"
      title="Our technical architecture"
      description="Built on modern cloud infrastructure for reliability, security, and scale."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKING_MODEL.map((model: any, i: number) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="card-premium p-6 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.gradient} flex items-center justify-center shadow-md shrink-0`}>
                <model.icon className="text-white" size={24} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{model.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{model.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
              {model.features.map((f: string) => (
                <div key={f} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="text-emerald-600" size={12} aria-hidden="true" />
                  </div>
                  <span className="text-xs text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
