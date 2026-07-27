import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import facultyService from '../services/faculty/faculty.service'
import attendanceService from '../services/attendance/attendance.service'
import timetableService from '../services/timetable/timetable.service'
import assignmentService from '../services/assignment/assignment.service'
import holidayService from '../services/holiday/holiday.service'
import dashboardService from '../services/dashboard/dashboard.service'
import materialService from '../services/material/material.service'
import studentService from '../services/student/student.service'
import parentService from '../services/parent/parent.service'
import batchService from '../services/batch/batch.service'
import examService from '../services/exam/exam.service'
import feeService from '../services/fee/fee.service'
import notificationService from '../services/notification/notification.service'
import paymentService from '../services/payment/payment.service'
import branchService from '../services/branch/branch.service'
import certificateService from '../services/certificate/certificate.service'
import type { Faculty } from '../features/faculty/types/faculty.types'
import type { TimetableEntry } from '../features/timetable/types/timetable.types'
import type { AttendanceRecord } from '../features/attendance/types/attendance.types'
import type { Holiday } from '../features/holiday-management/types/holiday.types'
import {
  normalizeFacultyList,
  normalizeFacultyProfile,
  normalizeTimetableList,
  normalizeAttendanceList,
  normalizeDashboardStats,
  normalizeAdminDashboardStats,
  normalizeHolidayList,
  normalizeAssignmentList,
  normalizeMaterialList,
  normalizeAttendanceStatsList,
} from '../utils/normalizers'

/* ─── FACULTY ─── */

export function useFacultyList(params?: Record<string, unknown>) {
  return useQuery<Faculty[]>({
    queryKey: ['faculty', params],
    queryFn: async () => {
      const result = await facultyService.getAll(params)
      return normalizeFacultyList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useFacultyById(id: string) {
  return useQuery({
    queryKey: ['faculty', id],
    queryFn: async () => {
      const result = await facultyService.getById(id)
      return normalizeFacultyProfile(result)
    },
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  })
}

export function useFacultyDashboard() {
  return useQuery({
    queryKey: ['facultyDashboard'],
    queryFn: async () => {
      const result = await facultyService.getDashboardStats()
      return normalizeDashboardStats(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const result = await dashboardService.getAdminStats()
      return normalizeAdminDashboardStats(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useStudentDashboard(studentId: string) {
  return useQuery({
    queryKey: ['studentDashboard', studentId],
    queryFn: async () => {
      const result = await dashboardService.getStudentStats(studentId)
      return result
    },
    enabled: !!studentId,
    staleTime: 30000,
    retry: 1,
  })
}

export function useParentDashboard(parentId: string) {
  return useQuery({
    queryKey: ['parentDashboard', parentId],
    queryFn: async () => {
      const result = await dashboardService.getParentStats(parentId)
      return result
    },
    enabled: !!parentId,
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── ATTENDANCE ─── */

export function useAttendanceList(params?: Record<string, unknown>) {
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', params],
    queryFn: async () => {
      const result = await attendanceService.getAll(params)
      return normalizeAttendanceList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useAttendanceToday() {
  return useQuery({
    queryKey: ['attendanceToday'],
    queryFn: async () => {
      const result = await attendanceService.getTodayAttendance()
      return normalizeAttendanceStatsList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useAttendanceStats(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['attendanceStats', params],
    queryFn: async () => {
      const result = await attendanceService.getAttendanceStats(params)
      return result
    },
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── TIMETABLE ─── */

export function useTimetableList(params?: Record<string, unknown>) {
  return useQuery<TimetableEntry[]>({
    queryKey: ['timetable', params],
    queryFn: async () => {
      const result = await timetableService.getAll(params)
      return normalizeTimetableList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── ASSIGNMENTS ─── */

export function useAssignmentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['assignment', params],
    queryFn: async () => {
      const result = await assignmentService.getAll(params)
      return normalizeAssignmentList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── HOLIDAYS ─── */

export function useHolidayList(params?: Record<string, unknown>) {
  return useQuery<Holiday[]>({
    queryKey: ['holiday', params],
    queryFn: async () => {
      const result = await holidayService.getAll(params)
      return normalizeHolidayList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── MATERIALS ─── */

export function useMaterialList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['material', params],
    queryFn: async () => {
      const result = await materialService.getAll(params)
      return normalizeMaterialList(result)
    },
    staleTime: 30000,
    retry: 1,
  })
}

/* ─── ADMIN: STUDENTS ─── */

export function useStudentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      const result = await studentService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['students'] }) },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => studentService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['students'] }) },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['students'] }) },
  })
}

/* ─── ADMIN: PARENTS ─── */

export function useParentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['parents', params],
    queryFn: async () => {
      const result = await parentService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCreateParent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => parentService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['parents'] }) },
  })
}

export function useUpdateParent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => parentService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['parents'] }) },
  })
}

export function useDeleteParent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => parentService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['parents'] }) },
  })
}

/* ─── ADMIN: BATCHES ─── */

export function useBatchList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: async () => {
      const result = await batchService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCreateBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => batchService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['batches'] }) },
  })
}

export function useUpdateBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => batchService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['batches'] }) },
  })
}

export function useDeleteBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => batchService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['batches'] }) },
  })
}

/* ─── ADMIN: EXAMS ─── */

export function useExamList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: async () => {
      const result = await examService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => examService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exams'] }) },
  })
}

export function useUpdateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => examService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exams'] }) },
  })
}

export function useDeleteExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => examService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['exams'] }) },
  })
}

/* ─── ADMIN: FEES ─── */

export function useFeeTransactions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['feeTransactions', params],
    queryFn: async () => {
      const result = await feeService.getTransactions(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function usePendingFees() {
  return useQuery({
    queryKey: ['pendingFees'],
    queryFn: async () => {
      const result = await feeService.getPending()
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useFeeStructure() {
  return useQuery({
    queryKey: ['feeStructure'],
    queryFn: async () => {
      const result = await feeService.getStructure()
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 60000,
    retry: 1,
  })
}

/* ─── ADMIN: NOTIFICATIONS ─── */

export function useNotificationHistory() {
  return useQuery({
    queryKey: ['notificationHistory'],
    queryFn: async () => {
      const result = await notificationService.getHistory()
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useSendNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => notificationService.send(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notificationHistory'] }) },
  })
}

/* ─── ADMIN: PAYMENTS ─── */

export function usePaymentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const result = await paymentService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ['paymentSummary'],
    queryFn: async () => {
      const result = await paymentService.getSummary()
      return result
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function usePaymentHistory(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['paymentHistory', params],
    queryFn: async () => {
      const result = await paymentService.getHistory(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] })
    },
  })
}

export function useUpdatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => paymentService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payments'] }) },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] })
    },
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => paymentService.processRefund(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] })
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] })
    },
  })
}

/* ─── ADMIN: BRANCHES ─── */

export function useBranchList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: async () => {
      const result = await branchService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useBranchAnalytics() {
  return useQuery({
    queryKey: ['branchAnalytics'],
    queryFn: async () => {
      const result = await branchService.getAnalyticsSummary()
      return result
    },
    staleTime: 60000,
    retry: 1,
  })
}

export function useBranchAdmissionsTrend() {
  return useQuery({
    queryKey: ['branchAdmissionsTrend'],
    queryFn: async () => {
      const result = await branchService.getAdmissionsTrend()
      return result
    },
    staleTime: 60000,
    retry: 1,
  })
}

export function useBranchRevenueTrend() {
  return useQuery({
    queryKey: ['branchRevenueTrend'],
    queryFn: async () => {
      const result = await branchService.getRevenueTrend()
      return result
    },
    staleTime: 60000,
    retry: 1,
  })
}

export function useBranchAttendanceTrend() {
  return useQuery({
    queryKey: ['branchAttendanceTrend'],
    queryFn: async () => {
      const result = await branchService.getAttendanceTrend()
      return result
    },
    staleTime: 60000,
    retry: 1,
  })
}

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => branchService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }) },
  })
}

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => branchService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }) },
  })
}

export function useDeleteBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => branchService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }) },
  })
}

export function useToggleBranchStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => branchService.toggleStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['branches'] }) },
  })
}

/* ─── ADMIN: CERTIFICATES ─── */

export function useCertificateList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: async () => {
      const result = await certificateService.getAll(params)
      return (result as any)?.data ?? result ?? []
    },
    staleTime: 30000,
    retry: 1,
  })
}

export function useCertificateById(id: string) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: async () => {
      const result = await certificateService.getById(id)
      return (result as any)?.data ?? result
    },
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  })
}

export function useCertificatePreview(id: string) {
  return useQuery({
    queryKey: ['certificatePreview', id],
    queryFn: async () => {
      const result = await certificateService.getPreview(id)
      return (result as any)?.data ?? result
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 1,
  })
}

export function useCertificatePlaceholders(id: string) {
  return useQuery({
    queryKey: ['certificatePlaceholders', id],
    queryFn: async () => {
      const result = await certificateService.getPlaceholders(id)
      return (result as any)?.data ?? result ?? []
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 1,
  })
}

export function useCreateCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => certificateService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }) },
  })
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => certificateService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }) },
  })
}

export function useUpdateCertificatePlaceholders() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, placeholders }: { id: string; placeholders: Record<string, unknown>[] }) => certificateService.updatePlaceholders(id, placeholders),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificatePlaceholders'] }) },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => certificateService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }) },
  })
}

/* ─── MUTATIONS ─── */

export function useCreateAttendance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => attendanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export function useCreateFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => facultyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] })
    },
  })
}

export function useUpdateFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => facultyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] })
    },
  })
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => facultyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] })
    },
  })
}
