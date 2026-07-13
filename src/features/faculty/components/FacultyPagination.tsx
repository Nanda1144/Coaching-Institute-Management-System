import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

interface FacultyPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  goToPage: (page: number) => void
}

export default function FacultyPagination({ currentPage, totalPages, totalItems, pageSize, goToPage }: FacultyPaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{startItem}-{endItem}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span> faculty members
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronLeft className="text-lg" />
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronRight className="text-lg" />
        </button>
      </div>
    </div>
  )
}
