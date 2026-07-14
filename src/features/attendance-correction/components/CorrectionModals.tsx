import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdVisibility, MdCheckCircle, MdCancel, MdBadge, MdSchool, MdBook, MdDateRange, MdAccessTime } from 'react-icons/md'
import type { CorrectionRequest } from '../types/attendanceCorrection.types'

interface ViewModalProps {
  request: CorrectionRequest | null
  onClose: () => void
}

export function ViewCorrectionModal({ request, onClose }: ViewModalProps) {
  if (!request) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl w-full max-w-lg overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <MdVisibility className="text-primary text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Correction Details</h3>
                <p className="text-[10px] text-gray-500">{request.id}</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <MdClose />
            </motion.button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-base font-bold text-primary">
                  {request.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">{request.studentName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MdBadge className="text-gray-400 text-xs" />
                  <span className="text-xs text-gray-500">{request.rollNumber}</span>
                </div>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  request.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-600' :
                  request.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {request.approvalStatus.charAt(0).toUpperCase() + request.approvalStatus.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MdSchool, label: 'Department', value: request.department },
                { icon: MdBook, label: 'Subject', value: request.subject },
                { icon: MdDateRange, label: 'Attendance Date', value: request.attendanceDate },
                { icon: MdAccessTime, label: 'Submitted', value: new Date(request.createdAt).toLocaleDateString() },
              ].map((f) => (
                <div key={f.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <f.icon className="text-gray-400 text-xs" />
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{f.label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{f.value}</p>
                </div>
              ))}
              <div className="bg-gray-50 rounded-xl p-3">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Current Status</span>
                <span className="text-sm font-medium capitalize text-red-600">{request.currentStatus}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Requested Status</span>
                <span className="text-sm font-medium capitalize text-emerald-600">{request.requestedStatus}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Reason</span>
              <p className="text-sm text-gray-700">{request.reason}</p>
            </div>

            {request.attachment && (
              <div className="bg-gray-50 rounded-xl p-3">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Attachment</span>
                <p className="text-sm font-medium text-primary">{request.attachment}</p>
              </div>
            )}

            {request.reviewedBy && (
              <div className="bg-gray-50 rounded-xl p-3">
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block mb-1">Review</span>
                <p className="text-sm text-gray-700">Reviewed by <span className="font-medium">{request.reviewedBy}</span></p>
                {request.remarks && <p className="text-xs text-gray-500 mt-0.5">Remarks: {request.remarks}</p>}
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

interface ApproveRejectModalProps {
  request: CorrectionRequest | null
  type: 'approve' | 'reject'
  onClose: () => void
  onConfirm: (id: string, remarks: string) => void
}

export function ApproveRejectModal({ request, type, onClose, onConfirm }: ApproveRejectModalProps) {
  const [remarks, setRemarks] = useState('')

  if (!request) return null

  const isApprove = type === 'approve'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isApprove ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {isApprove ? <MdCheckCircle className="text-emerald-600 text-lg" /> : <MdCancel className="text-red-600 text-lg" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{isApprove ? 'Approve' : 'Reject'} Request</h3>
                <p className="text-[10px] text-gray-500">{request.id} - {request.studentName}</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <MdClose />
            </motion.button>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 space-y-1">
              <p className="text-xs text-gray-600"><span className="font-medium">Current:</span> {request.currentStatus}</p>
              <p className="text-xs text-gray-600"><span className="font-medium">Requested:</span> {request.requestedStatus}</p>
              <p className="text-xs text-gray-600"><span className="font-medium">Reason:</span> {request.reason}</p>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                Remarks {isApprove ? '(optional)' : '(required)'}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={isApprove ? 'Add approval remarks...' : 'Provide reason for rejection...'}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white/80 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => onConfirm(request.id, remarks)}
                disabled={!isApprove && !remarks}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all ${
                  isApprove || remarks
                    ? isApprove
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isApprove ? <MdCheckCircle className="text-lg" /> : <MdCancel className="text-lg" />}
                {isApprove ? 'Approve' : 'Reject'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
