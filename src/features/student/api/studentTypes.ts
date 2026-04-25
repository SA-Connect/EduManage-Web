export interface Student {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address: string
  classId: string
  className?: string
  sectionId?: string
  sectionName?: string
  rollNumber: string
  academicYear: string
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED'
  admissionDate: string
  parentName: string
  parentPhone: string
  parentEmail?: string
  emergencyContact?: string
  bloodGroup?: string
  nationality?: string
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address: string
  classId: string
  sectionId?: string
  rollNumber: string
  academicYear: string
  parentName: string
  parentPhone: string
  parentEmail?: string
  profileImageUrl?: string
}

export interface StudentDocument {
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
