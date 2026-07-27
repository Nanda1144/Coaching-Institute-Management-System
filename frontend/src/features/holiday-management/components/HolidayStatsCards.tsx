import { MdCalendarMonth, MdEvent, MdStar, MdWork } from 'react-icons/md'
import DashboardCard from '../../../components/DashboardCard'
import type { HolidayStats } from '../types/holiday.types'

interface HolidayStatsCardsProps {
  stats: HolidayStats
}

const statConfigs = [
  { key: 'totalHolidays', title: 'Total Holidays', icon: MdCalendarMonth, color: '#3b82f6', bgColor: '#dbeafe' },
  { key: 'upcomingHolidays', title: 'Upcoming Holidays', icon: MdStar, color: '#f59e0b', bgColor: '#fef3c7' },
  { key: 'specialEvents', title: 'Special Events', icon: MdEvent, color: '#8b5cf6', bgColor: '#ede9fe' },
  { key: 'workingDays', title: 'Working Days', icon: MdWork, color: '#10b981', bgColor: '#d1fae5' },
]

export default function HolidayStatsCards({ stats }: HolidayStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfigs.map((cfg, index) => (
        <DashboardCard
          key={cfg.key}
          title={cfg.title}
          value={stats[cfg.key as keyof HolidayStats]}
          icon={cfg.icon}
          color={cfg.color}
          bgColor={cfg.bgColor}
          index={index}
        />
      ))}
    </div>
  )
}
