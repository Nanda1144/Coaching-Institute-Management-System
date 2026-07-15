import './EmptyState.css';

export default function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{hasFilters ? '🔍' : '📦'}</span>
      <h3>{hasFilters ? 'No batches found' : 'No batches available'}</h3>
      <p>
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'There are no batches to display at the moment.'}
      </p>
    </div>
  );
}
