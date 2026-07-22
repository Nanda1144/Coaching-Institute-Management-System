import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdLibraryBooks, MdSearch, MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

interface Course {
  id: string
  name: string
  code: string
  duration?: string
  department?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState({ name: '', code: '', duration: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/references/courses')
      setCourses(res.data?.data || [])
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        setError(err?.response?.data?.message || 'Failed to load courses')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', code: '', duration: '' })
    setShowModal(true)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    setForm({ name: course.name, code: course.code, duration: course.duration || '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/references/courses/${editing.id}`, form)
      } else {
        await api.post('/references/courses', form)
      }
      setShowModal(false)
      load()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await api.delete(`/references/courses/${id}`)
      load()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete course')
    }
  }

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner text="Loading courses..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="gradient-text text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-neutral-500 text-sm mt-1">Manage all academic courses</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <MdAdd size={18} /> Add Course
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="input-field pl-10" />
        </motion.div>

        {error && (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon bg-danger-light flex items-center justify-center">
              <span className="text-danger text-xl font-bold">!</span>
            </div>
            <h3>{error}</h3>
            <button onClick={load} className="btn btn-primary">Retry</button>
          </motion.div>
        )}

        {!error && filtered.length === 0 && (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdLibraryBooks size={28} /></div>
            <h3>{search ? 'No courses match your search' : 'No courses found'}</h3>
          </motion.div>
        )}

        {!error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((course) => (
              <motion.div key={course.id} variants={itemVariants} className="card p-6 hover:shadow-card-hover group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                    <MdLibraryBooks className="text-white" size={20} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(course)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-blue-500"><MdEdit size={16} /></button>
                    <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-red-500"><MdDelete size={16} /></button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-neutral-800 mb-1">{course.name}</h3>
                <p className="text-xs font-mono text-neutral-400 uppercase mb-3">{course.code}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  {course.department && <span>{course.department}</span>}
                  {course.duration && <span>{course.duration}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-neutral-800">{editing ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-neutral-100"><MdClose size={20} className="text-neutral-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="input-group">
                <label>Course Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Bachelor of Technology" />
              </div>
              <div className="input-group">
                <label>Course Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="e.g. B.TECH" />
              </div>

              <div className="input-group">
                <label>Duration (years)</label>
                <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" placeholder="e.g. 4" min="1" max="10" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleSave} disabled={!form.name.trim() || !form.code.trim() || saving} className="btn btn-primary">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}