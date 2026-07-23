import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSearch, MdAttachMoney, MdDownload, MdAdd, MdCheckCircle, MdWarning, MdReceipt, MdAccountBalanceWallet, MdSend } from 'react-icons/md'
import { useFeeTransactions, usePendingFees, useFeeStructure } from '../hooks/useReactQuery'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function AdminFeesPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<'collection' | 'pending' | 'structure'>('collection')

  const { data: transactions, isLoading: txLoading, isError: txError, error: txErr, refetch: refetchTx } = useFeeTransactions()
  const { data: pending, isLoading: pendingLoading, isError: pendingError, error: pendingErr, refetch: refetchPending } = usePendingFees()
  const { data: structure, isLoading: structureLoading } = useFeeStructure()

  const txList = Array.isArray(transactions) ? transactions : []
  const pendingList = Array.isArray(pending) ? pending : []
  const structureList = Array.isArray(structure) ? structure : []

  const filtered = txList.filter((t: any) => t.student?.toLowerCase().includes(search.toLowerCase()))

  const totalCollected = txList.filter((t: any) => t.status === 'paid').reduce((s: number, t: any) => s + t.amount, 0)
  const totalPending = pendingList.reduce((s: number, p: any) => s + p.amount, 0)

  const loading = txLoading || pendingLoading || structureLoading

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="skeleton h-9 w-64 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
        <div className="skeleton h-10 w-80 mb-4 rounded-lg" />
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <div className="skeleton h-10 w-full" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-14 mx-4 mb-2" />
          ))}
          <div className="h-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="page-header">
        <div>
          <h1 className="gradient-text">Fee Management</h1>
          <p>Manage fee structure, collection, and receipts</p>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-primary-50 text-primary"><MdAccountBalanceWallet size={24} /></div>
          <div className="stat-value">₹{(totalCollected + totalPending).toLocaleString()}</div>
          <div className="stat-label">Total Fee (Sem 5)</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-success-light text-success"><MdCheckCircle size={24} /></div>
          <div className="stat-value text-success">₹{totalCollected.toLocaleString()}</div>
          <div className="stat-label">Collected</div>
        </motion.div>
        <motion.div variants={itemVariants} className="stat-card">
          <div className="stat-icon bg-danger-light text-danger"><MdWarning size={24} /></div>
          <div className="stat-value text-danger">₹{totalPending.toLocaleString()}</div>
          <div className="stat-label">Pending</div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex gap-1 mb-5 p-1 bg-neutral-100/50 rounded-lg w-fit overflow-x-auto">
          {(['collection', 'pending', 'structure'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`btn btn-sm rounded-md transition-all ${tab === t ? 'btn-primary shadow-sm' : 'btn-ghost text-neutral-500'}`}>
              {t === 'collection' ? 'Collection' : t === 'pending' ? 'Pending Fees' : 'Fee Structure'}
            </button>
          ))}
        </div>

        <div className="card">
          {tab === 'collection' && (
            <motion.div key="collection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {txError ? (
                <div className="empty-state !py-8">
                  <p className="text-sm text-danger mb-3">{txErr instanceof Error ? txErr.message : 'Failed to load transactions'}</p>
                  <button onClick={() => refetchTx()} className="btn btn-primary btn-sm">Retry</button>
                </div>
              ) : (
                <>
                  <div className="relative mb-5">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
                  </div>
                  <div className="overflow-x-auto">
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Description</th>
                            <th className="text-right">Amount</th>
                            <th>Date</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length === 0 ? (
                            <tr>
                              <td colSpan={6}>
                                <div className="empty-state !py-12">
                                  <div className="empty-state-icon"><MdReceipt size={28} /></div>
                                  <h3>No transactions found</h3>
                                  <p>Try adjusting your search to find what you're looking for.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filtered.map((t: any) => (
                              <tr key={t.id}>
                                <td>
                                  <span className="font-medium text-neutral-800 text-sm">{t.student}</span>
                                  <p className="text-xs text-neutral-400">{t.roll}</p>
                                </td>
                                <td className="text-sm text-neutral-600">{t.description}</td>
                                <td className="text-right font-semibold text-neutral-800">₹{t.amount?.toLocaleString()}</td>
                                <td className="text-sm text-neutral-500">{t.date ? new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</td>
                                <td className="text-center">
                                  <span className={`badge ${t.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span>
                                </td>
                                <td className="text-center">
                                  <button className="btn btn-ghost btn-sm text-primary hover:text-primary-dark">
                                    <MdDownload size={14} /> PDF
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {tab === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              {pendingError ? (
                <div className="empty-state !py-8">
                  <p className="text-sm text-danger mb-3">{pendingErr instanceof Error ? pendingErr.message : 'Failed to load pending fees'}</p>
                  <button onClick={() => refetchPending()} className="btn btn-primary btn-sm">Retry</button>
                </div>
              ) : (
                <>
                  {pendingList.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><MdCheckCircle size={28} className="text-success" /></div>
                      <h3>No pending fees</h3>
                      <p>All fee payments are up to date. Great job!</p>
                    </div>
                  ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                      {pendingList.map((p: any) => (
                        <motion.div key={`pending-${p.roll}-${p.type || p.dueDate}`} variants={itemVariants} className="card p-4 border-danger/20 hover:border-danger/40 transition-all">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center shrink-0">
                                <MdWarning className="text-danger" size={20} />
                              </div>
                              <div>
                                <p className="font-semibold text-neutral-800 text-sm">{p.student} <span className="text-xs text-neutral-400 font-normal">({p.roll})</span></p>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                  Due: {new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &bull; {p.daysOverdue} days overdue
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-danger">₹{p.amount?.toLocaleString()}</p>
                              <button className="btn btn-ghost btn-sm text-primary mt-1">
                                <MdSend size={14} /> Send Reminder
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {tab === 'structure' && (
            <motion.div key="structure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center"><MdAttachMoney className="text-primary" size={22} /></div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-800">Semester 5 Fee Structure</h3>
                    <p className="text-xs text-neutral-500">Breakdown of all fees for the current semester</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Fee Type</th>
                          <th className="text-right">Amount</th>
                          <th className="text-center">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {structureList.map((f: any, fi: number) => (
                          <tr key={`fee-${f.type}-${fi}`}>
                            <td className="text-sm text-neutral-800">{f.type}</td>
                            <td className="text-right font-semibold text-neutral-800">₹{f.amount?.toLocaleString()}</td>
                            <td className="text-center text-sm text-neutral-500">{f.dueDate}</td>
                          </tr>
                        ))}
                        <tr className="bg-primary-50/50">
                          <td className="font-semibold text-neutral-800">Total</td>
                          <td className="text-right font-bold text-primary">₹{structureList.reduce((s: number, f: any) => s + (f.amount || 0), 0).toLocaleString()}</td>
                          <td className="text-center text-sm text-neutral-500">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <button className="btn btn-primary mt-5">
                  <MdAdd size={18} /> Add Fee Type
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
