import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MdChevronRight, MdHome, MdArrowBack } from 'react-icons/md'
import Toast from '../../../components/Toast'
import { useNavigate } from 'react-router-dom'
import type { TransferRequest, TransferRecord } from '../types/transfer.types'
import type { Faculty } from '../../faculty/types/faculty.types'
import facultyService from '../../../services/faculty/faculty.service'
import facultyTransferService from '../../../services/faculty/faculty-transfer.service'
import { normalizeFacultyList } from '../../../utils/normalizers'
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
  const [facultyTransferList, setFacultyTransferList] = useState<{ id: string; name: string; branch: string; department: string }[]>([])
  const [history, setHistory] = useState<TransferRecord[]>([])
  const [form, setForm] = useState<TransferRequest>(emptyForm)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [facultyRes, transferRes] = await Promise.all([
          facultyService.getAll(),
          facultyTransferService.getAll(),
        ])
        const facultyList: Faculty[] = normalizeFacultyList(facultyRes)
        setFacultyTransferList(
          facultyList.map((f: Faculty) => ({
            id: f.id,
            name: f.name,
            branch: f.branch,
            department: f.department,
          }))
        )
        const transferRaw = transferRes?.data ?? []
        const transferList = Array.isArray(transferRaw) ? transferRaw : (transferRaw?.data ?? [])
        setHistory(transferList)
      } catch {
        setFacultyTransferList([])
        setHistory([])
        setToastMessage('Failed to load transfer data')
        setShowToast(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const handleTransfer = async () => {
    try {
      await facultyTransferService.create(form as unknown as Record<string, unknown>)
      const newRecord: TransferRecord = {
        id: `TRF-${String(history.length + 1).padStart(3, '0')}`,
        facultyName: form.facultyName,
        oldBranch: form.currentBranch,
        newBranch: form.newBranch,
        date: form.transferDate,
        status: 'Pending',
      }
      setHistory(prev => [newRecord, ...prev])
      setToastMessage('Transfer initiated successfully')
      setShowToast(true)
    } catch {
      setToastMessage('Failed to initiate transfer')
      setShowToast(true)
    }
    setForm(emptyForm)
    setShowConfirm(false)
  }

  const canTransfer = !!(
    form.facultyId && form.newBranch && form.newDepartment && form.transferDate && form.reason
  )

  const branchOptions = useMemo(() => [...new Set(facultyTransferList.map(f => f.branch).filter(Boolean))], [facultyTransferList])
  const departmentOptions = useMemo(() => [...new Set(facultyTransferList.map(f => f.department).filter(Boolean))], [facultyTransferList])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

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
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  )
}
