import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth, MdPrint, MdDownload } from 'react-icons/md'
import * as XLSX from 'xlsx'
import HolidayStatsCards from '../components/HolidayStatsCards'
import HolidayCalendar from '../components/HolidayCalendar'
import HolidayList from '../components/HolidayList'
import HolidayFilters from '../components/HolidayFilters'
import SpecialEvents from '../components/SpecialEvents'
import HolidaySkeleton from '../components/HolidaySkeleton'
import {
  holidayStats, holidays, specialEvents,
  departmentOptions, monthOptions, typeOptions,
} from '../data/holidayData'
import type { HolidayFilters as FilterType } from '../types/holiday.types'

const initialFilters: FilterType = { search: '', department: '', month: '', type: '' }

export default function HolidayManagementPage() {
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterType>(initialFilters)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const handleFilterChange = useCallback((key: keyof FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const filteredHolidays = useMemo(() => {
    let result = [...holidays]
    const q = filters.search.toLowerCase()
    if (q) {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.day.toLowerCase().includes(q)
      )
    }
    if (filters.department) {
      result = result.filter((h) => h.department === filters.department || h.department === 'All Departments')
    }
    if (filters.month) {
      result = result.filter((h) => h.date.slice(5, 7) === filters.month)
    }
    if (filters.type) {
      result = result.filter((h) => h.type === filters.type)
    }
    return result
  }, [filters])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const data = filteredHolidays.map((h) => ({
      'Holiday Name': h.name,
      Date: h.date,
      Day: h.day,
      Type: h.type.charAt(0).toUpperCase() + h.type.slice(1),
      Department: h.department,
      Status: h.status.charAt(0).toUpperCase() + h.status.slice(1),
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Holidays')
    XLSX.writeFile(wb, `holiday-list-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  if (loading) return <HolidaySkeleton />

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Holiday Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            View and manage college holidays, events, and academic calendar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <MdPrint className="text-lg" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            <MdDownload className="text-lg" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
            <MdCalendarMonth className="text-primary" />
            {new Date().toLocaleDateString('en-US', { year: 'numeric' })}
          </div>
        </div>
      </motion.div>

      <HolidayStatsCards stats={holidayStats} />

      <HolidayFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        departmentOptions={departmentOptions}
        monthOptions={monthOptions}
        typeOptions={typeOptions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HolidayCalendar holidays={filteredHolidays} />
        </div>
        <div className="lg:col-span-1">
          <SpecialEvents events={specialEvents} />
        </div>
      </div>

      <HolidayList holidays={filteredHolidays} />
    </div>
  )
}
