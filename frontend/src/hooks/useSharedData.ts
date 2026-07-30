import { useQuery } from '@tanstack/react-query';
import facultyService from '../services/faculty/faculty.service';
import timetableService from '../services/timetable/timetable.service';
import attendanceService from '../services/attendance/attendance.service';
import studentService from '../services/student/student.service';
import assignmentService from '../services/assignment/assignment.service';
import { normalizeFacultyList, normalizeTimetableList } from '../utils/normalizers';

const STALE_TIME = 60000;
const GC_TIME = 120000;

export function useFacultyListShared(params?: Record<string, unknown> & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params ?? {}
  return useQuery({
    queryKey: ['faculty', queryParams],
    queryFn: async () => {
      const result = await facultyService.getAll(queryParams);
      return normalizeFacultyList(result);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    enabled: enabled ?? true,
  });
}

export function useTimetableListShared(params?: Record<string, unknown> & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params ?? {}
  return useQuery({
    queryKey: ['timetable', queryParams],
    queryFn: async () => {
      const result = await timetableService.getAll(queryParams);
      return normalizeTimetableList(result);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    enabled: enabled ?? true,
  });
}

export function useStudentListShared(params?: Record<string, unknown> & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params ?? {}
  return useQuery({
    queryKey: ['students', queryParams],
    queryFn: async () => {
      const result = await studentService.getAll(queryParams);
      return (result as any)?.data ?? result ?? [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    enabled: enabled ?? true,
  });
}

export function useAssignmentListShared(params?: Record<string, unknown> & { enabled?: boolean }) {
  const { enabled, ...queryParams } = params ?? {}
  return useQuery({
    queryKey: ['assignments', queryParams],
    queryFn: async () => {
      const result = await assignmentService.getAll(queryParams);
      return (result as any)?.data ?? result ?? [];
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
    enabled: enabled ?? true,
  });
}

export function useAttendanceStatsShared(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['attendanceStats', params],
    queryFn: () => attendanceService.getAttendanceStats(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}
