import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MdAttachMoney, MdCheckCircle, MdDownload, MdReceipt } from 'react-icons/md'
import parentDashboardService from '../services/parent-dashboard/parent-dashboard.service'

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
}

export default function ParentFeesPage() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['parent-fees'],
    queryFn: () => parentDashboardService.getFees(),
  })

  const feeData = response?.data ?? { totalFee: 0, paid: 0, due: 0, status: 'paid', transactions: [] }
  const { totalFee, paid, due, status, transactions } = feeData

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 text-center">
              <div className="skeleton w-8 h-8 rounded-full mx-auto mb-2" />
              <div className="skeleton h-8 w-20 mx-auto mb-1" />
              <div className="skeleton h-4 w-24 mx-auto" />
            </div>
          ))}
        </div>
        <div className="card overflow-hidden">
          <div className="skeleton h-12 w-full rounded-none" />
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Fee Details</h1>
          <p className="text-neutral-500 mt-1">View fee status and payment history</p>
        </motion.div>
        <div className="bg-danger-light border border-danger/20 rounded-lg p-4 text-sm text-danger">
          Failed to load fee details. Please try again later.
        </div>
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="gradient-text text-3xl font-bold">Fee Details</h1>
          <p className="text-neutral-500 mt-1">View fee status and payment history</p>
        </motion.div>
        <div className="card empty-state">
          <div className="empty-state-icon"><MdReceipt size={24} /></div>
          <p className="text-neutral-500">No fee data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text text-3xl font-bold">Fee Details</h1>
        <p className="text-neutral-500 mt-1">View fee status and payment history</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: MdAttachMoney,
            value: `\u20B9${totalFee.toLocaleString()}`,
            label: 'Total Fee (Sem 5)',
            color: 'text-primary',
            bg: 'bg-primary-50',
          },
          {
            icon: MdCheckCircle,
            value: `\u20B9${paid.toLocaleString()}`,
            label: 'Amount Paid',
            color: 'text-success',
            bg: 'bg-success-light',
          },
          {
            icon: MdReceipt,
            value: `\u20B9${due.toLocaleString()}`,
            label: 'Due Amount',
            color: due > 0 ? 'text-danger' : 'text-success',
            bg: due > 0 ? 'bg-danger-light' : 'bg-success-light',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card text-center"
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
          >
            <div className={`stat-icon ${stat.bg} ${stat.color} mx-auto`}>
              <stat.icon />
            </div>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {status === 'paid' && (
        <motion.div
          className="bg-success-light border border-success/20 rounded-lg p-4 text-sm text-success flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MdCheckCircle size={20} /> All fees have been paid. No outstanding dues.
        </motion.div>
      )}

      <motion.div
        className="table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Payment History</h3>
        </div>
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
            {transactions.map((t: any) => (
              <tr key={t.id}>
                <td className="text-neutral-600">
                  {new Date(t.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="text-neutral-900">{t.description}</td>
                <td className="text-right font-medium text-neutral-900">
                  ₹{t.amount.toLocaleString()}
                </td>
                <td className="text-center text-neutral-600">{t.method}</td>
                <td className="text-center">
                  <button className="btn btn-ghost btn-sm">
                    <MdDownload size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
