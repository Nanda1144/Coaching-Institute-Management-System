import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts'
import type { DailyAttendance, WeeklyTrend, DepartmentAttendance, MonthlySummary } from '../types/attendance.types'

interface AttendanceChartsProps {
  dailyAttendance: DailyAttendance[]
  weeklyTrend: WeeklyTrend[]
  departmentAttendance: DepartmentAttendance[]
  monthlySummary: MonthlySummary[]
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-white/30 text-sm">
        <p className="font-medium text-gray-800 mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#6366f1']

export default function AttendanceCharts({ dailyAttendance, weeklyTrend, departmentAttendance, monthlySummary, loading }: AttendanceChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm p-5 animate-pulse">
            <div className="h-5 w-44 bg-gray-200 rounded mb-4" />
            <div className="h-52 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Daily Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dailyAttendance} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={24} name="Present" stackId="a" />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={24} name="Absent" stackId="a" />
            <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={24} name="Late" stackId="a" />
            <Bar dataKey="leave" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={24} name="Leave" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.15} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#8b5cf6' }} name="Attendance %" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Department-wise Attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={departmentAttendance}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="percentage"
              nameKey="department"
            >
              {departmentAttendance.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => {
                const dept = departmentAttendance.find(d => d.department === value)
                return <span className="text-xs text-gray-600">{value} ({dept?.percentage}%)</span>
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Attendance Summary</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlySummary} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#3b82f6' }} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
