import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Section from '../components/Section'
import { TESTIMONIALS } from '../constants'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <Section
      id="testimonials"
      subtitle="Testimonials"
      title="What our partners say"
      description="Hear from institute directors and academic leaders who trust CIMS."
    >
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="card-premium p-6 sm:p-8"
          >
            <Quote className="absolute top-4 right-4 text-blue-100" size={40} aria-hidden="true" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <StarRating rating={testimonial.rating} />
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
