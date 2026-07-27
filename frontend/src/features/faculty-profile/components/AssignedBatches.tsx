import { motion } from 'framer-motion'
import { MdGroup, MdPeople, MdCalendarToday } from 'react-icons/md'
import type { AssignedBatch } from '../types/profile.types'

interface AssignedBatchesProps {
  batches: AssignedBatch[]
}

export default function AssignedBatches({ batches }: AssignedBatchesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-md p-6"
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">Assigned Batches</h3>
      <div className="space-y-3">
        {batches.map((batch, i) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-blue-50/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdGroup className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{batch.batchName}</p>
                <p className="text-xs text-gray-500">
                  <MdCalendarToday className="inline mr-1" />
                  Year {batch.year}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MdPeople className="text-gray-400" />
              <span className="font-medium">{batch.students}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
