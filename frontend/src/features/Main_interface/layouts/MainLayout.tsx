import { useState, useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, GraduationCap, Sparkles, Home, Compass, Info, LayoutDashboard, BookOpen, Code, Mail, Smartphone } from 'lucide-react'
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
      if (pathname !== '/') {
        navigate('/' + href)
      } else {
        scrollToSection(href.slice(1))
      }
    } else {
      navigate(href)
    }
  }, [navigate, pathname])

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -24, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -24, scaleY: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 backdrop-blur-2xl border-b border-gray-800 shadow-2xl p-6 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              <nav className="relative space-y-1.5">
                {MAIN_NAV_ITEMS.map((item, i) => {
                  const isActive = item.href.startsWith('#') ? hash === item.href : pathname === item.href
                  const icons = [Home, Compass, Info, LayoutDashboard, BookOpen, Code, Smartphone, Mail]
                  const Icon = icons[i] ?? Home
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(item.href) }}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.08)', transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer border border-transparent transition-colors duration-150',
                        isActive
                          ? 'bg-white/10 text-white border-white/10 shadow-lg'
                          : 'text-white/60 hover:text-white hover:border-white/5',
                      )}
                    >
                      <span className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-white/5 text-white/40 group-hover:bg-white/10',
                      )}>
                        <Icon size={16} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full transition-all duration-300',
                        isActive ? 'bg-blue-400 opacity-100' : 'opacity-0',
                      )} />
                    </motion.a>
                  )
                })}
              </nav>
              <div className="mt-6 pt-4 border-t border-white/10 flex gap-3 relative">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth size="sm"
                    className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="gradient" fullWidth size="sm">Get Started</Button>
                </Link>
              </div>
            </motion.div>
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
