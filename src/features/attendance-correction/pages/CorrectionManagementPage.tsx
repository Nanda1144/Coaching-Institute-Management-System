import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MdEditNote } from 'react-icons/md'
import CorrectionForm from '../components/CorrectionForm'
import CorrectionFilters from '../components/CorrectionFilters'
import CorrectionTable from '../components/CorrectionTable'
import { ViewCorrectionModal, ApproveRejectModal } from '../components/CorrectionModals'
import Toast from '../../../components/Toast'
import { dummyRequests, initialFilters } from '../data/attendanceCorrectionData'
import type { CorrectionRequest, CorrectionFilters as Filters, RequestFormData } from '../types/attendanceCorrection.types'

export default function CorrectionManagementPage() {
  const [requests, setRequests] = useState<CorrectionRequest[]>(dummyRequests)
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [viewReq, setViewReq] = useState<CorrectionRequest | null>(null)
  const [approveRejectReq, setApproveRejectReq] = useState<CorrectionRequest | null>(null)
  const [approveRejectType, setApproveRejectType] = useState<'approve' | 'reject'>('approve')
  const [toast, setToast] = useState<{ message: string } | null>(null)

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const handleSubmit = useCallback((data: RequestFormData) => {
    const newReq: CorrectionRequest = {
      id: `CR-${String(requests.length + 1).padStart(3, '0')}`,
      ...data,
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
    }
    setRequests((prev) => [newReq, ...prev])
    setToast({ message: 'Correction request submitted successfully' })
  }, [requests.length])

  const handleApprove = useCallback((req: CorrectionRequest) => {
    setApproveRejectReq(req)
    setApproveRejectType('approve')
  }, [])

  const handleReject = useCallback((req: CorrectionRequest) => {
    setApproveRejectReq(req)
    setApproveRejectType('reject')
  }, [])

  const handleConfirm = useCallback((id: string, remarks: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, approvalStatus: approveRejectType === 'approve' ? 'approved' : 'rejected', reviewedBy: 'Dr. Rajesh Kumar', reviewedAt: new Date().toISOString(), remarks }
          : r
      )
    )
    setApproveRejectReq(null)
    setToast({ message: `Request ${approveRejectType === 'approve' ? 'approved' : 'rejected'} successfully` })
  }, [approveRejectType])

  const filtered = useMemo(() => {
    let result = [...requests]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((r) =>
        r.id.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q) || r.rollNumber.toLowerCase().includes(q)
      )
    }
    if (filters.department) result = result.filter((r) => r.department === filters.department)
    if (filters.status) result = result.filter((r) => r.approvalStatus === filters.status)
    if (filters.date) result = result.filter((r) => r.attendanceDate === filters.date)
    return result
  }, [requests, filters])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Correction</h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit and manage attendance correction requests.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl border border-white/30">
          <MdEditNote className="text-primary" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CorrectionForm onSubmit={handleSubmit} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <CorrectionFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
          <CorrectionTable
            requests={filtered}
            onView={setViewReq}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      <ViewCorrectionModal request={viewReq} onClose={() => setViewReq(null)} />
      <ApproveRejectModal
        request={approveRejectReq}
        type={approveRejectType}
        onClose={() => setApproveRejectReq(null)}
        onConfirm={handleConfirm}
      />

      {toast && (
        <Toast message={toast.message} isVisible={true} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
