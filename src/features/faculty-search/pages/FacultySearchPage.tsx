import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { SearchFilters } from '../types/search.types'
import {
  facultySearchData, departmentOptions, branchOptions, qualificationOptions,
  designationOptions, statusOptions, genderOptions, experienceRanges,
} from '../data/searchData'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import FilterChips from '../components/FilterChips'
import ViewToggle from '../components/ViewToggle'
import SearchResults from '../components/SearchResults'
import SearchPagination from '../components/SearchPagination'

const PAGE_SIZE = 12

const initialFilters: SearchFilters = {
  facultyName: '', facultyId: '', department: '', branch: '',
  qualification: '', experience: '', status: '', designation: '', gender: '',
}

export default function FacultySearchPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [view, setView] = useState<'card' | 'table'>('card')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...facultySearchData]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q)
      )
    }

    if (filters.facultyName) {
      result = result.filter(f => f.name.toLowerCase().includes(filters.facultyName.toLowerCase()))
    }
    if (filters.facultyId) {
      result = result.filter(f => f.id.toLowerCase().includes(filters.facultyId.toLowerCase()))
    }
    if (filters.department) {
      result = result.filter(f => f.department === filters.department)
    }
    if (filters.branch) {
      result = result.filter(f => f.branch === filters.branch)
    }
    if (filters.qualification) {
      result = result.filter(f => f.qualification === filters.qualification)
    }
    if (filters.designation) {
      result = result.filter(f => f.designation === filters.designation)
    }
    if (filters.status) {
      result = result.filter(f => f.status === filters.status)
    }
    if (filters.gender) {
      result = result.filter(f => f.gender === filters.gender)
    }
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number)
      result = result.filter(f => {
        if (filters.experience === '15+') return f.experience >= 15
        return f.experience >= min && f.experience <= max
      })
    }

    return result
  }, [searchQuery, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  const setFilter = useCallback((key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const removeFilter = useCallback((key: keyof SearchFilters) => {
    setFilters(prev => ({ ...prev, [key]: '' }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
    setSearchQuery('')
    setPage(1)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MdHome className="text-gray-400" />
            <MdChevronRight className="text-gray-300" />
            <span>Dashboard</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Faculty Search</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Advanced Faculty Search</h2>
          <p className="text-sm text-gray-500 mt-0.5">Search and filter faculty members with advanced criteria</p>
        </div>
        <button onClick={() => navigate('/faculty')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
          <MdArrowBack className="text-lg" /> Back to List
        </button>
      </motion.div>

      <SearchBar
        value={searchQuery}
        onChange={v => { setSearchQuery(v); setPage(1) }}
        resultCount={filtered.length}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      <FilterPanel
        filters={filters}
        onChange={setFilter}
        onClear={clearFilters}
        isOpen={showFilters}
        departmentOptions={departmentOptions}
        branchOptions={branchOptions}
        qualificationOptions={qualificationOptions}
        designationOptions={designationOptions}
        statusOptions={statusOptions}
        genderOptions={genderOptions}
        experienceRanges={experienceRanges}
      />

      <div className="flex items-center justify-between">
        <FilterChips filters={filters} onRemove={removeFilter} />
        <ViewToggle view={view} onChange={v => setView(v)} />
      </div>

      <SearchResults
        faculty={paginated}
        view={view}
        onView={id => navigate(`/faculty/profile/${id}`)}
        onEdit={id => navigate(`/faculty/edit/${id}`)}
        onAssign={() => navigate('/faculty/assign')}
      />

      <SearchPagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </motion.div>
  )
}
