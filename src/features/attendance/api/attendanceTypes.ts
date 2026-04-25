export interface AttendanceRecord {
  id: string
  studentId: string
  studentName?: string
  rollNumber?: string
  classId: string
  className?: string
  sectionId?: string
  sectionName?: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  markedBy?: string
}

export interface ClassAttendance {
  classId: string
  className?: string
  sectionId?: string
  sectionName?: string
  date: string
  attendanceRecords: AttendanceRecord[]
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
}

export interface MarkAttendanceRequest {
  classId: string
  sectionId?: string
  date: string
  records: {
    studentId: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  }[]
}
