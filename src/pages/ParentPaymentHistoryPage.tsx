import { motion } from 'framer-motion'
import { MdReceipt, MdDownload, MdCheckCircle, MdErrorOutline } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function ParentPaymentHistoryPage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-payment-history'],
    queryFn: () => parentDashboardService.getFees(),
  })

  const feeData = response?.data ?? { transactions: [], totalFee: 0, paid: 0, due: 0, status: 'paid' }
  const { transactions, totalFee, paid, due, status } = feeData

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="gradient-text text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-neutral-500 text-sm mt-1">Complete record of all fee payments</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card text-center">
            <div className="stat-icon bg-primary-50 text-primary mx-auto"><MdReceipt size={24} /></div>
            <div className="stat-value">₹{totalFee.toLocaleString()}</div>
            <div className="stat-label">Total Fees</div>
          </div>
          <div className="stat-card text-center">
            <div className="stat-icon bg-success-light text-success mx-auto"><MdCheckCircle size={24} /></div>
            <div className="stat-value text-success">₹{paid.toLocaleString()}</div>
            <div className="stat-label">Total Paid</div>
          </div>
          <div className="stat-card text-center">
            <div className={`stat-icon ${due > 0 ? 'bg-danger-light text-danger' : 'bg-success-light text-success'} mx-auto`}>
              <MdReceipt size={24} />
            </div>
            <div className={`stat-value ${due > 0 ? 'text-danger' : 'text-success'}`}>₹{due.toLocaleString()}</div>
            <div className="stat-label">Pending</div>
          </div>
        </motion.div>

        {status === 'paid' && (
          <motion.div variants={itemVariants} className="p-4 rounded-xl bg-success-light border border-success/20 text-sm text-success flex items-center gap-2">
            <MdCheckCircle size={20} /> All fees have been paid. No outstanding dues.
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={'sk' + i} className="card p-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 skeleton rounded w-1/4" />
                  <div className="h-4 skeleton rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div variants={itemVariants} className="empty-state card">
            <div className="empty-state-icon"><MdErrorOutline size={28} className="text-danger" /></div>
            <h3>Failed to load payment history</h3>
            <p>Please try again later.</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="table-container">
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
                    <td colSpan={5} className="text-center text-sm text-neutral-400 py-8">No payment records found</td>
                  </tr>
                ) : (
                  transactions.map((t: any) => (
                    <tr key={t.id}>
                      <td className="text-neutral-600">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="text-neutral-900">{t.description}</td>
                      <td className="text-right font-medium text-neutral-900">₹{t.amount.toLocaleString()}</td>
                      <td className="text-center text-neutral-600">{t.method}</td>
                      <td className="text-center">
                        <button className="btn btn-ghost btn-sm"><MdDownload size={14} /> PDF</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
