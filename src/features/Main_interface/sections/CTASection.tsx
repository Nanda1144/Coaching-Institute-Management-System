import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import Container from '../components/Container'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 animate-pulse-glow" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm">
            <Sparkles size={16} aria-hidden="true" />
            Get Started Today
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to transform your institute?
          </h2>

          <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
            Join thousands of institutes already using CIMS. Start your free trial today — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="xl"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              href="/get-started"
              className="bg-white text-blue-700 hover:bg-gray-100 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30"
            >
              Start Free Trial
            </Button>
            <Button
              variant="ghost"
              size="xl"
              href="/contact"
              className="text-white hover:bg-white/10"
            >
              Talk to Sales
            </Button>
          </div>

          <p className="text-sm text-blue-200 mt-6">
            No credit card required &middot; Free 14-day trial &middot; Cancel anytime
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
