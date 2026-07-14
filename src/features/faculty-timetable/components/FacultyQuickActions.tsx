import { MdPrint, MdDownload, MdSwapHoriz, MdCalendarMonth } from 'react-icons/md'

interface FacultyQuickActionsProps {
  onPrint: () => void
  onDownloadPdf: () => void
  onRequestChange: () => void
  onViewCalendar: () => void
}

export default function FacultyQuickActions({
  onPrint, onDownloadPdf, onRequestChange, onViewCalendar,
}: FacultyQuickActionsProps) {
  const actions = [
    { label: 'Print Timetable', icon: MdPrint, onClick: onPrint, variant: 'secondary' as const },
    { label: 'Download PDF', icon: MdDownload, onClick: onDownloadPdf, variant: 'secondary' as const },
    { label: 'Request Change', icon: MdSwapHoriz, onClick: onRequestChange, variant: 'secondary' as const },
    { label: 'View Calendar', icon: MdCalendarMonth, onClick: onViewCalendar, variant: 'primary' as const },
  ]

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              action.variant === 'primary'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md hover:shadow-lg'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <action.icon className="text-lg" />
            <span className="text-xs leading-tight">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
