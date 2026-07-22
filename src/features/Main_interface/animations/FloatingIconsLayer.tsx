import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const icons = [
  { icon: '🎓', x: '5%', y: '15%', delay: 0, dur: 20 },
  { icon: '📚', x: '92%', y: '25%', delay: 2, dur: 22 },
  { icon: '🏫', x: '8%', y: '60%', delay: 4, dur: 25 },
  { icon: '📝', x: '88%', y: '70%', delay: 1, dur: 18 },
  { icon: '📖', x: '50%', y: '10%', delay: 3, dur: 24 },
  { icon: '🧠', x: '15%', y: '80%', delay: 5, dur: 21 },
  { icon: '💻', x: '75%', y: '15%', delay: 1.5, dur: 19 },
  { icon: '📊', x: '85%', y: '50%', delay: 3.5, dur: 23 },
  { icon: '☁️', x: '20%', y: '40%', delay: 2.5, dur: 26 },
  { icon: '📜', x: '68%', y: '85%', delay: 4.5, dur: 22 },
  { icon: '👨‍🏫', x: '45%', y: '90%', delay: 0.5, dur: 20 },
  { icon: '👨‍🎓', x: '35%', y: '5%', delay: 6, dur: 24 },
  { icon: '💰', x: '95%', y: '40%', delay: 2, dur: 25 },
  { icon: '🕒', x: '3%', y: '45%', delay: 5.5, dur: 21 },
]

export default function FloatingIconsLayer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5" aria-hidden="true">
      {icons.map((item) => (
        <motion.div
          key={item.delay}
          className="absolute select-none"
          style={{ left: item.x, top: item.y, fontSize: 24 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.08, 0.08, 0],
            scale: [0.5, 1, 1, 0.5],
            y: [0, -25, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: item.dur,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.2, 0.8, 1],
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  )
}
