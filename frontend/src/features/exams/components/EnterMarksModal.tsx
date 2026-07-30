import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdCloudUpload, MdDownload, MdCheckCircle, MdErrorOutline, MdSchool } from 'react-icons/md'
import * as XLSX from 'xlsx'
import examService from '../../../services/exam/exam.service'

interface MarksRow {
  [key: string]: unknown
  studentId: string
  studentName: string
  rollNumber: string
  marksObtained: number
  totalMarks: number
  grade?: string
}

interface EnterMarksModalProps {
  isOpen: boolean
  onClose: () => void
  examId: string
  examTitle: string
  onSuccess: () => void
}

export default function EnterMarksModal({ isOpen, onClose, examId, examTitle, onSuccess }: EnterMarksModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'success' | 'error'>('upload')
  const [marks, setMarks] = useState<MarksRow[]>([])
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<any>(sheet)

        const parsed: MarksRow[] = json.map((row: any, idx: number) => {
          const studentId = row.studentId || row.student_id || row.id || row.StudentID || row['Student ID'] || ''
          const studentName = row.studentName || row.student_name || row.name || row.StudentName || row['Student Name'] || ''
          const rollNumber = row.rollNumber || row.roll_number || row.rollNo || row.RollNumber || row['Roll Number'] || ''
          const marksObtained = parseFloat(row.marksObtained || row.marks_obtained || row.marks || row.MarksObtained || row.Marks || row['Marks Obtained'] || 0)
          const totalMarks = parseInt(row.totalMarks || row.total_marks || row.total || row.TotalMarks || row.Total || row['Total Marks'] || 100, 10)
          const grade = row.grade || row.Grade || ''

          if (!studentId && !studentName) {
            throw new Error(`Row ${idx + 2}: Missing student identifier. Ensure columns include "studentId" or "studentName".`)
          }

          return {
            studentId: String(studentId || `auto-${idx}`),
            studentName: String(studentName || 'Unknown'),
            rollNumber: String(rollNumber || ''),
            marksObtained: isNaN(marksObtained) ? 0 : marksObtained,
            totalMarks: isNaN(totalMarks) ? 100 : totalMarks,
            grade: grade || undefined,
          }
        })

        if (parsed.length === 0) {
          setErrorMsg('No data found in the Excel file. Make sure the sheet has data.')
          setStep('error')
          return
        }

        setMarks(parsed)
        setStep('preview')
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse Excel file. Please check the format.')
        setStep('error')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleUpload = async () => {
    setUploading(true)
    try {
      await examService.uploadMarks(examId, marks)
      setStep('success')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to upload marks')
      setStep('error')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      { studentId: 'STU001', studentName: 'John Doe', rollNumber: 'CS2022001', marksObtained: 85, totalMarks: 100, grade: 'A' },
    ]
    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Marks')
    XLSX.writeFile(wb, `marks-template-${examTitle.replace(/\s+/g, '-').toLowerCase()}.xlsx`)
  }

  const reset = () => {
    setStep('upload')
    setMarks([])
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { if (!uploading) onClose() }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl w-full max-w-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <MdSchool className="text-amber-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Enter Marks</h3>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{examTitle}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MdClose />
              </motion.button>
            </div>

            <div className="p-5">
              {step === 'upload' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Upload an Excel file (.xlsx or .xls) with student marks. The file should contain columns: <strong>studentId</strong>, <strong>studentName</strong>, <strong>rollNumber</strong>, <strong>marksObtained</strong>, <strong>totalMarks</strong>.
                    </p>
                  </div>

                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <MdDownload size={16} />
                    Download Template
                  </button>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all"
                  >
                    <MdCloudUpload className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload Excel file</p>
                    <p className="text-xs text-gray-400 mt-1">.xlsx or .xls format</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">
                      {marks.length} student{marks.length !== 1 ? 's' : ''} found
                    </p>
                    <button onClick={reset} className="text-xs text-blue-600 hover:text-blue-700">Upload different file</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Roll No</th>
                          <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Name</th>
                          <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">Marks</th>
                          <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">Total</th>
                          <th className="text-center px-3 py-2 text-xs font-medium text-gray-500">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((row, idx) => (
                          <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/50">
                            <td className="px-3 py-2 text-xs text-gray-600 font-mono">{row.rollNumber}</td>
                            <td className="px-3 py-2 text-xs text-gray-800">{row.studentName}</td>
                            <td className="px-3 py-2 text-xs text-gray-800 text-center font-medium">{row.marksObtained}</td>
                            <td className="px-3 py-2 text-xs text-gray-600 text-center">{row.totalMarks}</td>
                            <td className="px-3 py-2 text-xs text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                (!row.grade || row.grade === 'F') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                              }`}>
                                {row.grade || '-'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-xs text-amber-700">
                      <strong>Analysis:</strong> Average marks: {(marks.reduce((s, r) => s + r.marksObtained, 0) / marks.length).toFixed(1)} | Highest: {Math.max(...marks.map(r => r.marksObtained))} | Lowest: {Math.min(...marks.map(r => r.marksObtained))} | Pass rate: {((marks.filter(r => r.marksObtained >= (r.totalMarks * 0.4)).length / marks.length) * 100).toFixed(0)}%
                    </p>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={reset} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : `Upload ${marks.length} Marks`}
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <MdCheckCircle className="text-green-600 text-3xl" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800">Marks Uploaded!</h3>
                  <p className="text-sm text-gray-500 mt-1">{marks.length} student marks have been recorded.</p>
                </div>
              )}

              {step === 'error' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <MdErrorOutline className="text-red-600 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Upload Failed</h3>
                  <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
                  <button onClick={reset} className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium shadow-md">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
