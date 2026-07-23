import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdPerson, MdRefresh, MdCheckCircle, MdErrorOutline, MdBlock, MdVisibility } from 'react-icons/md'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { useToast } from '../contexts/ToastContext'

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  HOLD: 'badge-info',
  REJECTED: 'badge-danger',
}

export default function RegistrationRequestsPage() {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusAction, setStatusAction] = useState<'APPROVED' | 'HOLD' | 'REJECTED' | null>(null)
  const [remarks, setRemarks] = useState('')
  const [batchInput, setBatchInput] = useState('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['registration-requests'],
    queryFn: () => api.get('/faculty/registration-requests'),
  })

  const { data: batchesData } = useQuery({
    queryKey: ['batches-for-approval'],
    queryFn: () => api.get('/references/batches'),
    enabled: statusAction === 'APPROVED',
  })

  const batches = batchesData?.data || []

  const reviewMutation = useMutation({
    mutationFn: ({ id, status, remarks: r, batch }: { id: string; status: string; remarks?: string; batch?: string }) =>
      api.patch(`/faculty/registration-requests/${id}`, { status, remarks: r, batch }),
    onSuccess: () => {
      showSuccess('Registration request updated successfully')
      queryClient.invalidateQueries({ queryKey: ['registration-requests'] })
      setSelectedId(null)
      setStatusAction(null)
      setRemarks('')
      setBatchInput('')
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to update registration request'
      showError(message)
    },
  })

  const requests = data?.data || []

  const isRemarksRequired = statusAction === 'REJECTED' || statusAction === 'HOLD'

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {[...Array(4)].map((_, i) => <div key={'sk' + i} className="h-24 skeleton rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="empty-state card">
          <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
          <h3>Failed to load registration requests</h3>
          <p className="text-neutral-500">Please try again later.</p>
          <button onClick={() => refetch()} className="btn btn-primary mt-4 flex items-center gap-2"><MdRefresh /> Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="gradient-text text-3xl font-bold tracking-tight">Registration Requests</h1>
        <p className="text-neutral-500 text-sm mt-1">Review and manage student registration requests.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {requests.length === 0 ? (
            <div className="card p-8 text-center">
              <MdPerson size={40} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500">No registration requests</p>
            </div>
          ) : (
            requests.map((req: any, i: number) => {
              const isSelected = selectedId === req.id
              const docs = (() => { try { return JSON.parse(req.documents || '[]') } catch { return [] } })()
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500/30 border-primary-400' : ''}`}
                  onClick={() => setSelectedId(isSelected ? null : req.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                        <MdPerson className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{req.fullName}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{req.email} · {req.department}</p>
                        <span className={`badge ${STATUS_BADGE[req.status] || 'badge-default'} mt-1.5 inline-block`}>{req.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedId(isSelected ? null : req.id) }} className="btn btn-ghost btn-sm"><MdVisibility size={16} /></button>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div><span className="text-neutral-400">Course:</span> <span className="font-medium">{req.course || 'N/A'}</span></div>
                        <div><span className="text-neutral-400">Phone:</span> <span className="font-medium">{req.phone || 'N/A'}</span></div>
                        <div><span className="text-neutral-400">Batch:</span> <span className="font-medium">{req.batch || 'N/A'}</span></div>
                        <div><span className="text-neutral-400">Semester:</span> <span className="font-medium">{req.semester || 'N/A'}</span></div>
                        <div><span className="text-neutral-400">Submitted:</span> <span className="font-medium">{new Date(req.createdAt).toLocaleDateString()}</span></div>
                        {req.parentName && <div><span className="text-neutral-400">Parent:</span> <span className="font-medium">{req.parentName}</span></div>}
                      </div>

                      {docs.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-neutral-500 mb-1">Documents ({docs.length})</p>
                          <div className="flex gap-2 flex-wrap">
                            {docs.map((d: any, di: number) => (
                              <span key={di} className="badge badge-default text-xs">{d.name || `Document ${di + 1}`}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {req.remarks && (
                        <div className="p-3 rounded-lg bg-neutral-50 text-xs text-neutral-600">
                          <span className="font-medium text-neutral-700">Remarks:</span> {req.remarks}
                        </div>
                      )}

                      {req.status === 'PENDING' && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setStatusAction('APPROVED'); setBatchInput(req.batch || '') }}
                              className="btn btn-sm btn-success"
                            ><MdCheckCircle /> Accept</button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setStatusAction('HOLD') }}
                              className="btn btn-sm btn-info"
                            ><MdBlock /> Hold</button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setStatusAction('REJECTED') }}
                              className="btn btn-sm btn-danger"
                            ><MdErrorOutline /> Reject</button>
                          </div>

                          {statusAction && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="text-sm font-medium text-neutral-700">
                                {statusAction === 'APPROVED' ? 'Approve Registration' : statusAction === 'HOLD' ? 'Put on Hold' : 'Reject Registration'}
                              </p>

                              {statusAction === 'APPROVED' && (
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-neutral-500">Batch Assignment</label>
                                  <select
                                    value={batchInput}
                                    onChange={(e) => setBatchInput(e.target.value)}
                                    className="input-field text-sm"
                                  >
                                    <option value="">Select a batch</option>
                                    {batches.map((b: any) => (
                                      <option key={b.id} value={b.batchName || b.name}>{b.batchName || b.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-500">
                                  Remarks {isRemarksRequired ? '(required)' : '(optional)'}
                                </label>
                                <textarea
                                  placeholder={isRemarksRequired ? 'Remarks are required for hold/reject' : 'Add remarks (optional)'}
                                  value={remarks}
                                  onChange={(e) => setRemarks(e.target.value)}
                                  className="input-field text-sm"
                                  rows={2}
                                />
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (isRemarksRequired && !remarks.trim()) return
                                    reviewMutation.mutate({
                                      id: req.id,
                                      status: statusAction,
                                      remarks,
                                      batch: statusAction === 'APPROVED' ? batchInput : undefined,
                                    })
                                  }}
                                  disabled={reviewMutation.isPending || (isRemarksRequired && !remarks.trim())}
                                  className={`btn btn-sm ${statusAction === 'APPROVED' ? 'btn-success' : statusAction === 'HOLD' ? 'btn-info' : 'btn-danger'}`}
                                >
                                  {reviewMutation.isPending ? 'Processing...' : `Confirm ${statusAction}`}
                                </button>
                                <button
                                  onClick={() => { setStatusAction(null); setRemarks(''); setBatchInput('') }}
                                  className="btn btn-sm btn-ghost"
                                >Cancel</button>
                              </div>

                              {isRemarksRequired && !remarks.trim() && (
                                <p className="text-xs text-danger">Remarks are required for {statusAction.toLowerCase()}</p>
                              )}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        <div className="card p-5 h-fit">
          <h3 className="text-sm font-semibold text-neutral-800 mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-neutral-500">Total</span><span className="font-medium">{requests.length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Pending</span><span className="font-medium text-amber-600">{requests.filter((r: any) => r.status === 'PENDING').length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Approved</span><span className="font-medium text-emerald-600">{requests.filter((r: any) => r.status === 'APPROVED').length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Hold</span><span className="font-medium text-blue-600">{requests.filter((r: any) => r.status === 'HOLD').length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-500">Rejected</span><span className="font-medium text-red-600">{requests.filter((r: any) => r.status === 'REJECTED').length}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
