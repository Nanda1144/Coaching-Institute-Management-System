import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdSave, MdSearch, MdPerson, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import evaluationService from '../services/evaluation/evaluation.service'

interface MarkEntry {
  id: string
  studentName: string
  rollNumber: string
  marksObtained: number
  totalMarks: number
  grade: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function FacultyMarksPage() {
  const [subject, setSubject] = useState('')
  const [examType, setExamType] = useState('midterm')
  const [entries, setEntries] = useState<MarkEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['faculty-marks', subject, examType],
    queryFn: () => evaluationService.getAll({ subject, examType }),
    enabled: !!subject,
  })

  useEffect(() => {
    if (data?.data) {
      setEntries(data.data)
    }
  }, [data])

  const handleMarksChange = (id: string, value: number) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, marksObtained: Math.min(value, e.totalMarks) } : e))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await evaluationService.create({ subject, examType, marks: entries })
    } catch {
      // Handle save error
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const filtered = entries.filter((e) => !search || e.studentName.toLowerCase().includes(search.toLowerCase()) || e.rollNumber.toLowerCase().includes(search.toLowerCase()))

  const gradeBadge = (marks: number) => {
    if (marks >= 90) return 'badge-success'
    if (marks >= 75) return 'badge-info'
    if (marks >= 60) return 'badge-warning'
    return 'badge-danger'
  }

  const gradeText = (marks: number) => {
    if (marks >= 90) return 'A+'
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B+'
    if (marks >= 60) return 'B'
    if (marks >= 50) return 'C'
    return 'D'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Marks & Results</h1>
            <p className="text-neutral-500 text-sm mt-1">Enter and manage student marks</p>
          </div>
          <button onClick={handleSave} disabled={saving || !subject} className="btn btn-primary">
            <MdSave size={18} />{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Marks'}
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="input-group">
              <label>Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="select-field">
                <option value="">Select subject</option>
                <option value="DS">Data Structures</option>
                <option value="OS">Operating Systems</option>
                <option value="CN">Computer Networks</option>
                <option value="DBMS">Database Management</option>
              </select>
            </div>
            <div className="input-group">
              <label>Exam Type</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value)} className="select-field">
                <option value="midterm">Mid Term</option>
                <option value="final">Final Exam</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div className="input-group">
              <label>Search Student</label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
              </div>
            </div>
          </div>

          {!subject ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MdPerson size={28} /></div>
              <h3>Select a subject</h3>
              <p>Select a subject to load students</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <div className="w-8 h-8 rounded-full skeleton" />
                  <div className="h-4 skeleton rounded w-1/4" />
                  <div className="h-4 skeleton rounded w-16 ml-auto" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
              <h3>Failed to load students</h3>
              <p>Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Roll No</th>
                      <th className="text-center">Marks Obtained</th>
                      <th className="text-center">Total Marks</th>
                      <th className="text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary-50 flex items-center justify-center"><MdPerson className="text-primary" size={16} /></div>
                            <span className="font-medium text-neutral-800">{entry.studentName}</span>
                          </div>
                        </td>
                        <td className="text-neutral-600">{entry.rollNumber}</td>
                        <td className="text-center">
                          <input type="number" min={0} max={entry.totalMarks} value={entry.marksObtained} onChange={(e) => handleMarksChange(entry.id, parseInt(e.target.value) || 0)} className="input-field w-24 mx-auto text-center" />
                        </td>
                        <td className="text-center text-neutral-600">{entry.totalMarks}</td>
                        <td className="text-center">
                          <span className={`badge ${gradeBadge(entry.marksObtained)}`}>{gradeText(entry.marksObtained)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-neutral-400 mt-3">{filtered.length} student(s)</p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
