import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onFinish?: () => void
  duration?: number
}

const loadingSteps = ['Loading modules...', 'Initializing UI...', 'Preparing dashboard...', 'Almost ready...']

export default function LoadingScreen({ onFinish, duration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 15, 100)
        setStepIndex(Math.min(Math.floor(next / 25), loadingSteps.length - 1))
        return next
      })
    }, 200)

    const timer = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        setShow(false)
        onFinish?.()
      }, 400)
    }, duration)

    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [duration, onFinish])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-transparent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
            </div>
          </div>

          <motion.h2
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-lg font-medium mb-6"
          >
            {loadingSteps[stepIndex]}
          </motion.h2>

          <div className="w-64 h-1.5 rounded-full bg-gray-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <p className="text-gray-400 text-sm mt-3">{Math.round(progress)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
