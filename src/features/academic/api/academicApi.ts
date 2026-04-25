import api from '@/lib/axios'

export interface AcademicSection {
  id: string
  classId: string
  name: string
}

export interface AcademicClass {
  id: string
  name: string
  sections: AcademicSection[]
}

export const academicApi = {
  getClasses: async () => {
    const { data } = await api.get<{ data: AcademicClass[] }>('/academic/classes')
    return data.data
  },
}
