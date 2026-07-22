import './Pagination.css';

export default function Pagination({
  currentPage, pageCount, onPageChange,
  rowsPerPage, onRowsPerPageChange, totalItems,
}) {
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalItems);

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(pageCount, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        <span>Showing {start}–{end} of {totalItems}</span>
        <div className="rows-per-page">
          <label>Rows per page:</label>
          <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(e.target.value)}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className="pagination-controls">
        <button className="page-btn" disabled={currentPage === 1} onClick={() => onPageChange(1)} title="First">««</button>
        <button className="page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} title="Previous">«</button>
        {pages.map((p) => (
          <button key={p} className={`page-btn ${p === currentPage ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
        ))}
        <button className="page-btn" disabled={currentPage === pageCount} onClick={() => onPageChange(currentPage + 1)} title="Next">»</button>
        <button className="page-btn" disabled={currentPage === pageCount} onClick={() => onPageChange(pageCount)} title="Last">»»</button>
      </div>
    </div>
  );
}
