import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area,
} from 'recharts'
import type { TrendPoint, DepartmentData, MonthlyData, HeatmapDay } from '../types/attendanceAnalytics.types'

interface AnalyticsChartsProps {
  trend: TrendPoint[]
  departmentData: DepartmentData[]
  monthlyData: MonthlyData[]
  heatmap: HeatmapDay[]
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-white/30 text-sm">
        <p className="font-medium text-gray-800 mb-1.5">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold text-xs">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function HeatmapGrid({ data }: { data: HeatmapDay[] }) {
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-400'
    if (value >= 80) return 'bg-emerald-300'
    if (value >= 70) return 'bg-amber-300'
    return 'bg-red-300'
  }

  const getTextColor = (value: number) => {
    if (value >= 80) return 'text-white'
    return 'text-gray-700'
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="flex mb-2">
          <div className="w-20 flex-shrink-0" />
          {data[0]?.slots.map((slot) => (
            <div key={slot.label} className="flex-1 text-center text-[10px] text-gray-500 font-medium">
              {slot.label}
            </div>
          ))}
        </div>
        {data.map((row) => (
          <div key={row.day} className="flex items-center mb-1.5">
            <div className="w-20 flex-shrink-0 text-[10px] text-gray-600 font-medium">{row.day}</div>
            {row.slots.map((slot) => (
              <motion.div
                key={slot.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex-1 mx-0.5 h-10 rounded-lg ${getColor(slot.value)} ${getTextColor(slot.value)} flex flex-col items-center justify-center shadow-sm`}
                title={`${slot.label} - ${slot.value}% (${slot.count} students)`}
              >
                <span className="text-[10px] font-bold leading-none">{slot.value}%</span>
                <span className="text-[7px] opacity-80 leading-none mt-0.5">{slot.count}</span>
              </motion.div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-gray-400">Low</span>
          {['bg-red-300', 'bg-amber-300', 'bg-emerald-300', 'bg-emerald-400'].map((c) => (
            <div key={c} className={`w-4 h-4 rounded ${c}`} />
          ))}
          <span className="text-[9px] text-gray-400">High</span>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsCharts({ trend, departmentData, monthlyData, heatmap, loading }: AnalyticsChartsProps) {
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

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trend} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={3} fill="url(#trendGrad)" dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Attendance %" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Department Comparison</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="department" tick={{ fontSize: 10, fill: '#6b7280' }} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" name="Attendance %" radius={[0, 4, 4, 0]}>
              {departmentData.map((_, index) => (
                <Cell key={index} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Percentage</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#10b981' }} name="Attendance %" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Attendance Heatmap</h3>
        <HeatmapGrid data={heatmap} />
      </motion.div>
    </div>
  )
}
