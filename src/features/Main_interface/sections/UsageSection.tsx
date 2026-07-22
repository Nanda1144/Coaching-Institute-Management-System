import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Section from '../components/Section'
import Button from '../components/Button'
import { UserPlus, Settings, Users, BarChart3 } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Onboard Your Institute',
    description: 'Get started in minutes. Import student data, set up faculty profiles, and configure your institute structure.',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    icon: Settings,
    title: 'Configure & Customize',
    description: 'Set up attendance modes, course structures, fee schedules, and notification preferences to match your workflow.',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Users,
    title: 'Manage Daily Operations',
    description: 'Track attendance, manage schedules, communicate with parents, and handle academic workflows effortlessly.',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    icon: BarChart3,
    title: 'Analyze & Optimize',
    description: 'Monitor performance trends, generate reports, identify improvement areas, and make data-driven decisions.',
    gradient: 'from-amber-500 to-orange-600',
  },
]

export default function UsageSection() {
  return (
    <Section
      id="usage"
      subtitle="How It Works"
      title="Get started in four simple steps"
      description="From setup to analytics, CIMS makes institute management effortless."
    >
      <div className="relative max-w-4xl mx-auto">
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 -translate-x-1/2" />

        <div className="space-y-12 lg:space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>

              <div className="shrink-0">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
                  <step.icon className="text-white" size={30} aria-hidden="true" />
                </div>
              </div>

              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button variant="gradient" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" href="/get-started">
          Start Using CIMS Today
        </Button>
      </motion.div>
    </Section>
  )
}
