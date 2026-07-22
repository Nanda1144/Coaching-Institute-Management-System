import { useState, useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react'
import type { MainLayoutProps } from '../types'
import { cn } from '../utils/cn'
import { MAIN_NAV_ITEMS } from '../constants'
import Button from '../components/Button'
import Container from '../components/Container'
import FloatingIconsLayer from '../animations/FloatingIconsLayer'

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  window.history.replaceState(null, '', `#${id}`)
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { hash, pathname } = useLocation()
  const navigate = useNavigate()

  const { scrollY, scrollYProgress } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  const handleNavClick = useCallback((href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      scrollToSection(href.slice(1))
    } else {
      navigate(href)
    }
  }, [navigate])

  useEffect(() => {
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'
            : 'bg-transparent',
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <GraduationCap className="text-white" size={22} />
              </div>
              <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">CIMS</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = item.href.startsWith('#') ? hash === item.href : pathname === item.href
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group',
                      isActive
                        ? scrolled ? 'text-blue-700' : 'text-white'
                        : scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn(
                          'absolute inset-0 rounded-xl',
                          scrolled ? 'bg-blue-50' : 'bg-white/10'
                        )}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    <span className={cn(
                      'absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-400 rounded-full transition-all duration-300 group-hover:w-3/4',
                      isActive && 'w-3/4',
                    )} />
                  </motion.a>
                )
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className={!scrolled ? 'text-white/90 hover:text-white hover:bg-white/10' : ''}>Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="gradient" size="sm" icon={<Sparkles size={16} />}>Get Started</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-xl transition-colors',
                scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/80 hover:bg-white/10'
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </Container>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-xl p-6 space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = item.href.startsWith('#') ? hash === item.href : pathname === item.href
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5',
                    )}
                  >
                    {item.label}
                  </motion.a>
                )
              })}
              <div className="pt-4 border-t border-gray-800 flex gap-3">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth size="sm" className="text-white border-white/30 hover:bg-white/10 hover:text-white">Sign In</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="gradient" fullWidth size="sm">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingIconsLayer />

      <motion.main
        className="pt-16 sm:pt-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
