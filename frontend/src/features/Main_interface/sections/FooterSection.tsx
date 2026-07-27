import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowUp, Send, Mail, CheckCircle } from 'lucide-react'
import { FaLinkedin as Linkedin, FaTwitter as Twitter, FaYoutube as Youtube, FaGithub as Github } from 'react-icons/fa'
import { APP_CONFIG, FOOTER_NAV_ITEMS } from '../constants'
import Container from '../components/Container'
import Button from '../components/Button'
import { motion } from 'framer-motion'

const footerColumns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Overview', href: '/#overview' },
      { label: 'Developers', href: '/developers' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Student Management', href: '/#services' },
      { label: 'Faculty Portal', href: '/#services' },
      { label: 'Parent Dashboard', href: '/#services' },
      { label: 'Admin Panel', href: '/#services' },
    ],
  },
  {
    title: 'Resources',
    links: FOOTER_NAV_ITEMS.map((item) => ({
      label: item.label,
      href: item.href,
    })),
  },
]

const socialLinks = [
  { icon: Linkedin, href: APP_CONFIG.social.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: APP_CONFIG.social.twitter, label: 'Twitter' },
  { icon: Youtube, href: APP_CONFIG.social.youtube, label: 'YouTube' },
  { icon: Github, href: APP_CONFIG.social.github, label: 'GitHub' },
  { icon: Mail, href: `mailto:${APP_CONFIG.email}`, label: 'Email' },
]

export default function FooterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800/30 to-gray-900 pointer-events-none" />

      <Container className="relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-white mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <GraduationCap size={20} aria-hidden="true" />
              </div>
              <span className="text-lg font-bold">{APP_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{APP_CONFIG.description}</p>
          </div>

          {footerColumns.map((col) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Newsletter</h4>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm"
              >
                <CheckCircle size={16} aria-hidden="true" /> Subscribed successfully!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Button variant="gradient" size="sm" type="submit" icon={<Send size={14} />}>
                  Go
                </Button>
              </form>
            )}
          </div>

          <div className="md:text-right">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Follow Us</h4>
            <div className="flex items-center gap-2 md:justify-end">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <s.icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {APP_CONFIG.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Version 2.4.0</span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span>Made with passion for education</span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
