import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import type { AuthLayoutProps } from '../types'
import { motion } from 'framer-motion'

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex relative overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/20 blur-3xl animate-float"
        aria-hidden="true"
      />

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 animate-float-slow" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5 animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 animate-pulse-glow" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold">CIMS</span>
          </Link>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">
              {title || 'Welcome to CIMS'}
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">
              {subtitle || 'Streamline your institute operations with our all-in-one management platform.'}
            </p>
          </div>
          <p className="text-blue-200/60 text-sm">
            &copy; {new Date().getFullYear()} CIMS. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={22} aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-gray-900">CIMS</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
