import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Globe,
  Search,
  LogIn,
  Shield,
  GitBranch,
  Users,
  GraduationCap,
  UserCheck,
  LayoutDashboard,
  Bell,
  RefreshCw,
  Smartphone,
  Download,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  ArrowDown,
  ChevronRight,
} from 'lucide-react'
import { FaLinkedin as Linkedin, FaTwitter as Twitter, FaYoutube as Youtube, FaGithub as Github } from 'react-icons/fa'
import MainLayout from '../layouts/MainLayout'
import Container from '../components/Container'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Section from '../components/Section'
import { APP_CONFIG, FAQS } from '../constants'
import { fadeInUp, fadeInDown, staggerItem } from '../animations/variants'
import { cn } from '../utils/cn'

/* ─── Flow Step Data ─── */
interface FlowStep {
  id: string
  icon: typeof User
  label: string
  subtitle?: string
  gradient: string
  row: number
  col: number
}

const flowSteps: FlowStep[] = [
  { id: 'user', icon: User, label: 'User', gradient: 'from-blue-500 to-blue-600', row: 0, col: 0 },
  { id: 'landing', icon: Globe, label: 'Landing Website', gradient: 'from-indigo-500 to-indigo-600', row: 0, col: 2 },
  { id: 'explore', icon: Search, label: 'Explore Services', gradient: 'from-violet-500 to-violet-600', row: 0, col: 4 },
  { id: 'login', icon: LogIn, label: 'Login / Signup', gradient: 'from-purple-500 to-purple-600', row: 0, col: 6 },
  { id: 'auth', icon: Shield, label: 'Authentication', gradient: 'from-pink-500 to-pink-600', row: 1, col: 6 },
  { id: 'role', icon: GitBranch, label: 'Role Detection', gradient: 'from-rose-500 to-rose-600', row: 1, col: 4 },
]

const roleCards = [
  { id: 'admin', icon: Users, label: 'Admin', gradient: 'from-blue-600 to-indigo-600', description: 'Full system control, user management, analytics, and institute-wide configurations.' },
  { id: 'faculty', icon: GraduationCap, label: 'Faculty', gradient: 'from-emerald-600 to-teal-600', description: 'Manage courses, mark attendance, grade students, and share learning materials.' },
  { id: 'student', icon: UserCheck, label: 'Student', gradient: 'from-purple-600 to-pink-600', description: 'View attendance, grades, schedules, course materials, and submit assignments.' },
  { id: 'parent', icon: Users, label: 'Parent', gradient: 'from-orange-600 to-red-600', description: 'Monitor ward progress, receive updates, communicate with faculty.' },
]

const postRoleSteps: FlowStep[] = [
  { id: 'profile', icon: UserCheck, label: 'Profile Setup', gradient: 'from-cyan-500 to-cyan-600', row: 2, col: 0 },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-teal-500 to-teal-600', row: 2, col: 2 },
  { id: 'admin-updates', icon: Bell, label: 'Admin Updates', subtitle: 'Faculty Updates', gradient: 'from-blue-600 to-indigo-600', row: 2, col: 4 },
  { id: 'student-portal', icon: RefreshCw, label: 'Students Portal', subtitle: 'Updated', gradient: 'from-emerald-600 to-teal-600', row: 2, col: 6 },
  { id: 'parent-portal', icon: Users, label: 'Parents Portal', subtitle: 'Updated', gradient: 'from-purple-600 to-pink-600', row: 2, col: 8 },
]

/* ─── Arrow Component ─── */
function FlowArrow({ direction = 'right' }: { direction?: 'right' | 'down' | 'down-right' }) {
  if (direction === 'right') {
    return (
      <div className="flex items-center justify-center w-8 sm:w-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-blue-300"
        >
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    )
  }
  if (direction === 'down') {
    return (
      <div className="flex items-center justify-center h-8 sm:h-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-blue-300"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>
    )
  }
  return null
}

/* ─── Flow Node Card ─── */
function FlowNode({ step, index }: { step: FlowStep; index: number }) {
  const Icon = step.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -4, scale: 1.03 }}
      className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-3 sm:p-4 text-center hover:shadow-xl transition-all duration-300 min-w-[90px] sm:min-w-[120px]"
    >
      <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br mx-auto flex items-center justify-center shadow-md mb-2', step.gradient)}>
        <Icon className="text-white" size={20} aria-hidden="true" />
      </div>
      <p className="text-xs sm:text-sm font-bold text-gray-800 leading-tight">{step.label}</p>
      {step.subtitle && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{step.subtitle}</p>}
    </motion.div>
  )
}

/* ─── Role Card ─── */
function RoleCard({ role, index }: { role: typeof roleCards[0]; index: number }) {
  const Icon = role.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -6 }}
      className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 text-center"
    >
      <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br mx-auto flex items-center justify-center shadow-lg mb-4', role.gradient)}>
        <Icon className="text-white" size={28} aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{role.label}</h3>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{role.description}</p>
    </motion.div>
  )
}

/* ─── Download App Section ─── */
function DownloadAppSection() {
  return (
    <Section id="download" subtitle="Mobile App" title="Take CIMS everywhere you go" description="Available on iOS and Android. Stay connected with your institute on the move.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              'Mark attendance on the go',
              'View real-time performance',
              'Receive instant notifications',
              'Communicate with faculty & parents',
              'Access course materials anywhere',
              'Manage schedules & timetables',
            ].map((f) => (
              <motion.div
                key={f}
                variants={staggerItem}
                className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span className="text-xs sm:text-sm text-gray-700">{f}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-6 py-3.5 hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Smartphone size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Download on the</p>
                <p className="text-sm font-bold">App Store</p>
              </div>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-6 py-3.5 hover:bg-gray-800 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Smartphone size={18} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Get it on</p>
                <p className="text-sm font-bold">Google Play</p>
              </div>
            </motion.a>
          </div>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl text-center"
          >
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-16 h-28 sm:w-20 sm:h-36 bg-gray-800 rounded-2xl border-2 border-gray-700 flex items-center justify-center">
                <Smartphone size={28} className="text-gray-600" aria-hidden="true" />
              </div>
              <div className="w-16 h-28 sm:w-20 sm:h-36 bg-gray-800 rounded-2xl border-2 border-gray-700 flex items-center justify-center">
                <Smartphone size={28} className="text-gray-600" aria-hidden="true" />
              </div>
            </div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-white/20">
              <div className="text-center">
                <Download size={28} className="text-white/40 mx-auto mb-1" aria-hidden="true" />
                <span className="text-[10px] text-white/40">QR Code</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" aria-hidden="true" />)}
              <span className="text-white text-xs sm:text-sm ml-2">4.8/5</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

/* ─── FAQ Section ─── */
function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Section id="faq" variant="alt" subtitle="FAQ" title="Frequently asked questions" description="Everything you need to know about CIMS.">
      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map((faq) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
            >
              <span className="text-sm sm:text-base font-semibold text-gray-900 pr-4">{faq.question}</span>
              {openId === faq.id ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
            </button>
            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ─── Contact Us Section ─── */
function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Section id="contact" subtitle="Contact Us" title="Get in touch with our team" description="Have questions? We would love to hear from you.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <div className="bg-gray-200 rounded-2xl h-48 sm:h-56 flex items-center justify-center border border-gray-300">
            <div className="text-center">
              <MapPin size={32} className="text-gray-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-gray-500">Google Maps Placeholder</p>
              <p className="text-[10px] sm:text-xs text-gray-400">{APP_CONFIG.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: 'Address', value: APP_CONFIG.address },
              { icon: Phone, label: 'Phone', value: APP_CONFIG.phone, href: `tel:${APP_CONFIG.phone}` },
              { icon: Mail, label: 'Email', value: APP_CONFIG.email, href: `mailto:${APP_CONFIG.email}` },
              { icon: Clock, label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <item.icon className="text-blue-600" size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-xs text-blue-600 hover:underline break-words">{item.value}</a>
                    ) : (
                      <p className="text-xs text-gray-500 break-words">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: Linkedin, href: APP_CONFIG.social.linkedin },
              { icon: Twitter, href: APP_CONFIG.social.twitter },
              { icon: Youtube, href: APP_CONFIG.social.youtube },
              { icon: Github, href: APP_CONFIG.social.github },
            ].map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-colors">
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="text-emerald-600" size={28} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">Thank you for reaching out. Our team will respond within 24 hours.</p>
                  <Button variant="outline" size="sm" className="mt-6" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Doe" required />
                  </div>
                  <Input label="Email" type="email" placeholder="john@example.com" required />
                  <Input label="Subject" placeholder="How can we help?" required />
                  <Textarea label="Message" placeholder="Tell us more about your inquiry..." rows={4} required />
                  <Button variant="gradient" size="lg" icon={<Send size={18} />} type="submit" className="w-full sm:w-auto">Send Message</Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

/* ─── Footer ─── */
function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 text-white mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <GraduationCapIcon size={20} />
              </div>
              <span className="text-lg font-bold">{APP_CONFIG.name}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-4">{APP_CONFIG.description}</p>
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin, href: APP_CONFIG.social.linkedin },
                { icon: Twitter, href: APP_CONFIG.social.twitter },
                { icon: Youtube, href: APP_CONFIG.social.youtube },
                { icon: Github, href: APP_CONFIG.social.github },
              ].map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Platform', links: ['Features', 'Courses', 'Pricing', 'FAQ'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Support', links: ['Help Center', 'Documentation', 'API Reference', 'Status'] },
          ].map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {APP_CONFIG.fullName}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}

function GraduationCapIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

/* ─── Main Page ─── */
export default function WorkflowPage() {
  return (
    <MainLayout>
      {/* ─── Hero ─── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950 pt-20">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <Container className="relative z-10 py-16 sm:py-20">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeInDown} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium mb-6">
              <GitBranch size={16} aria-hidden="true" /> Workflow
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
              How{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">CIMS</span>{' '}
              Works
            </motion.h1>
            <motion.p variants={fadeInUp} transition={{ delay: 0.15 }} className="text-lg text-blue-200/80 max-w-xl mx-auto">
              From the moment you land on our website to full institute management — see the complete user journey.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ─── Flow Diagram ─── */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
        <Container>
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">User Journey Flow</h2>
            <p className="text-gray-500">End-to-end workflow from entry to actionable dashboards.</p>
          </motion.div>

          {/* Row 0: User → Landing → Explore → Login */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
            {flowSteps.slice(0, 4).map((step, i) => (
              <div key={step.id} className="flex items-center">
                <FlowNode step={step} index={i} />
                {i < 3 && <FlowArrow direction="right" />}
              </div>
            ))}
          </div>

          {/* Row 1: Auth ← Role Detection */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="w-[90px] sm:w-[120px]" />
            <FlowArrow direction="right" />
            <FlowNode step={flowSteps[5]} index={4} />
            <FlowArrow direction="right" />
            <FlowNode step={flowSteps[4]} index={5} />
          </div>

          {/* Vertical connectors Row 0 → Row 1 */}
          <div className="flex justify-center gap-[180px] sm:gap-[240px] mb-4">
            <FlowArrow direction="down" />
            <FlowArrow direction="down" />
          </div>

          {/* Row 2: Role Detection → Auth */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            <FlowNode step={flowSteps[5]} index={6} />
          </div>

          {/* Role Cards */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Role-Based Experience</h2>
            <p className="text-sm text-gray-500">Each role gets a tailored experience with relevant features.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {roleCards.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i} />
            ))}
          </div>

          {/* Post-Role Steps */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">What Happens Next</h2>
            <p className="text-sm text-gray-500">After role assignment, the system guides each user through setup.</p>
          </motion.div>

          {/* Arrow down from roles */}
          <div className="flex justify-center mb-4">
            <FlowArrow direction="down" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {postRoleSteps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <FlowNode step={step} index={i} />
                {i < postRoleSteps.length - 1 && <FlowArrow direction="right" />}
              </div>
            ))}
          </div>

          {/* Final update flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {[
              { icon: Bell, label: 'Admin Updates', gradient: 'from-blue-600 to-indigo-600' },
              { icon: GraduationCap, label: 'Faculty Updates', gradient: 'from-emerald-600 to-teal-600' },
              { icon: UserCheck, label: 'Student Portal Updated', gradient: 'from-purple-600 to-pink-600' },
              { icon: Users, label: 'Parent Portal Updated', gradient: 'from-orange-600 to-red-600' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center', item.gradient)}>
                  <item.icon className="text-white" size={16} aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ─── Download App ─── */}
      <DownloadAppSection />

      {/* ─── FAQ ─── */}
      <FAQSection />

      {/* ─── Contact ─── */}
      <ContactSection />

      {/* ─── Footer ─── */}
      <FooterSection />
    </MainLayout>
  )
}
