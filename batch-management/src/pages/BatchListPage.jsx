import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BatchTable from '../components/BatchTable';
import Pagination from '../components/Pagination';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import useBatchFilters from '../hooks/useBatchFilters';
import initialBatches from '../data/batches';

export default function BatchListPage({ onNavigate }) {
  const [batches, setBatches] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ciiims_batches');
      return stored ? JSON.parse(stored) : initialBatches;
    } catch {
      return initialBatches;
    }
  });

  useEffect(() => {
    sessionStorage.setItem('ciiims_batches', JSON.stringify(batches));
  }, [batches]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const {
    search, setSearch,
    courseFilter, setCourseFilter,
    facultyFilter, setFacultyFilter,
    statusFilter, setStatusFilter,
    scheduleFilter, setScheduleFilter,
    currentPage, setCurrentPage,
    rowsPerPage, handleRowsPerPageChange,
    filteredBatches, paginatedBatches, pageCount, clearFilters,
  } = useBatchFilters(batches);

  const courseOptions = useMemo(() => [...new Set(batches.map((b) => b.course))], [batches]);
  const facultyOptions = useMemo(() => [...new Set(batches.map((b) => b.faculty))], [batches]);
  const statusOptions = useMemo(() => [...new Set(batches.map((b) => b.status))], [batches]);
  const scheduleOptions = useMemo(() => [...new Set(batches.map((b) => b.schedule))], [batches]);

  const hasFilters = !!(search || courseFilter || facultyFilter || statusFilter || scheduleFilter);

  return (
    <div className="page">
      <Header title="Batch List" count={filteredBatches.length} />
      <div className="content-area">
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          courseFilter={courseFilter} setCourseFilter={setCourseFilter}
          facultyFilter={facultyFilter} setFacultyFilter={setFacultyFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          scheduleFilter={scheduleFilter} setScheduleFilter={setScheduleFilter}
          clearFilters={clearFilters}
          courseOptions={courseOptions} facultyOptions={facultyOptions}
          statusOptions={statusOptions} scheduleOptions={scheduleOptions}
        />
        {loading ? (
          <LoadingState />
        ) : filteredBatches.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            <BatchTable batches={paginatedBatches} />
            <Pagination
              currentPage={currentPage} pageCount={pageCount}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}
              totalItems={filteredBatches.length}
            />
          </>
        )}
      </div>
    </div>
  );
}
