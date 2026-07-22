import { motion } from 'framer-motion'
import { MdAttachMoney, MdCheckCircle, MdDownload, MdReceipt, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import studentDashboardService from '../services/student-dashboard/student-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StudentFeeStatusPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['student-fees'],
    queryFn: () => studentDashboardService.getFees(),
  })

  const feeData = data?.data
  const totalFee = feeData?.totalFee ?? 0
  const paid = feeData?.paid ?? 0
  const due = feeData?.due ?? 0
  const status = feeData?.status ?? 'unpaid'
  const transactions = feeData?.transactions ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Fee Status</h1>
          <p className="text-neutral-500 text-sm mt-1">View your fee details and download receipts</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="stat-card">
                  <div className="flex flex-col items-center space-y-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full skeleton" />
                    <div className="h-6 skeleton rounded w-20" />
                    <div className="h-3 skeleton rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
            <div className="card p-5 animate-pulse">
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 skeleton rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load fee details</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="stat-card text-center">
                <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdAttachMoney size={24} /></div>
                <div className="stat-value">₹{totalFee.toLocaleString()}</div>
                <div className="stat-label">Total Fee (Sem 5)</div>
              </div>
              <div className="stat-card text-center">
                <div className="stat-icon bg-success-light text-success mx-auto"><MdCheckCircle size={24} /></div>
                <div className="stat-value text-success">₹{paid.toLocaleString()}</div>
                <div className="stat-label">Amount Paid</div>
              </div>
              <div className="stat-card text-center">
                <div className={`stat-icon ${due > 0 ? 'bg-danger-light text-danger' : 'bg-success-light text-success'} mx-auto`}><MdReceipt size={24} /></div>
                <div className={`stat-value ${due > 0 ? 'text-danger' : 'text-success'}`}>₹{due.toLocaleString()}</div>
                <div className="stat-label">Due Amount</div>
              </div>
            </motion.div>

            {status === 'paid' && (
              <motion.div variants={itemVariants} className="p-4 rounded-xl bg-success-light border border-success/20 text-sm text-success flex items-center gap-2">
                <MdCheckCircle size={20} /> All fees have been paid. No outstanding dues.
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="card">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-800">Payment History</h3>
              </div>
              <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th className="text-right">Amount</th>
                      <th className="text-center">Method</th>
                      <th className="text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-sm text-neutral-400 py-8">No payment history available</td>
                      </tr>
                    ) : (
                      transactions.map((t: { id: string; date: string; description: string; amount: number; method: string }) => (
                        <tr key={t.id}>
                          <td className="text-neutral-600">{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="text-neutral-800">{t.description}</td>
                          <td className="text-right font-medium text-neutral-800">₹{t.amount.toLocaleString()}</td>
                          <td className="text-center text-neutral-600">{t.method}</td>
                          <td className="text-center">
                            <button className="btn btn-ghost btn-sm mx-auto"><MdDownload size={14} /> PDF</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  )
}
