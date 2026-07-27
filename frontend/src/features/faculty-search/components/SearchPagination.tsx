import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function SearchPagination({ currentPage, totalPages, onPageChange }: SearchPaginationProps) {
  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <MdChevronLeft className="text-lg" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="min-w-[36px] h-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">1</button>
          {start > 2 && <span className="text-gray-300 text-sm px-1">...</span>}
        </>
      )}
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
            page === currentPage ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-300 text-sm px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="min-w-[36px] h-9 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <MdChevronRight className="text-lg" />
      </button>
    </div>
  )
}
