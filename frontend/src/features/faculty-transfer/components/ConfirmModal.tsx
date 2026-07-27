import { motion, AnimatePresence } from 'framer-motion'
import { MdWarning, MdClose } from 'react-icons/md'
import type { TransferRequest } from '../types/transfer.types'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  form: TransferRequest
  facultyName: string
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, form, facultyName }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <MdWarning className="text-amber-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Confirm Transfer</h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <MdClose className="text-gray-500 text-lg" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                You are about to initiate a transfer for the following faculty member:
              </p>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Faculty</span>
                  <span className="font-medium text-gray-800">{facultyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Branch</span>
                  <span className="text-gray-800">{form.currentBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Branch</span>
                  <span className="font-medium text-primary">{form.newBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">New Department</span>
                  <span className="font-medium text-primary">{form.newDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transfer Date</span>
                  <span className="text-gray-800">{form.transferDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason</span>
                  <span className="text-gray-800 text-right max-w-[200px]">{form.reason}</span>
                </div>
              </div>

              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <MdWarning />
                This action will be recorded in the transfer history. Please verify the details before confirming.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all">
                Confirm Transfer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
