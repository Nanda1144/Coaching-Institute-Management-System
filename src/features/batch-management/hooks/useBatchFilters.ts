import { useState, useMemo } from 'react'

export default function useBatchFilters<T extends Record<string, any>>(items: T[]) {
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [facultyFilter, setFacultyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [scheduleFilter, setScheduleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((item) => {
      const matchSearch =
        !q ||
        (item.id && String(item.id).toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.course && item.course.toLowerCase().includes(q)) ||
        (item.faculty && item.faculty.toLowerCase().includes(q))
      const matchCourse = !courseFilter || item.course === courseFilter
      const matchFaculty = !facultyFilter || item.faculty === facultyFilter
      const matchStatus = !statusFilter || item.status === statusFilter
      const matchSchedule = !scheduleFilter || item.schedule === scheduleFilter
      return matchSearch && matchCourse && matchFaculty && matchStatus && matchSchedule
    })
  }, [items, search, courseFilter, facultyFilter, statusFilter, scheduleFilter])

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage))

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredItems.slice(start, start + rowsPerPage)
  }, [filteredItems, currentPage, rowsPerPage])

  function clearFilters() {
    setSearch('')
    setCourseFilter('')
    setFacultyFilter('')
    setStatusFilter('')
    setScheduleFilter('')
    setCurrentPage(1)
  }

  function handleRowsPerPageChange(val: number) {
    setRowsPerPage(val)
    setCurrentPage(1)
  }

  return {
    search, setSearch,
    courseFilter, setCourseFilter: (v: string) => { setCourseFilter(v); setCurrentPage(1) },
    facultyFilter, setFacultyFilter: (v: string) => { setFacultyFilter(v); setCurrentPage(1) },
    statusFilter, setStatusFilter: (v: string) => { setStatusFilter(v); setCurrentPage(1) },
    scheduleFilter, setScheduleFilter: (v: string) => { setScheduleFilter(v); setCurrentPage(1) },
    currentPage, setCurrentPage,
    rowsPerPage, handleRowsPerPageChange,
    filteredItems, paginatedItems, pageCount, clearFilters,
  }
}
