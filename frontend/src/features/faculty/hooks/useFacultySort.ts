import { useState, useMemo } from 'react'
import type { Faculty, SortConfig } from '../types/faculty.types'

export function useFacultySort(faculty: Faculty[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' })

  const sortedFaculty = useMemo(() => {
    const sorted = [...faculty]
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      let cmp = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        cmp = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal
      }

      return sortConfig.direction === 'asc' ? cmp : -cmp
    })
    return sorted
  }, [faculty, sortConfig])

  const requestSort = (key: keyof Faculty) => {
    setSortConfig(prev =>
      prev.key === key && prev.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' }
    )
  }

  return { sortConfig, requestSort, sortedFaculty }
}
