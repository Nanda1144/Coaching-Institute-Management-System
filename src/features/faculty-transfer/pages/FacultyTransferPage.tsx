import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import type { TransferRequest } from '../types/transfer.types'
import {
  facultyTransferList, branchOptions, departmentOptions, transferHistoryData,
} from '../data/transferData'
import TransferForm from '../components/TransferForm'
import TransferHistory from '../components/TransferHistory'
import ConfirmModal from '../components/ConfirmModal'

const emptyForm: TransferRequest = {
  facultyId: '',
  facultyName: '',
  currentBranch: '',
  currentDepartment: '',
  newBranch: '',
  newDepartment: '',
  transferDate: '',
  reason: '',
}

export default function FacultyTransferPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<TransferRequest>(emptyForm)
  const [history, setHistory] = useState(transferHistoryData)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleFacultyChange = (id: string) => {
    const f = facultyTransferList.find(f => f.id === id)
    setForm({
      ...emptyForm,
      facultyId: id,
      facultyName: f?.name || '',
      currentBranch: f?.branch || '',
      currentDepartment: f?.department || '',
    })
  }

  const handleTransfer = () => {
    const newRecord = {
      id: `TRF-${String(history.length + 1).padStart(3, '0')}`,
      facultyName: form.facultyName,
      oldBranch: form.currentBranch,
      newBranch: form.newBranch,
      date: form.transferDate,
      status: 'Pending' as const,
    }
    setHistory(prev => [newRecord, ...prev])
    setForm(emptyForm)
    setShowConfirm(false)
  }

  const canTransfer = !!(
    form.facultyId && form.newBranch && form.newDepartment && form.transferDate && form.reason
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MdHome className="text-gray-400" />
            <MdChevronRight className="text-gray-300" />
            <span>Dashboard</span>
            <MdChevronRight className="text-gray-300" />
            <span className="text-primary font-medium">Faculty Transfer</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Faculty Transfer Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Initiate and track faculty branch/department transfers</p>
        </div>
        <button
          onClick={() => navigate('/faculty')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <MdArrowBack className="text-lg" />
          Back to List
        </button>
      </motion.div>

      <TransferForm
        form={form}
        facultyList={facultyTransferList}
        branchOptions={branchOptions}
        departmentOptions={departmentOptions}
        onFormChange={setForm}
        onFacultyChange={handleFacultyChange}
      />

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => navigate('/faculty')}
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConfirm(true)}
          disabled={!canTransfer}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Transfer
        </motion.button>
      </div>

      <TransferHistory records={history} />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleTransfer}
        form={form}
        facultyName={form.facultyName}
      />
    </motion.div>
  )
}
