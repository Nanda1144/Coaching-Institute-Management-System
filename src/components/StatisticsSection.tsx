import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { MdErrorOutline, MdRefresh } from 'react-icons/md'
import { useFacultyListShared, useAttendanceStatsShared } from '../hooks/useSharedData'
import type { Faculty } from '../features/faculty/types/faculty.types'

interface AttendanceStat {
  month: string
  rate: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-lg border border-white/30 text-sm">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const DISTRIBUTION_COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6']

function ChartError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-2">
        <MdErrorOutline className="text-red-500 text-lg" />
      </div>
      <p className="text-xs text-gray-500 mb-2">{message || 'Failed to load chart data'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors"
        >
          <MdRefresh className="text-xs" />
          Retry
        </button>
      )}
    </div>
  )
}

export default function StatisticsSection() {
  const { data: facultyList, isLoading: facultyLoading, isError: facultyError, error: facultyErr, refetch: refetchFaculty } = useFacultyListShared();
  const { data: attendanceResult, isLoading: attendanceLoading, isError: attendanceError, error: attendanceErr, refetch: refetchAttendance } = useAttendanceStatsShared();

  const loading = facultyLoading || attendanceLoading;

  const facultySafe = useMemo(() => Array.isArray(facultyList) ? facultyList : [], [facultyList]);

  const facultyByDept = useMemo(() => {
    if (!facultySafe.length) return [];
    const deptMap: Record<string, number> = {};
    facultySafe.forEach((f: Faculty) => {
      const dept = f.department || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    return Object.entries(deptMap).map(([department, count]) => ({ department, count }));
  }, [facultySafe]);

  const distribution = useMemo(() => {
    if (!facultySafe.length) return [];
    let activeCount = 0;
    let otherCount = 0;
    facultySafe.forEach((f: Faculty) => {
      if (f.status === 'Active') activeCount++;
      else otherCount++;
    });
    return [
      { name: 'Active', value: activeCount, color: DISTRIBUTION_COLORS[0] },
      { name: 'Other', value: otherCount, color: DISTRIBUTION_COLORS[1] },
    ];
  }, [facultyList]);

  const attendanceData = useMemo(() => {
    const raw = attendanceResult as any;
    const items = (
      Array.isArray(raw) ? raw :
      Array.isArray(raw?.data) ? raw.data :
      Array.isArray(raw?.data?.byMonth) ? raw.data.byMonth.map((m: any) => ({ month: `${m.month}/${m.year}`, rate: m.percentage })) :
      []
    ) as AttendanceStat[];
    return items;
  }, [attendanceResult]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
            <div className="h-60 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Faculty by Department</h3>
        {facultyError ? (
          <ChartError message={facultyErr instanceof Error ? facultyErr.message : undefined} onRetry={() => refetchFaculty()} />
        ) : facultyByDept.length === 0 ? (
          <div className="flex items-center justify-center h-60 text-sm text-gray-400">No faculty data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facultyByDept} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Attendance Overview</h3>
        {attendanceError ? (
          <ChartError message={attendanceErr instanceof Error ? attendanceErr.message : undefined} onRetry={() => refetchAttendance()} />
        ) : attendanceData.length === 0 ? (
          <div className="flex items-center justify-center h-60 text-sm text-gray-400">No attendance data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={attendanceData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} domain={[70, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#0ea5e9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-5"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Faculty Distribution</h3>
        {facultyError ? (
          <ChartError message={facultyErr instanceof Error ? facultyErr.message : undefined} onRetry={() => refetchFaculty()} />
        ) : distribution.length === 0 || distribution.every(d => d.value === 0) ? (
          <div className="flex items-center justify-center h-60 text-sm text-gray-400">No faculty data</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {distribution.filter(d => d.value > 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  )
}
