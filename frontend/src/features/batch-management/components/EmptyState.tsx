import { MdSearchOff, MdInbox } from 'react-icons/md'

interface EmptyStateProps {
  hasFilters?: boolean
  title?: string
  message?: string
}

export default function EmptyState({ hasFilters, title, message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {hasFilters ? <MdSearchOff size={28} /> : <MdInbox size={28} />}
      </div>
      <h3>{title || (hasFilters ? 'No batches found' : 'No batches available')}</h3>
      <p>
        {message || (hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'There are no batches to display at the moment.')}
      </p>
    </div>
  )
}
