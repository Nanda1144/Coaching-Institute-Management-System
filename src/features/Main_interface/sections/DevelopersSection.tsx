import Section from '../components/Section'
import StaggerContainer from '../animations/StaggerContainer'
import { FadeIn } from '../animations'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { motion } from 'framer-motion'
import { Code2, Globe, Lock, Zap, BookOpen, Terminal } from 'lucide-react'

const devFeatures = [
  {
    icon: Code2,
    title: 'RESTful API',
    description: 'Full-featured REST API with comprehensive endpoints for students, courses, attendance, and analytics.',
    badge: 'REST',
  },
  {
    icon: Globe,
    title: 'Webhook Integration',
    description: 'Real-time webhooks for events like attendance marking, fee payments, and enrollment changes.',
    badge: 'Webhooks',
  },
  {
    icon: Lock,
    title: 'OAuth 2.0 Authentication',
    description: 'Secure OAuth 2.0-based authentication with scoped access tokens for granular permissions.',
    badge: 'Auth',
  },
  {
    icon: Zap,
    title: 'GraphQL Support',
    description: 'Flexible GraphQL endpoint for efficient data fetching with precise query control.',
    badge: 'GraphQL',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive SDKs',
    description: 'Official SDKs for Python, JavaScript, Java, and PHP with detailed documentation and examples.',
    badge: 'SDKs',
  },
  {
    icon: Terminal,
    title: 'CLI Tools',
    description: 'Command-line interface for bulk operations, data migration, and automated deployments.',
    badge: 'CLI',
  },
]

export default function DevelopersSection() {
  return (
    <Section
      id="developers"
      subtitle="For Developers"
      title="Build on top of CIMS"
      description="Extend and integrate CIMS with your existing tools using our powerful APIs and developer tools."
      variant="alt"
    >
      <StaggerContainer staggerDelay={0.08}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {devFeatures.map((f) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-4">
                <f.icon className="text-white" size={24} aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <Badge variant="info" size="xs">{f.badge}</Badge>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>

      <FadeIn variant="fadeInUp">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
            <code>{`// Initialize CIMS client
const cims = new CIMSClient({
  apiKey: 'your_api_key',
  environment: 'production'
})

// Fetch student analytics
const analytics = await cims
  .students('S12345')
  .analytics
  .get({ period: 'monthly' })

console.log(analytics)`}</code>
          </pre>
          <div className="mt-4">
            <Button variant="primary" size="sm" className="bg-white text-gray-900 hover:bg-gray-100" href="/developers">
              View API Documentation
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
