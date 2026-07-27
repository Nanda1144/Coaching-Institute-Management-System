import { MdViewModule, MdViewList } from 'react-icons/md'
import { motion } from 'framer-motion'

interface ViewToggleProps {
  view: 'card' | 'table'
  onChange: (v: 'card' | 'table') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('card')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          view === 'card' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <MdViewModule className="text-base" />
        Cards
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('table')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          view === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <MdViewList className="text-base" />
        Table
      </motion.button>
    </div>
  )
}
