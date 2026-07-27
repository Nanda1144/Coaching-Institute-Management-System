import { MdRefresh } from 'react-icons/md'

interface RetryButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export default function RetryButton({ onClick, label = 'Retry', className = '' }: RetryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-md ${className}`}
    >
      <MdRefresh className="text-base" />
      {label}
    </button>
  )
}
