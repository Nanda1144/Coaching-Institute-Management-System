import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdCalendarMonth, MdPrint, MdDownload } from 'react-icons/md'
import Toast from '../../../components/Toast'
import * as XLSX from 'xlsx'
import { safeUpperFirst } from '../../../utils/unwrap'
import HolidayStatsCards from '../components/HolidayStatsCards'
import HolidayCalendar from '../components/HolidayCalendar'
import HolidayList from '../components/HolidayList'
import HolidayFilters from '../components/HolidayFilters'
import SpecialEvents from '../components/SpecialEvents'
import HolidaySkeleton from '../components/HolidaySkeleton'
import holidayService from '../../../services/holiday/holiday.service'
import type { HolidayFilters as FilterType } from '../types/holiday.types'
import type { Holiday, SpecialEvent, HolidayStats } from '../types/holiday.types'

const initialFilters: FilterType = { search: '', department: '', month: '', type: '' }

const departmentOptions = ['All Departments', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics', 'Mechanical', 'Civil', 'English', 'Biotechnology', 'Business Administration']

const monthOptions = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'national', label: 'National' },
  { value: 'festival', label: 'Festival' },
  { value: 'academic', label: 'Academic' },
  { value: 'event', label: 'Event' },
]

export default function HolidayManagementPage() {
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterType>(initialFilters)
  const [holidayStats, setHolidayStats] = useState<HolidayStats>({ totalHolidays: 0, upcomingHolidays: 0, specialEvents: 0, workingDays: 0 })
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [holidaysRes, statsRes, eventsRes] = await Promise.allSettled([
          holidayService.getAll(),
          holidayService.getStats(),
          holidayService.getSpecialEvents(),
        ])
        if (holidaysRes.status === 'fulfilled') {
          const data = holidaysRes.value
          const rawData = data?.data ?? []
          setHolidays(Array.isArray(rawData) ? rawData : (rawData?.data ?? []))
        }
        if (statsRes.status === 'fulfilled') {
          const data = statsRes.value
          const s = (data?.data ?? data) as HolidayStats
          if (s) setHolidayStats(s)
        }
        if (eventsRes.status === 'fulfilled') {
          const data = eventsRes.value
          const rawEvents = data?.data ?? []
          setSpecialEvents(Array.isArray(rawEvents) ? rawEvents : (rawEvents?.data ?? []))
        }
      } catch {
        setHolidays([])
        setSpecialEvents([])
        setToastMessage('Failed to load holiday data')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
  }, [filters, holidays])

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    const data = filteredHolidays.map((h) => ({
      'Holiday Name': h.name,
      Date: h.date,
      Day: h.day,
      Type: safeUpperFirst(h.type),
      Department: h.department,
      Status: safeUpperFirst(h.status),
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
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
