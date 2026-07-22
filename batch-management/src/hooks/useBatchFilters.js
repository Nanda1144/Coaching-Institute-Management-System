import { useState, useMemo } from 'react';

export default function useBatchFilters(batches) {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredBatches = useMemo(() => {
    const q = search.toLowerCase();
    return batches.filter((b) => {
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.course.toLowerCase().includes(q) ||
        b.faculty.toLowerCase().includes(q);
      const matchCourse = !courseFilter || b.course === courseFilter;
      const matchFaculty = !facultyFilter || b.faculty === facultyFilter;
      const matchStatus = !statusFilter || b.status === statusFilter;
      const matchSchedule = !scheduleFilter || b.schedule === scheduleFilter;
      return matchSearch && matchCourse && matchFaculty && matchStatus && matchSchedule;
    });
  }, [batches, search, courseFilter, facultyFilter, statusFilter, scheduleFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredBatches.length / rowsPerPage));
  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBatches.slice(start, start + rowsPerPage);
  }, [filteredBatches, currentPage, rowsPerPage]);

  function clearFilters() {
    setSearch('');
    setCourseFilter('');
    setFacultyFilter('');
    setStatusFilter('');
    setScheduleFilter('');
    setCurrentPage(1);
  }

  function handleRowsPerPageChange(val) {
    setRowsPerPage(Number(val));
    setCurrentPage(1);
  }

  return {
    search, setSearch,
    courseFilter, setCourseFilter: (v) => { setCourseFilter(v); setCurrentPage(1); },
    facultyFilter, setFacultyFilter: (v) => { setFacultyFilter(v); setCurrentPage(1); },
    statusFilter, setStatusFilter: (v) => { setStatusFilter(v); setCurrentPage(1); },
    scheduleFilter, setScheduleFilter: (v) => { setScheduleFilter(v); setCurrentPage(1); },
    currentPage, setCurrentPage,
    rowsPerPage, handleRowsPerPageChange,
    filteredBatches, paginatedBatches, pageCount, clearFilters,
  };
}
