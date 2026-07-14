import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Line, AreaChart, Area,
} from 'recharts'
import type { TrendPoint, DepartmentComparison } from '../types/attendanceReports.types'

interface ReportChartsProps {
  trends: TrendPoint[]
  departmentData: DepartmentComparison[]
  loading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-white/30 text-sm">
        <p className="font-medium text-gray-800 mb-1.5">{label}</p>
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

export default function ReportCharts({ trends, departmentData, loading }: ReportChartsProps) {
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

  const stackedBars = [
    { dataKey: 'present', fill: '#10b981', name: 'Present' },
    { dataKey: 'absent', fill: '#ef4444', name: 'Absent' },
    { dataKey: 'late', fill: '#f59e0b', name: 'Late' },
    { dataKey: 'leave', fill: '#3b82f6', name: 'Leave' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trends} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            {stackedBars.map((bar) => (
              <Bar key={bar.dataKey} dataKey={bar.dataKey} stackId="a" fill={bar.fill} name={bar.name} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Present Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trends} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#presentGrad)" strokeWidth={2} name="Present" />
            <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Absent" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Late" strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Department Comparison</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} />
            <YAxis type="category" dataKey="department" tick={{ fontSize: 10, fill: '#6b7280' }} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" fill="#3b82f6" name="Percentage" radius={[0, 4, 4, 0]}>
              {departmentData.map((_, index) => (
                <Cell key={index} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Summary Breakdown</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trends} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="present" fill="#10b981" name="Present" radius={[2, 2, 0, 0]} />
            <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[2, 2, 0, 0]} />
            <Bar dataKey="late" fill="#f59e0b" name="Late" radius={[2, 2, 0, 0]} />
            <Bar dataKey="leave" fill="#3b82f6" name="Leave" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
