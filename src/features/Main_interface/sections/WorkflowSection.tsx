import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import Button from '../components/Button'
import { WORKFLOW_STEPS as _WORKFLOW_STEPS } from '../constants'

const WORKFLOW_STEPS = _WORKFLOW_STEPS as any

export default function WorkflowSection() {
  return (
    <Section
      id="workflow"
      subtitle="Workflow"
      title="How CIMS works for your institute"
      description="A streamlined workflow designed to get your institute up and running in no time."
    >
      <div className="relative max-w-5xl mx-auto mb-12">
        <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 -translate-x-1/2" />

        <div className="space-y-8 lg:space-y-0">
          {WORKFLOW_STEPS.map((step: any, index: number) => {
            const isLeft = index % 2 === 0
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-6 lg:gap-10`}
              >
                <div className={`flex-1 ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
                  <span className={`text-xs font-bold text-blue-600 uppercase tracking-wider`}>
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-3">{step.description}</p>
                  <ul className={`space-y-1.5 ${isLeft ? 'lg:ml-auto' : ''} max-w-sm`}>
                    {step.details.map((detail: string) => (
                      <li key={detail} className="flex items-start gap-2">
                        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} aria-hidden="true" />
                        <span className="text-xs text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="shrink-0 z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
                    <step.icon className="text-white" size={24} aria-hidden="true" />
                  </div>
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            )
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button variant="gradient" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" href="/get-started">
          Start Your Workflow
        </Button>
      </motion.div>
    </Section>
  )
}
