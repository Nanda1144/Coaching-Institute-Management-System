import './Sidebar.css';

const menuItems = [
  { label: 'Dashboard', icon: '📊', page: 'dashboard' },
  { label: 'Batch List', icon: '📚', page: 'batch-list' },
  { label: 'Add Batch', icon: '➕', page: 'add-batch' },
  { label: 'Students', icon: '👥', page: 'students' },
  { label: 'Faculty', icon: '👨‍🏫', page: 'faculty' },
  { label: 'Courses', icon: '📖', page: 'courses' },
  { label: 'Schedule', icon: '📅', page: 'schedule' },
  { label: 'Attendance', icon: '✅', page: 'attendance' },
  { label: 'Payments', icon: '💰', page: 'payments' },
  { label: 'Reports', icon: '📈', page: 'reports' },
  { label: 'Settings', icon: '⚙️', page: 'settings' },
];

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          {!collapsed && <span className="logo-text">CIIMS</span>}
        </div>
        <button
          className="toggle-btn"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.page}
            className={`nav-item ${activePage === item.page ? 'active' : ''}`}
            onClick={() => onNavigate(item.page)}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        {!collapsed && <span className="footer-text">CIIMS v1.0</span>}
      </div>
    </aside>
  );
}
