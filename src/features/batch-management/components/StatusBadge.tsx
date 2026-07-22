import { MdCheckCircle, MdSchedule, MdChecklist } from 'react-icons/md'

interface StatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { class: string; icon: React.ReactNode }> = {
  Active: { class: 'badge-success', icon: <MdCheckCircle size={12} /> },
  Scheduled: { class: 'badge-warning', icon: <MdSchedule size={12} /> },
  Completed: { class: 'badge-neutral', icon: <MdChecklist size={12} /> },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { class: 'badge-neutral', icon: null }
  return (
    <span className={`badge ${config.class}`}>
      {config.icon}
      {status}
    </span>
  )
}
