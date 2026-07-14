import { motion } from 'framer-motion'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-700">{startItem}</span>–<span className="font-medium text-gray-700">{endItem}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm border border-gray-200 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <MdChevronLeft />
        </motion.button>

        {pages.map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-medium transition-all ${
                page === currentPage
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-gray-200 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800'
              }`}
            >
              {page}
            </motion.button>
          )
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm border border-gray-200 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <MdChevronRight />
        </motion.button>
      </div>
    </div>
  )
}
