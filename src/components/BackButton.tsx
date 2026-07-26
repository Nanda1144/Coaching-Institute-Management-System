import { useNavigate } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'

interface BackButtonProps {
  to?: string
  label?: string
  className?: string
}

export default function BackButton({ to, label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors ${className}`}
    >
      <MdArrowBack size={18} />
      {label}
    </button>
  )
}
