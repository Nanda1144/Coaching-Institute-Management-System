import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSchool, MdPeople, MdCalendarToday, MdAssignment, MdMenu, MdClose, MdEmail, MdPhone, MdLocationOn, MdArrowForward, MdCheckCircle } from 'react-icons/md'
import LoginModal from '../components/LoginModal'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-gray-800">EduManage</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <button
                onClick={() => setShowLogin(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {mobileMenu ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3"
          >
            <a href="#home" className="block text-sm font-medium text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Home</a>
            <a href="#services" className="block text-sm font-medium text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Services</a>
            <a href="#about" className="block text-sm font-medium text-gray-600 py-2" onClick={() => setMobileMenu(false)}>About</a>
            <a href="#contact" className="block text-sm font-medium text-gray-600 py-2" onClick={() => setMobileMenu(false)}>Contact</a>
            <button
              onClick={() => { setMobileMenu(false); setShowLogin(true) }}
              className="w-full px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold"
            >
              Login
            </button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
                College Management System
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Simplify College{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Management
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                A comprehensive ERP solution for managing faculty, students, attendance, timetables, assignments, and more — all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2"
                >
                  Get Started <MdArrowForward />
                </button>
                <a
                  href="#services"
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="w-full aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[
                      { icon: <MdSchool className="text-3xl" />, label: 'Faculty' },
                      { icon: <MdPeople className="text-3xl" />, label: 'Students' },
                      { icon: <MdCalendarToday className="text-3xl" />, label: 'Timetable' },
                      { icon: <MdAssignment className="text-3xl" />, label: 'Assignments' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/80 backdrop-blur rounded-2xl p-6 flex flex-col items-center gap-2 shadow-sm">
                        <div className="text-blue-600">{item.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '500+', label: 'Faculty Members' },
            { number: '5000+', label: 'Students' },
            { number: '50+', label: 'Courses' },
            { number: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <motion.div key={i} className="text-center" {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{stat.number}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to manage every aspect of your educational institution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MdPeople />, title: 'Faculty Management', desc: 'Manage faculty profiles, assignments, transfers, and performance tracking.' },
              { icon: <MdSchool />, title: 'Student Management', desc: 'Student records, enrollment, academic history, and communication.' },
              { icon: <MdCalendarToday />, title: 'Timetable Scheduling', desc: 'Create and manage class schedules, room assignments, and conflict resolution.' },
              { icon: <MdAssignment />, title: 'Assignment & Evaluation', desc: 'Create assignments, accept submissions, grade, and provide feedback.' },
              { icon: <MdCheckCircle />, title: 'Attendance Tracking', desc: 'Multiple attendance methods including face recognition, fingerprint, and QR code.' },
              { icon: <MdEmail />, title: 'Communication Hub', desc: 'Automated reminders, notifications, and announcements across channels.' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 text-2xl group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Modern Education Management</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                EduManage is a state-of-the-art College ERP system designed to streamline administrative tasks, 
                enhance communication between faculty and students, and provide real-time insights into institutional performance.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Secure cloud-based infrastructure',
                  'Role-based access control',
                  'Real-time analytics and reporting',
                  'Multi-campus support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <MdCheckCircle className="text-green-500 shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold">Trusted by Institutions</h3>
              <p className="mt-3 text-blue-100">Join hundreds of educational institutions that rely on EduManage for their daily operations.</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-blue-200">Institutions</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-blue-200">Active Users</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">Contact Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get In Touch</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div {...fadeUp} className="space-y-6">
              {[
                { icon: <MdEmail className="text-xl" />, title: 'Email', value: 'support@edumanage.com' },
                { icon: <MdPhone className="text-xl" />, title: 'Phone', value: '+1 (555) 123-4567' },
                { icon: <MdLocationOn className="text-xl" />, title: 'Address', value: '123 Education Lane, Learning City, ED 12345' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              <textarea rows={4} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
              <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">E</span>
                </div>
                <span className="text-lg font-bold text-white">EduManage</span>
              </div>
              <p className="text-sm">Modern college management system for educational institutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#home" className="block hover:text-white transition-colors">Home</a>
                <a href="#services" className="block hover:text-white transition-colors">Services</a>
                <a href="#about" className="block hover:text-white transition-colors">About</a>
                <a href="#contact" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <span className="block">Faculty Management</span>
                <span className="block">Student Management</span>
                <span className="block">Attendance Tracking</span>
                <span className="block">Timetable Scheduling</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <span className="block">Help Center</span>
                <span className="block">Documentation</span>
                <span className="block">Privacy Policy</span>
                <span className="block">Terms of Service</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm">
            &copy; {new Date().getFullYear()} EduManage. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
