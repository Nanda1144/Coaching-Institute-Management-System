import { motion } from 'framer-motion'
import { MdDescription, MdPictureAsPdf, MdWork, MdCalendarToday } from 'react-icons/md'
import type { Document } from '../types/profile.types'

interface DocumentsProps {
  documents: Document[]
}

const typeIcons: Record<string, typeof MdDescription> = {
  Certificate: MdPictureAsPdf,
  Resume: MdDescription,
  'Offer Letter': MdWork,
}

export default function Documents({ documents }: DocumentsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Documents</h3>
      <div className="space-y-2">
        {documents.map((doc, i) => {
          const Icon = typeIcons[doc.type] || MdDescription
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/30 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  doc.type === 'Certificate' ? 'bg-emerald-50 text-emerald-600' :
                  doc.type === 'Resume' ? 'bg-blue-50 text-blue-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <Icon className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MdCalendarToday className="text-[10px]" />
                {doc.date}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
