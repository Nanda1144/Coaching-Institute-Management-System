import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import type { Holiday, HolidayType } from '../types/holiday.types'
import { HOLIDAY_TYPE_CONFIG } from '../types/holiday.types'
import { getHolidaysForDate } from '../data/holidayData'

interface HolidayCalendarProps {
  holidays: Holiday[]
}

const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HolidayCalendar({ holidays }: HolidayCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const monthDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const total = startPad + lastDay.getDate() + (7 - ((startPad + lastDay.getDate()) % 7 || 7))
    const days: Array<{ date: Date; isCurrentMonth: boolean }> = []
    for (let i = 0; i < total; i++) {
      const d = new Date(year, month, 1 + i - startPad)
      days.push({ date: d, isCurrentMonth: d.getMonth() === month })
    }
    return days
  }, [year, month])

  const navigate = (dir: 'prev' | 'next') => {
    setViewDate((prev) => {
      const d = new Date(prev)
      d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1))
      return d
    })
  }

  const todayStr = new Date().toDateString()
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Holiday Calendar</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('prev')} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <MdChevronLeft className="text-gray-500 text-lg" />
          </button>
          <span className="text-sm font-medium text-gray-700 w-32 text-center">{monthLabel}</span>
          <button onClick={() => navigate('next')} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <MdChevronRight className="text-gray-500 text-lg" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {dayHeaders.map((d) => (
          <div key={d} className="p-1.5 text-center">
            <span className="text-[10px] font-semibold text-gray-500">{d}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map(({ date, isCurrentMonth }, i) => {
          const dayHolidays = getHolidaysForDate(date, holidays)
          const isToday = date.toDateString() === todayStr
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          return (
            <div
              key={'sk' + i}
              className={`aspect-square p-0.5 border border-gray-50 flex flex-col items-center justify-start ${
                !isCurrentMonth ? 'bg-gray-50/30' : ''
              } ${isToday ? 'ring-1 ring-primary/30 bg-primary/[0.03]' : ''}`}
            >
              <span
                className={`text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-primary text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                } ${isWeekend && isCurrentMonth && !isToday ? 'text-red-400' : ''}`}
              >
                {date.getDate()}
              </span>
              {dayHolidays.length > 0 && (
                <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                  {dayHolidays.slice(0, 2).map((h) => {
                    const cfg = HOLIDAY_TYPE_CONFIG[h.type as HolidayType] || HOLIDAY_TYPE_CONFIG.national
                    return (
                      <span
                        key={h.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                        title={h.name}
                      />
                    )
                  })}
                  {dayHolidays.length > 2 && (
                    <span className="text-[7px] text-gray-400 font-medium">+{dayHolidays.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
        {Object.entries(HOLIDAY_TYPE_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
            <span className="text-[10px] text-gray-500">{cfg.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
