import { useQuery } from '@tanstack/react-query';
import facultyService from '../services/faculty/faculty.service';
import timetableService from '../services/timetable/timetable.service';
import attendanceService from '../services/attendance/attendance.service';
import { normalizeFacultyList, normalizeTimetableList } from '../utils/normalizers';

const STALE_TIME = 60000;
const GC_TIME = 120000;

export function useFacultyListShared(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['faculty', params],
    queryFn: async () => {
      const result = await facultyService.getAll(params);
      return normalizeFacultyList(result);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
  });
}

export function useTimetableListShared(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['timetable', params],
    queryFn: async () => {
      const result = await timetableService.getAll(params);
      return normalizeTimetableList(result);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 2,
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
