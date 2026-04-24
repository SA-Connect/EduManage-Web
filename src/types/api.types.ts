export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errorCode?: string
  timestamp: string
  pagination?: PageMeta
}

export interface PageMeta {
  page: number
  size: number
  totalElements?: number
  totalPages: number
}

export type Role =
  | 'SUPER_ADMIN'
  | 'ORGANIZATION_ADMIN'
  | 'TEACHER'
  | 'ACCOUNTANT'
  | 'HR_MANAGER'
  | 'LIBRARIAN'
  | 'PARENT'
  | 'STUDENT'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  role: Role
  organizationId: string
  organizationName?: string
}

export interface LoginRequest {
  email: string
  password: string
  organizationId?: string
}

export interface LoginResponse {
  token: string
  userId: string
  email: string
  firstName: string
  lastName: string
  role: Role
  organizationId: string
}