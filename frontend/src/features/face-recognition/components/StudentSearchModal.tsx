import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSearch, MdClose, MdPerson, MdSchool } from 'react-icons/md'
import studentService from '../../../services/student/student.service'

interface Student {
  id: string
  fullName: string
  rollNumber: string
  department: string
  batch: string
  profileImage?: string
}

interface StudentSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (student: Student) => void
}

export default function StudentSearchModal({ isOpen, onClose, onSelect }: StudentSearchModalProps) {
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchStudents = useCallback(async (pageNum: number, searchTerm: string, append: boolean) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true)
      const params: Record<string, unknown> = { page: pageNum, limit: 20 }
      if (searchTerm.trim()) params.search = searchTerm.trim()
      const res = await studentService.getAll(params)
      const data = res?.data ?? res ?? []
      const items = Array.isArray(data) ? data : (data.data ?? data.records ?? [])
      if (append) {
        setStudents(prev => [...prev, ...items])
      } else {
        setStudents(items)
      }
      setHasMore(items.length === 20)
    } catch {
      if (!append) setStudents([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setPage(1)
      fetchStudents(1, '', false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, fetchStudents])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchStudents(1, search, false)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchStudents])

  const handleScroll = useCallback(() => {
    if (!listRef.current || loadingMore || !hasMore) return
    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollHeight - scrollTop - clientHeight < 60) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchStudents(nextPage, search, true)
    }
  }, [page, search, hasMore, loadingMore, fetchStudents])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MdPerson className="text-primary text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Identify Student</h3>
                  <p className="text-[10px] text-gray-500">Search and select the student to mark attendance</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MdClose />
              </motion.button>
            </div>

            <div className="p-5">
              <div className="relative mb-4">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search by name or roll number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div
                ref={listRef}
                onScroll={handleScroll}
                className="max-h-72 overflow-y-auto space-y-1.5 -mx-1 px-1"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8">
                    <MdPerson className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No students found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  students.map((student) => (
                    <motion.button
                      key={student.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelect(student)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-3 group border border-transparent hover:border-primary/20"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 border border-white/50">
                        <span className="text-sm font-bold text-primary">
                          {student.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
                          {student.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-mono">{student.rollNumber}</span>
                          <span className="text-[10px] text-gray-400">•</span>
                          <MdSchool className="text-gray-400 text-[10px]" />
                          <span className="text-xs text-gray-500 truncate">{student.department}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-primary transition-colors shrink-0">
                        Select →
                      </div>
                    </motion.button>
                  ))
                )}
                {loadingMore && (
                  <div className="flex items-center justify-center py-3">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}