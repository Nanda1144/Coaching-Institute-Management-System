import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md'

interface PaginationProps {
  currentPage: number
  pageCount: number
  onPageChange: (p: number) => void
  rowsPerPage: number
  onRowsPerPageChange: (v: number) => void
  totalItems: number
}

export default function Pagination({
  currentPage, pageCount, onPageChange,
  rowsPerPage, onRowsPerPageChange, totalItems,
}: PaginationProps) {
  const start = (currentPage - 1) * rowsPerPage + 1
  const end = Math.min(currentPage * rowsPerPage, totalItems)

  const pages: number[] = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(pageCount, startPage + maxVisible - 1)
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i)

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-3">
      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span>Showing {start}–{end} of {totalItems}</span>
        <div className="flex items-center gap-1.5">
          <label>Rows:</label>
          <select className="select-field !py-1 !text-xs min-w-[60px]" value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="flex gap-1">
        <PageButton disabled={currentPage === 1} onClick={() => onPageChange(1)} title="First"><MdFirstPage size={16} /></PageButton>
        <PageButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} title="Previous"><MdChevronLeft size={16} /></PageButton>
        {pages.map((p) => (
          <PageButton key={p} active={p === currentPage} onClick={() => onPageChange(p)}>{p}</PageButton>
        ))}
        <PageButton disabled={currentPage === pageCount} onClick={() => onPageChange(currentPage + 1)} title="Next"><MdChevronRight size={16} /></PageButton>
        <PageButton disabled={currentPage === pageCount} onClick={() => onPageChange(pageCount)} title="Last"><MdLastPage size={16} /></PageButton>
      </div>
    </div>
  )
}

function PageButton({
  children, disabled, onClick, active, title,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  active?: boolean
  title?: string
}) {
  return (
    <button
      className={`min-w-[32px] h-[32px] flex items-center justify-center rounded-lg text-xs font-medium transition-all border
        ${active ? 'bg-primary-600 border-primary-600 text-white font-semibold' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}
