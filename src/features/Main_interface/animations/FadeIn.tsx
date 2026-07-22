import { motion } from 'framer-motion'
import type { AnimationProps } from '../types'
import { getVariant } from './variants'

export default function FadeIn({
  variant = 'fadeInUp',
  delay = 0,
  duration: _duration,
  easing: _easing = 'easeOut',
  once = true,
  className,
  children,
}: AnimationProps) {
  const baseVariant = getVariant(variant)

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { ...baseVariant.hidden },
        visible: { ...baseVariant.visible, transition: { ...(baseVariant.visible as any).transition, delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {children}
    </motion.div>
  )
}
