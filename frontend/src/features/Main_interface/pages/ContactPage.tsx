import { useState, type FormEvent } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import MainLayout from '../layouts/MainLayout'
import Section from '../components/Section'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import { APP_CONFIG } from '../constants'

const contactMethods = [
  { icon: Mail, label: 'Email', value: APP_CONFIG.email, href: `mailto:${APP_CONFIG.email}` },
  { icon: Phone, label: 'Phone', value: APP_CONFIG.phone, href: `tel:${APP_CONFIG.phone}` },
  { icon: MapPin, label: 'Address', value: APP_CONFIG.address },
]

const inquiryOptions = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Sales', value: 'sales' },
  { label: 'Technical Support', value: 'support' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Other', value: 'other' },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <MainLayout>
      <Section
        variant="alt"
        subtitle="Contact Us"
        title="Get in touch with our team"
        description="Have questions about CIMS? We're here to help. Reach out and we'll get back to you within 24 hours."
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-premium p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                    <method.icon className="text-blue-600 group-hover:text-white transition-colors duration-300" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                    {method.href ? (
                      <a href={method.href} className="text-sm text-blue-600 hover:underline">
                        {method.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500">{method.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-premium p-6 sm:p-8"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="text-emerald-600" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will review your message and respond within 24 hours.
                  </p>
                  <Button variant="outline" size="sm" className="mt-6" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Doe" required />
                  </div>
                  <Input label="Email" type="email" placeholder="john@example.com" required />
                  <Select label="Inquiry Type" options={inquiryOptions} placeholder="Select inquiry type" />
                  <Textarea label="Message" placeholder="Tell us how we can help..." rows={4} required />
                  <Button variant="gradient" size="lg" icon={<Send size={18} />} type="submit" className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </Section>
    </MainLayout>
  )
}
