import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdPerson, MdErrorOutline, MdDownload, MdBarChart } from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import evaluationService from '../services/evaluation/evaluation.service'
import facultyService from '../services/faculty/faculty.service'
import LoadingSpinner from '../components/LoadingSpinner'


interface MarkEntry {
  id: string
  submissionId: string
  facultyId: string
  marksObtained: number
  totalMarks: number
  grade: string
  feedback: string
  status: string
  evaluationDate: string
  createdAt: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

const statusOptions = ['', 'draft', 'published', 'under_review', 'revised']

function gradeBadge(percentage: number) {
  if (percentage >= 90) return 'badge-success'
  if (percentage >= 75) return 'badge-info'
  if (percentage >= 60) return 'badge-warning'
  return 'badge-danger'
}

function getGrade(percentage: number) {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C'
  return 'D'
}

function downloadCSV(entries: MarkEntry[]) {
  const headers = ['ID', 'Marks Obtained', 'Total Marks', 'Grade', 'Status', 'Feedback', 'Date']
  const rows = entries.map((e) => [
    e.id,
    e.marksObtained,
    e.totalMarks,
    e.grade,
    e.status,
    `"${(e.feedback || '').replace(/"/g, '""')}"`,
    new Date(e.evaluationDate || e.createdAt).toLocaleDateString(),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `evaluations-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function FacultyMarksPage() {
  const [entries, setEntries] = useState<MarkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        let facultyId = ''
        try {
          const profileRes = await facultyService.getProfile()
          const raw = profileRes?.data || profileRes
          facultyId = raw?.facultyId || raw?.id || ''
        } catch { /* ignore */ }

        if (facultyId) {
          const res = await evaluationService.getByFaculty(facultyId)
          const items = (res as any)?.data || res || []
          setEntries(Array.isArray(items) ? items : [])
        } else {
          const res = await evaluationService.getAll({ limit: 200 })
          const items = (res as any)?.data?.data || (res as any)?.data || res || []
          setEntries(Array.isArray(items) ? items : [])
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load evaluations')
        setEntries([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    let result = entries
    if (statusFilter) result = result.filter((e) => e.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((e) => e.grade?.toLowerCase().includes(q) || e.feedback?.toLowerCase().includes(q) || e.id?.toLowerCase().includes(q))
    }
    return result
  }, [entries, statusFilter, search])

  const chartData = useMemo(() => {
    const bins: Record<string, number> = { '0-49': 0, '50-59': 0, '60-69': 0, '70-79': 0, '80-89': 0, '90-100': 0 }
    for (const e of entries) {
      const pct = e.totalMarks > 0 ? (e.marksObtained / e.totalMarks) * 100 : 0
      if (pct < 50) bins['0-49']++
      else if (pct < 60) bins['50-59']++
      else if (pct < 70) bins['60-69']++
      else if (pct < 80) bins['70-79']++
      else if (pct < 90) bins['80-89']++
      else bins['90-100']++
    }
    return Object.entries(bins).map(([range, count]) => ({ range, count }))
  }, [entries])

  if (loading) return <LoadingSpinner text="Loading evaluations..." />

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="card p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-50 flex items-center justify-center">
            <MdErrorOutline className="text-danger" size={28} />
          </div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">Failed to load evaluations</h2>
          <p className="text-sm text-neutral-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Marks & Results</h1>
            <p className="text-neutral-500 text-sm mt-1">View submitted evaluations and marks analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowChart(!showChart)} className="btn btn-secondary">
              <MdBarChart size={18} /> {showChart ? 'Hide Chart' : 'Analytics'}
            </button>
            <button onClick={() => downloadCSV(filtered)} className="btn btn-secondary">
              <MdDownload size={18} /> CSV
            </button>
          </div>
        </motion.div>

        {showChart && chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="card p-6 overflow-hidden"
          >
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Marks Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="input-group">
              <label>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-field">
                <option value="">All Statuses</option>
                {statusOptions.filter(Boolean).map((s) => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Search</label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input type="text" placeholder="Search grade, feedback..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
              </div>
            </div>
            <div className="input-group flex items-end">
              <p className="text-xs text-neutral-400">{filtered.length} of {entries.length} evaluation(s)</p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MdPerson size={28} /></div>
              <h3>No evaluations found</h3>
              <p>{search || statusFilter ? 'Try different filters' : 'No evaluations have been submitted yet'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className="text-center">Marks</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">%</th>
                    <th className="text-center">Grade</th>
                    <th>Status</th>
                    <th>Feedback</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const pct = entry.totalMarks > 0 ? Math.round((entry.marksObtained / entry.totalMarks) * 100) : 0
                    return (
                      <tr key={entry.id}>
                        <td className="text-xs font-mono text-neutral-500">{entry.id.slice(0, 8)}...</td>
                        <td className="text-center font-semibold text-neutral-800">{entry.marksObtained}</td>
                        <td className="text-center text-neutral-600">{entry.totalMarks}</td>
                        <td className="text-center">
                          <span className={`badge ${gradeBadge(pct)}`}>{pct}%</span>
                        </td>
                        <td className="text-center font-semibold">{entry.grade || getGrade(pct)}</td>
                        <td>
                          <span className={`badge ${entry.status === 'published' ? 'badge-success' : entry.status === 'draft' ? 'badge-warning' : 'badge-info'}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="max-w-[200px] truncate text-neutral-600 text-sm">{entry.feedback || '—'}</td>
                        <td className="text-sm text-neutral-500 whitespace-nowrap">{new Date(entry.evaluationDate || entry.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
