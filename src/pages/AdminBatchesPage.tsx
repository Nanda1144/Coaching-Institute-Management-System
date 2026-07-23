import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdGroup, MdAdd, MdEdit, MdDelete, MdPerson, MdSchool, MdPeople, MdSchedule, MdViewModule, MdTableView, MdClose } from 'react-icons/md'
import { useBatchList, useCreateBatch, useUpdateBatch, useDeleteBatch } from '../hooks/useReactQuery'
import { useToast } from '../contexts/ToastContext'
import SearchBar from '../features/batch-management/components/SearchBar'
import FilterPanel from '../features/batch-management/components/FilterPanel'
import BatchTable from '../features/batch-management/components/BatchTable'
import Pagination from '../features/batch-management/components/Pagination'
import StatusBadge from '../features/batch-management/components/StatusBadge'
import EmptyState from '../features/batch-management/components/EmptyState'
import LoadingState from '../features/batch-management/components/LoadingState'
import BatchForm from '../features/batch-management/components/BatchForm'
import useBatchFilters from '../features/batch-management/hooks/useBatchFilters'
import type { Batch, ViewMode } from '../features/batch-management/types/batch.types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function AdminBatchesPage() {
  const { showInfo, showSuccess, showError } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  const { data: batches, isLoading, isError, error, refetch } = useBatchList()
  const createBatch = useCreateBatch()
  const updateBatch = useUpdateBatch()
  const deleteBatch = useDeleteBatch()

  const batchList: Batch[] = useMemo(() => {
    const list = Array.isArray(batches) ? batches : []
    return list.map((b: any) => ({
      id: b.id,
      name: b.name || b.batchName || '',
      batchName: b.batchName || b.name || '',
      course: b.course || b.department || '',
      faculty: b.faculty || '',
      schedule: b.schedule || b.batchTiming || '',
      classroom: b.classroom || '',
      students: b.studentCount || b.students || 0,
      status: b.status || 'Active',
      batchCode: b.batchCode || '',
      department: b.department || '',
      year: b.year || '',
      studentCount: b.studentCount || 0,
      facultyCount: b.facultyCount || 0,
    }))
  }, [batches])

  const {
    search, setSearch,
    courseFilter, setCourseFilter,
    facultyFilter, setFacultyFilter,
    statusFilter, setStatusFilter,
    scheduleFilter, setScheduleFilter,
    currentPage, setCurrentPage,
    rowsPerPage, handleRowsPerPageChange,
    filteredItems: filteredBatches,
    paginatedItems: paginatedBatches,
    pageCount, clearFilters,
  } = useBatchFilters(batchList)

  const totalStudents = batchList.reduce((s, b) => s + (b.studentCount || 0), 0)
  const totalFaculty = batchList.reduce((s, b) => s + (b.facultyCount || 0), 0)

  const courseOptions = useMemo(() => [...new Set(batchList.map((b) => b.course))].filter(Boolean), [batchList])
  const facultyOptions = useMemo(() => [...new Set(batchList.map((b) => b.faculty))].filter(Boolean), [batchList])
  const statusOptions = useMemo(() => [...new Set(batchList.map((b) => b.status))].filter(Boolean), [batchList])
  const scheduleOptions = useMemo(() => [...new Set(batchList.map((b) => b.schedule))].filter(Boolean), [batchList])

  const handleCreate = useCallback((newBatch: any) => {
    createBatch.mutate(newBatch, {
      onSuccess: () => {
        showSuccess('Batch created successfully')
        setShowCreate(false)
      },
      onError: (err: any) => showError(err?.message || 'Failed to create batch'),
    })
  }, [createBatch, showSuccess, showError])

  const handleEdit = useCallback((b: Batch) => {
    setEditingId(b.id)
    setEditData({ name: b.name, department: b.course, year: b.year || '', schedule: b.schedule })
  }, [])

  const handleSaveEdit = useCallback((id: string) => {
    updateBatch.mutate({ id, data: editData }, {
      onSuccess: () => {
        showSuccess('Batch updated successfully')
        setEditingId(null)
        setEditData({})
      },
      onError: (err: any) => showError(err?.message || 'Failed to update batch'),
    })
  }, [updateBatch, editData, showSuccess, showError])

  const handleDelete = useCallback((idOrBatch: string | Batch) => {
    const id = typeof idOrBatch === 'string' ? idOrBatch : idOrBatch.id
    if (!window.confirm('Are you sure you want to delete this batch?')) return
    deleteBatch.mutate(id, {
      onSuccess: () => showSuccess('Batch deleted successfully'),
      onError: (err: any) => showError(err?.message || 'Failed to delete batch'),
    })
  }, [deleteBatch, showSuccess, showError])

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-9 w-64 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
          <div className="skeleton h-10 w-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={'sk' + i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <LoadingState />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading batches</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load batches'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="page-header"
      >
        <div>
          <h1 className="gradient-text">Batch Management</h1>
          <p>{filteredBatches.length} of {batchList.length} batches</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5">
            <button
              className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setViewMode('card')}
              title="Card view"
            >
              <MdViewModule size={18} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <MdTableView size={18} />
            </button>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
            <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Create Batch'}
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdGroup size={24} /></div>
          <div className="stat-value">{batchList.length}</div>
          <div className="stat-label">Total Batches</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdPeople size={24} /></div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Total Students</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-info-light text-info"><MdSchool size={24} /></div>
          <div className="stat-value">{totalFaculty}</div>
          <div className="stat-label">Total Faculty</div>
        </motion.div>
      </motion.div>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                <MdGroup className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-800">Create New Batch</h3>
                <p className="text-xs text-neutral-500">Set up a new batch with course details</p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowCreate(false)}>
              <MdClose size={18} />
            </button>
          </div>
          <BatchForm onBatchCreated={handleCreate} onCancel={() => setShowCreate(false)} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="card p-5"
      >
        <div className="flex items-center gap-4 mb-1 flex-wrap">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <FilterPanel
          courseFilter={courseFilter} setCourseFilter={setCourseFilter}
          facultyFilter={facultyFilter} setFacultyFilter={setFacultyFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          scheduleFilter={scheduleFilter} setScheduleFilter={setScheduleFilter}
          clearFilters={clearFilters}
          courseOptions={courseOptions} facultyOptions={facultyOptions}
          statusOptions={statusOptions} scheduleOptions={scheduleOptions}
        />

        {filteredBatches.length === 0 ? (
          <EmptyState hasFilters={!!(search || courseFilter || facultyFilter || statusFilter || scheduleFilter)} />
        ) : viewMode === 'table' ? (
          <>
            <BatchTable
              batches={paginatedBatches}
              onView={(b) => showInfo(`Batch: ${b.name}`)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <Pagination
              currentPage={currentPage} pageCount={pageCount}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}
              totalItems={filteredBatches.length}
            />
          </>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {paginatedBatches.map((b: Batch) => (
                <motion.div
                  key={b.id}
                  variants={itemVariants}
                  className="card p-5 hover:border-primary-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <MdGroup className="text-primary" size={22} />
                      </div>
                      <div>
                        {editingId === b.id ? (
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="input-field !py-1 !text-sm"
                          />
                        ) : (
                          <>
                            <h3 className="font-semibold text-neutral-800 text-sm">{b.name}</h3>
                            <p className="text-xs text-neutral-400">{b.course}{b.year ? ` • ${b.year}` : ''}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {editingId === b.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(b.id)} className="btn btn-primary btn-sm">Save</button>
                          <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(b)}
                            className="btn btn-ghost btn-sm !px-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <MdEdit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light"
                          >
                            <MdDelete size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <StatusBadge status={b.status} />
                  </div>

                  <div className="flex items-center gap-4 pb-4 mb-4 border-b border-neutral-100 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <MdPerson size={15} className="text-neutral-400" /> {b.studentCount || b.students} Students
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MdSchool size={15} className="text-neutral-400" /> {b.facultyCount} Faculty
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                    <MdSchedule size={14} className="text-neutral-300" />
                    <span>{b.schedule}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm flex-1" onClick={() => showInfo('Assign Students feature coming soon')}>
                      Assign Students
                    </button>
                    <button className="btn btn-secondary btn-sm flex-1" onClick={() => showInfo('Assign Faculty feature coming soon')}>
                      Assign Faculty
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <Pagination
              currentPage={currentPage} pageCount={pageCount}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange}
              totalItems={filteredBatches.length}
            />
          </>
        )}
      </motion.div>
    </div>
  )
}
