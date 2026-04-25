import api from '@/lib/axios'
import type { Student, StudentDocument } from './studentTypes'

interface BackendStudent {
  id: string
  admissionNo?: string
  rollNo?: string
  name: string
  dateOfBirth?: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  classId?: string
  className?: string
  sectionId?: string
  sectionName?: string
  academicYear: string
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DELETED'
  photoUrl?: string
  fatherName?: string
  motherName?: string
  guardianName?: string
  parentMobile?: string
  parentEmail?: string
  address?: string
  admissionDate?: string
  createdAt: string
  updatedAt: string
}

interface BackendStudentDocument {
  id: string
  studentId: string
  documentType: string
  fileUrl: string
  fileName?: string
  fileType?: string
  fileSize?: number
  uploadedAt: string
  uploadedBy?: string
}

const splitStudentName = (name: string) => {
  const trimmedName = name.trim()
  if (!trimmedName) {
    return { firstName: '', lastName: '' }
  }

  const [firstName, ...rest] = trimmedName.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

const mapBackendStudent = (student: BackendStudent): Student => {
  const { firstName, lastName } = splitStudentName(student.name)

  return {
    id: student.id,
    firstName,
    lastName,
    email: '',
    phone: '',
    dateOfBirth: student.dateOfBirth ?? '',
    gender: student.gender,
    address: student.address ?? '',
    classId: student.classId ?? '',
    className: student.className,
    sectionId: student.sectionId,
    sectionName: student.sectionName,
    rollNumber: student.rollNo ?? student.admissionNo ?? '',
    academicYear: student.academicYear,
    status: student.status === 'DELETED' ? 'INACTIVE' : student.status,
    admissionDate: student.admissionDate ?? '',
    parentName: student.guardianName ?? student.fatherName ?? student.motherName ?? '',
    parentPhone: student.parentMobile ?? '',
    parentEmail: student.parentEmail ?? '',
    profileImageUrl: student.photoUrl,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  }
}

type StudentPayload = Partial<Student> & {
  firstName: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address: string
  classId: string
  academicYear: string
  parentName: string
  parentPhone: string
}

const mapStudentPayload = (student: StudentPayload | Partial<Student>) => ({
  name: `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim(),
  rollNo: student.rollNumber || null,
  dateOfBirth: student.dateOfBirth || null,
  gender: student.gender,
  classId: student.classId || null,
  sectionId: student.sectionId || null,
  academicYear: student.academicYear,
  parentMobile: student.parentPhone || '',
  parentEmail: student.parentEmail || '',
  address: student.address || '',
  guardianName: student.parentName || '',
  admissionDate: student.admissionDate || null,
  photoUrl: student.profileImageUrl || null,
})

const mapStudentDocument = (document: BackendStudentDocument): StudentDocument => ({
  id: document.id,
  studentId: document.studentId,
  documentType: document.documentType,
  fileUrl: document.fileUrl,
  fileName: document.fileName,
  fileType: document.fileType,
  fileSize: document.fileSize,
  uploadedAt: document.uploadedAt,
  uploadedBy: document.uploadedBy,
})

export const studentApi = {
  getAll: async (params?: {
    classId?: string
    academicYear?: string
    status?: string
    page?: number
    size?: number
  }) => {
    const { data } = await api.get<{ data: { content: BackendStudent[]; totalElements: number; totalPages: number } }>('/students', { params })
    return {
      ...data.data,
      content: data.data.content.map(mapBackendStudent),
    }
  },

  getById: async (id: string) => {
    const { data } = await api.get<{ data: BackendStudent }>(`/students/${id}`)
    return mapBackendStudent(data.data)
  },

  create: async (student: StudentPayload) => {
    const { data } = await api.post<{ data: BackendStudent }>('/students', mapStudentPayload(student))
    return mapBackendStudent(data.data)
  },

  update: async (id: string, student: Partial<Student>) => {
    const { data } = await api.put<{ data: BackendStudent }>(`/students/${id}`, mapStudentPayload(student))
    return mapBackendStudent(data.data)
  },

  delete: async (id: string) => {
    await api.delete(`/students/${id}`)
  },

  search: async (query: string) => {
    const { data } = await api.get<{ data: BackendStudent[] }>('/students/search', { params: { query } })
    return data.data.map(mapBackendStudent)
  },

  getDocuments: async (studentId: string) => {
    const { data } = await api.get<{ data: BackendStudentDocument[] }>(`/students/${studentId}/documents`)
    return data.data.map(mapStudentDocument)
  },

  uploadDocument: async (document: {
    studentId: string
    documentType: string
    fileUrl: string
    fileName?: string
    fileType?: string
    fileSize?: number
  }) => {
    const { data } = await api.post<{ data: BackendStudentDocument }>('/students/documents', document)
    return mapStudentDocument(data.data)
  },

  deleteDocument: async (studentId: string, documentId: string) => {
    await api.delete(`/students/${studentId}/documents/${documentId}`)
  },

  promote: async (classId: string, fromYear: string, toYear: string) => {
    await api.post('/students/promote', null, {
      params: { classId, fromYear, toYear },
    })
  },
}
