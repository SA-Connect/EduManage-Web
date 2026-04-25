import api from '@/lib/axios'
import type { AttendanceRecord, ClassAttendance, MarkAttendanceRequest } from './attendanceTypes'

export type { AttendanceRecord, ClassAttendance, MarkAttendanceRequest } from './attendanceTypes'

export const attendanceApi = {
  markAttendance: async (request: MarkAttendanceRequest) => {
    const { data } = await api.post<{ data: ClassAttendance }>('/attendance', request)
    return data.data
  },

  getClassAttendance: async (classId: string, date: string, sectionId?: string) => {
    const { data } = await api.get<{ data: AttendanceRecord[] }>('/attendance/class/' + classId, {
      params: { date, sectionId },
    })
    return data.data
  },

  getStudentAttendance: async (studentId: string, month: number, year: number) => {
    const { data } = await api.get<{ data: AttendanceRecord[] }>('/attendance/student/' + studentId, {
      params: { month, year },
    })
    return data.data
  },

  delete: async (id: string) => {
    await api.delete('/attendance/' + id)
  },
}
