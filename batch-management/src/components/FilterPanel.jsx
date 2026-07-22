import './FilterPanel.css';

export default function FilterPanel({
  courseFilter, setCourseFilter,
  facultyFilter, setFacultyFilter,
  statusFilter, setStatusFilter,
  scheduleFilter, setScheduleFilter,
  clearFilters,
  courseOptions, facultyOptions, statusOptions, scheduleOptions,
}) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label className="filter-label">Course</label>
        <select className="filter-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="">All Courses</option>
          {courseOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Faculty</label>
        <select className="filter-select" value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
          <option value="">All Faculty</option>
          {facultyOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Schedule</label>
        <select className="filter-select" value={scheduleFilter} onChange={(e) => setScheduleFilter(e.target.value)}>
          <option value="">All Schedules</option>
          {scheduleOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <button className="clear-filters-btn" onClick={clearFilters}>✕ Clear Filters</button>
    </div>
  );
}
