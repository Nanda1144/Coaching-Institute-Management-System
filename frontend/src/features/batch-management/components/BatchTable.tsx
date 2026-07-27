import { MdRemoveRedEye, MdEdit, MdDelete } from 'react-icons/md'
import StatusBadge from './StatusBadge'

interface Batch {
  id: string
  name: string
  course: string
  faculty: string
  schedule: string
  classroom: string
  students: number
  status: string
}

interface BatchTableProps {
  batches: Batch[]
  onView?: (batch: Batch) => void
  onEdit?: (batch: Batch) => void
  onDelete?: (batch: Batch) => void
}

export default function BatchTable({ batches, onView, onEdit, onDelete }: BatchTableProps) {
  if (batches.length === 0) return null

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Batch Name</th>
            <th>Course</th>
            <th>Faculty</th>
            <th>Schedule</th>
            <th>Classroom</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td><span className="font-mono font-semibold text-primary-600">{batch.id}</span></td>
              <td><span className="font-semibold text-neutral-800">{batch.name}</span></td>
              <td className="text-neutral-600">{batch.course}</td>
              <td className="text-neutral-600">{batch.faculty}</td>
              <td className="text-sm text-neutral-600">{batch.schedule}</td>
              <td className="text-neutral-600">{batch.classroom}</td>
              <td>
                <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                  {batch.students}
                </span>
              </td>
              <td><StatusBadge status={batch.status} /></td>
              <td>
                <div className="flex gap-1.5">
                  {onView && <ActionButton icon={<MdRemoveRedEye size={15} />} onClick={() => onView(batch)} title="View" className="hover:bg-indigo-50 hover:border-indigo-300" />}
                  {onEdit && <ActionButton icon={<MdEdit size={15} />} onClick={() => onEdit(batch)} title="Edit" className="hover:bg-amber-50 hover:border-amber-300" />}
                  {onDelete && <ActionButton icon={<MdDelete size={15} />} onClick={() => onDelete(batch)} title="Delete" className="hover:bg-red-50 hover:border-red-300" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ActionButton({
  icon, onClick, title, className = '',
}: {
  icon: React.ReactNode
  onClick: () => void
  title?: string
  className?: string
}) {
  return (
    <button
      className={`w-7 h-7 flex items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 cursor-pointer transition-all ${className}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  )
}
