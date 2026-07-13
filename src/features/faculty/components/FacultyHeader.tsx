import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdChevronRight, MdHome, MdAdd, MdDownload, MdArrowDropDown } from 'react-icons/md'

interface FacultyHeaderProps {
  onAdd: () => void
  onExportCSV: () => void
  onExportXLSX: () => void
}

export default function FacultyHeader({ onAdd, onExportCSV, onExportXLSX }: FacultyHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <MdHome className="text-gray-400" />
          <MdChevronRight className="text-gray-300" />
          <span>Dashboard</span>
          <MdChevronRight className="text-gray-300" />
          <span className="text-primary font-medium">Faculty</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Faculty List</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage all faculty members across departments</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            <MdDownload className="text-lg" />
            Export
            <MdArrowDropDown className="text-lg" />
          </motion.button>
          <AnimatePresence>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 origin-top"
              >
                <button
                  onClick={() => { onExportCSV(); setExportOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Download as CSV
                </button>
                <button
                  onClick={() => { onExportXLSX(); setExportOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Download as XLSX
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
        >
          <MdAdd className="text-lg" />
          Add Faculty
        </motion.button>
      </div>
    </motion.div>
  )
}
