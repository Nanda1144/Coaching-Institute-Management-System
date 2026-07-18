import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import facultyService from '../services/faculty/faculty.service'
import attendanceService from '../services/attendance/attendance.service'
import timetableService from '../services/timetable/timetable.service'
import assignmentService from '../services/assignment/assignment.service'
import holidayService from '../services/holiday/holiday.service'
import dashboardService from '../services/dashboard/dashboard.service'
import materialService from '../services/material/material.service'
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
