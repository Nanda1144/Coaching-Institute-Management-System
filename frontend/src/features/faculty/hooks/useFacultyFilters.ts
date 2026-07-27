import { useState, useMemo } from 'react'
import type { Faculty, FilterConfig } from '../types/faculty.types'

const initialFilters: FilterConfig = {
  department: '',
  branch: '',
  status: '',
  experience: '',
  search: '',
}

export function useFacultyFilters(faculty: Faculty[]) {
  const [filters, setFilters] = useState<FilterConfig>(initialFilters)

  const filteredFaculty = useMemo(() => {
    let result = [...faculty]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.email.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q)
      )
    }

    if (filters.department) {
      result = result.filter(f => f.department === filters.department)
    }

    if (filters.branch) {
      result = result.filter(f => f.branch === filters.branch)
    }

    if (filters.status) {
      result = result.filter(f => f.status === filters.status)
    }

    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number)
      result = result.filter(f => {
        if (filters.experience === '15+') return f.experience >= 15
        return f.experience >= min && f.experience <= max
      })
    }

    return result
  }, [faculty, filters])

  const setFilter = (key: keyof FilterConfig, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(initialFilters)
  }

  return { filters, setFilter, resetFilters, filteredFaculty }
}
