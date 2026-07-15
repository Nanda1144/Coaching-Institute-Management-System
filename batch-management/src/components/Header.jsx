import './Header.css';

export default function Header({ title, subtitle, count }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        {subtitle && <span className="page-subtitle">{subtitle}</span>}
        {count !== undefined && (
          <span className="batch-count">{count} batch{count !== 1 ? 'es' : ''}</span>
        )}
      </div>
      <div className="header-right">
        <button className="header-btn" aria-label="Notifications">🔔</button>
        <button className="header-btn" aria-label="Messages">💬</button>
        <div className="user-profile">
          <span className="user-avatar">SK</span>
          <span className="user-name">Shaik Farooq</span>
        </div>
      </div>
    </header>
  );
}
