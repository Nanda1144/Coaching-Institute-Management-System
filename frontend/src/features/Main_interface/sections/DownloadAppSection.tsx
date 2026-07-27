import { motion } from 'framer-motion'
import { Smartphone, Download, CheckCircle, Star } from 'lucide-react'
import Section from '../components/Section'
import { DOWNLOAD_APP as _DOWNLOAD_APP } from '../constants'

const DOWNLOAD_APP = _DOWNLOAD_APP as any

export default function DownloadAppSection() {
  return (
    <Section
      id="download-app"
      subtitle="Mobile App"
      title={DOWNLOAD_APP.title}
      description={DOWNLOAD_APP.description}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {DOWNLOAD_APP.features.map((f: string, i: number) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="card-premium p-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="text-emerald-600" size={14} aria-hidden="true" />
                </div>
                <span className="text-sm text-gray-700">{f}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {DOWNLOAD_APP.platforms.map((platform: any) => (
              <a
                key={platform.name}
                href={platform.href}
                className="flex items-center gap-3 bg-gray-900 text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors group"
              >
                <Smartphone size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                <div>
                  <p className="text-xs text-gray-400">{platform.badge}</p>
                  <p className="text-sm font-semibold">{platform.name}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Smartphone className="text-white" size={40} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Scan to Download</h3>
            <p className="text-sm text-gray-400 mb-6">Available on iOS and Android</p>
            <div className="w-40 h-40 bg-white/5 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-dashed border-white/10">
              <div className="text-center">
                <Download size={32} className="text-white/30 mx-auto mb-2" aria-hidden="true" />
                <span className="text-xs text-white/30">QR Code</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} fill="currentColor" aria-hidden="true" />
              ))}
              <span className="text-white text-sm ml-2">4.8/5 from 2000+ reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
