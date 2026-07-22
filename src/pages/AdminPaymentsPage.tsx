import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdAccountBalanceWallet, MdWarning, MdReceipt, MdAdd, MdUndo, MdPayment } from 'react-icons/md'
import { usePaymentList, usePaymentSummary, useCreatePayment, useRefundPayment, useDeletePayment } from '../hooks/useReactQuery'
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'all' | 'history' | 'summary'>('all')
  const [showCreate, setShowCreate] = useState(false)

  const { data: payments, isLoading, isError, error, refetch } = usePaymentList()
  const { isLoading: summaryLoading } = usePaymentSummary()
  const createPayment = useCreatePayment()
  const refundPayment = useRefundPayment()
  const deletePayment = useDeletePayment()

  const paymentList = Array.isArray(payments) ? payments : []
  const filtered = paymentList.filter((p: any) =>
    p.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = paymentList
    .filter((p: any) => p.status === 'completed' || p.status === 'paid')
    .reduce((s: number, p: any) => s + p.amount, 0)
  const totalRefunded = paymentList
    .filter((p: any) => p.status === 'refunded')
    .reduce((s: number, p: any) => s + p.amount, 0)
  const pendingCount = paymentList.filter((p: any) => p.status === 'pending').length

  const handleCreate = () => {
    const form = document.getElementById('create-payment-form') as HTMLFormElement
    if (!form) return
    const data = Object.fromEntries(new FormData(form)) as Record<string, unknown>
    if (data.amount) data.amount = Number(data.amount)
    createPayment.mutate(data)
    setShowCreate(false)
  }

  const handleRefund = (id: string) => {
    const reason = window.prompt('Enter refund reason:')
    if (!reason) return
    refundPayment.mutate({ id, data: { reason, refundedBy: 'admin' } })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this payment record?')) deletePayment.mutate(id)
  }

  const loading = isLoading || summaryLoading

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div><div className="skeleton h-9 w-64 mb-2" /><div className="skeleton h-4 w-32" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="skeleton h-32 rounded-xl" />))}
        </div>
        <div className="skeleton h-10 w-80 mb-4 rounded-lg" />
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-neutral-100"><div className="skeleton h-10 w-full" /></div>
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="skeleton h-14 mx-4 mb-2" />))}
          <div className="h-4" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon !bg-danger-light !text-danger">!</div>
          <h3>Error loading payments</h3>
          <p>{error instanceof Error ? error.message : 'Failed to load payments'}</p>
          <button onClick={() => refetch()} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Payment Management</h1>
          <p>{paymentList.length} total transactions</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn btn-primary">
          <MdAdd size={18} /> {showCreate ? 'Cancel' : 'Record Payment'}
        </button>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdAccountBalanceWallet size={24} /></div>
          <div className="stat-value text-success">₹{totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Collected</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-warning-light text-warning"><MdWarning size={24} /></div>
          <div className="stat-value text-warning">{pendingCount}</div>
          <div className="stat-label">Pending Payments</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-danger-light text-danger"><MdUndo size={24} /></div>
          <div className="stat-value text-danger">₹{totalRefunded.toLocaleString()}</div>
          <div className="stat-label">Total Refunded</div>
        </motion.div>
      </motion.div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="card mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdPayment className="text-primary" size={22} /></div>
            <div>
              <h3 className="text-base font-semibold text-neutral-800">Record New Payment</h3>
              <p className="text-xs text-neutral-500">Enter payment details</p>
            </div>
          </div>
          <form id="create-payment-form" onSubmit={(e) => { e.preventDefault(); handleCreate() }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {[
                { name: 'studentId', label: 'Student ID', type: 'text' },
                { name: 'studentName', label: 'Student Name', type: 'text' },
                { name: 'amount', label: 'Amount (₹)', type: 'number' },
                { name: 'paymentMethod', label: 'Payment Method', type: 'text' },
                { name: 'transactionId', label: 'Transaction ID', type: 'text' },
                { name: 'description', label: 'Description', type: 'text' },
              ].map((f) => (
                <div className="input-group" key={f.name}>
                  <label>{f.label}</label>
                  <input type={f.type} name={f.name} className="input-field" required={f.name !== 'description'} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" className="btn btn-primary" disabled={createPayment.isPending}>
                {createPayment.isPending ? 'Recording...' : 'Record Payment'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex gap-1 mb-5 p-1 bg-neutral-100/50 rounded-lg w-fit">
          {(['all', 'history', 'summary'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`btn btn-sm rounded-md transition-all ${tab === t ? 'btn-primary shadow-sm' : 'btn-ghost text-neutral-500'}`}>
              {t === 'all' ? 'All Payments' : t === 'history' ? 'History' : 'Summary'}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === 'all' && (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <div className="relative mb-5">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input type="text" placeholder="Search by student or transaction ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
              </div>
              <div className="overflow-x-auto">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Transaction ID</th>
                        <th className="text-right">Amount</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7}>
                            <div className="empty-state !py-12">
                              <div className="empty-state-icon"><MdReceipt size={28} /></div>
                              <h3>No payments found</h3>
                              <p>Try adjusting your search or record a new payment.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((p: any) => (
                          <tr key={p.id}>
                            <td>
                              <span className="font-medium text-neutral-800 text-sm">{p.studentName}</span>
                              <p className="text-xs text-neutral-400">{p.studentId}</p>
                            </td>
                            <td className="text-sm text-neutral-500 font-mono">{p.transactionId || '-'}</td>
                            <td className="text-right font-semibold text-neutral-800">₹{p.amount?.toLocaleString()}</td>
                            <td className="text-sm text-neutral-500">{p.paymentMethod || '-'}</td>
                            <td className="text-sm text-neutral-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                            <td className="text-center">
                              <span className={`badge ${p.status === 'completed' || p.status === 'paid' ? 'badge-success' : p.status === 'refunded' ? 'badge-warning' : 'badge-danger'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {p.status !== 'refunded' && (
                                  <button onClick={() => handleRefund(p.id)} className="btn btn-ghost btn-sm !px-1.5 text-warning hover:bg-warning-light" title="Refund">
                                    <MdUndo size={15} />
                                  </button>
                                )}
                                <button onClick={() => handleDelete(p.id)} className="btn btn-ghost btn-sm !px-1.5 text-danger hover:bg-danger-light" title="Delete">
                                  <MdWarning size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <div className="space-y-3">
                {paymentList.length === 0 ? (
                  <div className="empty-state"><div className="empty-state-icon"><MdReceipt size={28} /></div><h3>No payment history</h3></div>
                ) : (
                  paymentList.slice().reverse().map((p: any) => (
                    <motion.div key={p.id} variants={itemVariants} className="card p-4 border-neutral-100 hover:border-primary-200 transition-all">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${p.status === 'completed' ? 'bg-success-light' : p.status === 'refunded' ? 'bg-warning-light' : 'bg-neutral-100'}`}>
                            <MdPayment className={p.status === 'completed' ? 'text-success' : p.status === 'refunded' ? 'text-warning' : 'text-neutral-400'} size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-800 text-sm">{p.studentName}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{p.description || p.transactionId || 'Payment'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-neutral-800">₹{p.amount?.toLocaleString()}</p>
                          <p className="text-xs text-neutral-400">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {tab === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdAccountBalanceWallet className="text-primary" size={22} /></div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-800">Payment Summary</h3>
                    <p className="text-xs text-neutral-500">Overview of all transactions</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="card p-4 bg-success-light/20 border-success/20">
                    <p className="text-xs text-neutral-500 mb-1">Completed Payments</p>
                    <p className="text-xl font-bold text-success">₹{paymentList.filter((p: any) => p.status === 'completed').reduce((s: number, p: any) => s + p.amount, 0).toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{paymentList.filter((p: any) => p.status === 'completed').length} transactions</p>
                  </div>
                  <div className="card p-4 bg-warning-light/20 border-warning/20">
                    <p className="text-xs text-neutral-500 mb-1">Refunded</p>
                    <p className="text-xl font-bold text-warning">₹{totalRefunded.toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{paymentList.filter((p: any) => p.status === 'refunded').length} transactions</p>
                  </div>
                  <div className="card p-4 bg-danger-light/20 border-danger/20">
                    <p className="text-xs text-neutral-500 mb-1">Failed/Pending</p>
                    <p className="text-xl font-bold text-danger">₹{paymentList.filter((p: any) => p.status === 'pending' || p.status === 'failed').reduce((s: number, p: any) => s + p.amount, 0).toLocaleString()}</p>
                    <p className="text-xs text-neutral-400 mt-1">{pendingCount} transactions</p>
                  </div>
                  <div className="card p-4 bg-primary-50/20 border-primary/20">
                    <p className="text-xs text-neutral-500 mb-1">Total Transactions</p>
                    <p className="text-xl font-bold text-primary">{paymentList.length}</p>
                    <p className="text-xs text-neutral-400 mt-1">All time</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
