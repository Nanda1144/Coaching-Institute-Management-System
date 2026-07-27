import { motion } from 'framer-motion'
import type { StaggerContainerProps } from '../types'


export default function StaggerContainer({
  delay = 0.1,
  staggerDelay = 0.1,
  once = true,
  className,
  children,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {children}
    </motion.div>
  )
}
