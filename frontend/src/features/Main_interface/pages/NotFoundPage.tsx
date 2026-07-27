import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import Container from '../components/Container'
import Button from '../components/Button'
import { fadeInUp, scaleIn } from '../animations/variants'

export default function NotFoundPage() {
  return (
    <MainLayout>
      <Container>
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-20">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-4"
          >
            404
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
          >
            Page not found
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-md mb-8"
          >
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button variant="gradient" size="lg" icon={<Home size={20} />} href="/">
              Back to Home
            </Button>
            <Button variant="outline" size="lg" icon={<ArrowLeft size={20} />} onClick={() => window.history.back()}>
              Go Back
            </Button>
          </motion.div>
        </div>
      </Container>
    </MainLayout>
  )
}
