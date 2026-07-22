import { motion } from 'framer-motion'
import MainLayout from '../layouts/MainLayout'
import Section from '../components/Section'
import Button from '../components/Button'
import { ArrowRight, Target, Eye, Heart, Calendar, Building2, Users2, Award } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower educational institutions with technology that simplifies management, enhances learning outcomes, and drives institutional growth.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'A world where every educational institute has access to world-class management tools that enable educators to focus on what matters most — teaching.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Innovation, integrity, and impact drive everything we do. We believe in building products that make a real difference in education.',
  },
]

const timeline = [
  { year: '2020', icon: Building2, title: 'Founded', description: 'CIMS was founded by educators and technologists with a vision to transform institute management.', gradient: 'from-blue-600 to-indigo-600' },
  { year: '2021', icon: Users2, title: 'First 100 Institutes', description: 'Reached 100 institutes within first year with our core student and attendance management modules.', gradient: 'from-emerald-600 to-teal-600' },
  { year: '2023', icon: Award, title: '500+ Institutes', description: 'Expanded to serve 500+ institutes with advanced analytics, mobile app, and API integrations.', gradient: 'from-purple-600 to-pink-600' },
  { year: '2024', icon: Calendar, title: 'AI & Beyond', description: 'Launched AI-powered attendance, predictive analytics, and expanded to international markets.', gradient: 'from-amber-500 to-orange-600' },
]

export default function AboutPage() {
  return (
    <MainLayout>
      <Section
        variant="alt"
        subtitle="About Us"
        title="Transforming education through technology"
        description="CIMS was built by educators and technologists who understand the challenges of managing a coaching institute."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="card-premium p-6 sm:p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                <v.icon className="text-blue-600" size={28} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-500 leading-relaxed">
            Founded in 2020, CIMS started with a simple observation: coaching institutes were spending too much time on administrative tasks and not enough on teaching. Our team of educators, engineers, and designers came together to build a platform that automates the mundane and amplifies the meaningful.
          </p>
          <p className="text-gray-500 leading-relaxed mt-4">
            Today, CIMS serves over 500 institutes across the country, processing millions of attendance records and helping educators make data-driven decisions every day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-gray-500 leading-relaxed">
            From a simple idea to a platform serving 500+ institutes — our journey has been driven by a passion for education technology.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto mb-16">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-indigo-200 to-purple-200 -translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6`}
              >
                <div className="flex-1 text-center md:text-left">
                  <div className="card-premium p-5 inline-block">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.year}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="shrink-0 z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl`}>
                    <item.icon className="text-white" size={24} aria-hidden="true" />
                  </div>
                </div>

                <div className="flex-1 hidden md:block" />
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
          <Button variant="gradient" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" href="/contact">
            Get in Touch
          </Button>
        </motion.div>
      </Section>
    </MainLayout>
  )
}
