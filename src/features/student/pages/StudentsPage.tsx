import { useEffect, useState } from 'react'
import {
  ArrowUpCircle,
  Eye,
  FileText,
  GraduationCap,
  ImageIcon,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { studentApi, type Student } from '@/features/student/api/studentApi'
import type { StudentDocument } from '@/features/student/api/studentTypes'
import { academicApi, type AcademicClass } from '@/features/academic/api/academicApi'

const statusColors = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50',
  INACTIVE: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50',
  GRADUATED: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  TRANSFERRED: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
}

interface StudentFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | ''
  address: string
  classId: string
  sectionId: string
  rollNumber: string
  academicYear: string
  parentName: string
  parentPhone: string
  parentEmail: string
  photoUrl: string
}

interface DocumentFormData {
  documentType: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: string
}

interface PromotionFormData {
  classId: string
  fromYear: string
  toYear: string
}

const defaultStudentForm: StudentFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  classId: '',
  sectionId: '',
  rollNumber: '',
  academicYear: '2024-25',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  photoUrl: '',
}

const defaultDocumentForm: DocumentFormData = {
  documentType: '',
  fileUrl: '',
  fileName: '',
  fileType: '',
  fileSize: '',
}

const defaultPromotionForm: PromotionFormData = {
  classId: '',
  fromYear: '2024-25',
  toYear: '2025-26',
}

const shortId = (value?: string) => (value ? value.slice(0, 8) : '-')

const getStudentName = (student: Student) => `${student.firstName} ${student.lastName}`.trim()

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [academicClasses, setAcademicClasses] = useState<AcademicClass[]>([])
  const [loading, setLoading] = useState(false)
  const [savingStudent, setSavingStudent] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null)
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [promotingStudents, setPromotingStudents] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>(defaultStudentForm)
  const [documentForm, setDocumentForm] = useState<DocumentFormData>(defaultDocumentForm)
  const [promotionForm, setPromotionForm] = useState<PromotionFormData>(defaultPromotionForm)

  const classes = academicClasses.map((academicClass) => ({
    id: academicClass.id,
    name: academicClass.name,
  }))

  const sectionsForForm = academicClasses.find((academicClass) => academicClass.id === formData.classId)?.sections ?? []

  const filteredStudents = students.filter((student) => {
    const name = getStudentName(student).toLowerCase()
    const normalizedQuery = searchQuery.toLowerCase()
    const matchesSearch =
      normalizedQuery === '' ||
      name.includes(normalizedQuery) ||
      student.rollNumber.toLowerCase().includes(normalizedQuery) ||
      student.parentPhone.includes(searchQuery)

    const matchesClass = selectedClass === 'ALL' || student.classId === selectedClass
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter

    return matchesSearch && matchesClass && matchesStatus
  })

  const stats = {
    total: students.length,
    active: students.filter((student) => student.status === 'ACTIVE').length,
    inactive: students.filter((student) => student.status === 'INACTIVE').length,
    male: students.filter((student) => student.gender === 'MALE').length,
    female: students.filter((student) => student.gender === 'FEMALE').length,
  }

  const isStudentFormValid =
    formData.firstName.trim() !== '' &&
    formData.dateOfBirth !== '' &&
    formData.gender !== '' &&
    formData.address.trim() !== '' &&
    formData.classId !== '' &&
    formData.sectionId !== '' &&
    formData.rollNumber.trim() !== '' &&
    formData.academicYear.trim() !== '' &&
    formData.parentName.trim() !== '' &&
    formData.parentPhone.trim() !== ''

  useEffect(() => {
    loadAcademicClasses()
    loadStudents()
  }, [])

  useEffect(() => {
    if (viewingStudent) {
      loadDocuments(viewingStudent.id)
    } else {
      setDocuments([])
    }
  }, [viewingStudent])

  const loadAcademicClasses = async () => {
    try {
      const data = await academicApi.getClasses()
      setAcademicClasses(data)
    } catch (error) {
      console.error('Failed to load classes:', error)
      setAcademicClasses([])
    }
  }

  const loadStudents = async () => {
    setLoading(true)
    try {
      const data = await studentApi.getAll({ size: 500 })
      setStudents(data.content)
    } catch (error) {
      console.error('Failed to load students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async (studentId: string) => {
    setLoadingDocuments(true)
    try {
      const data = await studentApi.getDocuments(studentId)
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load documents:', error)
      setDocuments([])
    } finally {
      setLoadingDocuments(false)
    }
  }

  const resetStudentForm = () => {
    setFormData(defaultStudentForm)
    setEditingStudent(null)
  }

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
      return
    }
    setSelectedStudents(new Set(filteredStudents.map((student) => student.id)))
  }

  const handleSelectStudent = (id: string) => {
    const next = new Set(selectedStudents)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedStudents(next)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!isStudentFormValid) {
      return
    }
    setSavingStudent(true)

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        classId: formData.classId,
        sectionId: formData.sectionId || undefined,
        rollNumber: formData.rollNumber,
        academicYear: formData.academicYear,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail || undefined,
        profileImageUrl: formData.photoUrl || undefined,
        admissionDate: formData.academicYear ? `${formData.academicYear.slice(0, 4)}-04-01` : '',
      }

      if (editingStudent) {
        await studentApi.update(editingStudent.id, payload)
      } else {
        await studentApi.create(payload)
      }

      await loadStudents()
      setIsStudentDialogOpen(false)
      resetStudentForm()
    } catch (error) {
      console.error('Failed to save student:', error)
    } finally {
      setSavingStudent(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    setLoading(true)
    try {
      await studentApi.delete(id)
      await loadStudents()
    } catch (error) {
      console.error('Failed to delete student:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreateDialog = () => {
    resetStudentForm()
    setIsStudentDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      address: student.address,
      classId: student.classId,
      sectionId: student.sectionId || '',
      rollNumber: student.rollNumber,
      academicYear: student.academicYear,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      photoUrl: student.profileImageUrl || '',
    })
    setIsStudentDialogOpen(true)
  }

  const handleUploadDocument = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!viewingStudent) return

    setUploadingDocument(true)
    try {
      await studentApi.uploadDocument({
        studentId: viewingStudent.id,
        documentType: documentForm.documentType,
        fileUrl: documentForm.fileUrl,
        fileName: documentForm.fileName || undefined,
        fileType: documentForm.fileType || undefined,
        fileSize: documentForm.fileSize ? Number(documentForm.fileSize) : undefined,
      })
      setDocumentForm(defaultDocumentForm)
      await loadDocuments(viewingStudent.id)
    } catch (error) {
      console.error('Failed to upload document:', error)
    } finally {
      setUploadingDocument(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!viewingStudent) return
    try {
      await studentApi.deleteDocument(viewingStudent.id, documentId)
      await loadDocuments(viewingStudent.id)
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const handlePromoteStudents = async (event: React.FormEvent) => {
    event.preventDefault()
    setPromotingStudents(true)
    try {
      await studentApi.promote(promotionForm.classId, promotionForm.fromYear, promotionForm.toYear)
      await loadStudents()
      setIsPromotionDialogOpen(false)
      setPromotionForm(defaultPromotionForm)
    } catch (error) {
      console.error('Failed to promote students:', error)
    } finally {
      setPromotingStudents(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage student profiles, documents, filters, and year-end promotion</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPromotionDialogOpen(true)}>
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Promote Students
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Male</p>
                <p className="text-2xl font-bold">{stats.male}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                <User className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Female</p>
                <p className="text-2xl font-bold">{stats.female}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>All data below is loaded from the backend only</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll number, or parent phone..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="GRADUATED">Graduated</SelectItem>
                <SelectItem value="TRANSFERRED">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <Checkbox
                        checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Roll No.</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Class</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Parent Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="w-12 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                        No students returned from the backend
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedStudents.has(student.id)}
                            onCheckedChange={() => handleSelectStudent(student.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                              {student.profileImageUrl ? (
                                <img src={student.profileImageUrl} alt={getStudentName(student)} className="h-full w-full object-cover" />
                              ) : (
                                <span className="font-medium text-primary">{student.firstName.charAt(0) || 'S'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{getStudentName(student)}</p>
                              <p className="text-sm text-muted-foreground">Parent: {student.parentName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{student.rollNumber}</td>
                        <td className="px-4 py-3">{student.className || `Class ${shortId(student.classId)}`}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{student.parentPhone}</p>
                            <p className="text-sm text-muted-foreground">{student.parentEmail || '-'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={statusColors[student.status]}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingStudent(student)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(student)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isStudentDialogOpen}
        onOpenChange={(open) => {
          setIsStudentDialogOpen(open)
          if (!open) resetStudentForm()
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
            <DialogDescription>Update the real student profile data stored in the backend</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input type="date" value={formData.dateOfBirth} onChange={(event) => setFormData({ ...formData, dateOfBirth: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as StudentFormData['gender'] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} required />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select value={formData.classId} onValueChange={(value) => setFormData({ ...formData, classId: value, sectionId: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section</label>
                <Select value={formData.sectionId} onValueChange={(value) => setFormData({ ...formData, sectionId: value })} disabled={!formData.classId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionsForForm.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll Number</label>
                <Input value={formData.rollNumber} onChange={(event) => setFormData({ ...formData, rollNumber: event.target.value })} placeholder="001" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Input value={formData.academicYear} onChange={(event) => setFormData({ ...formData, academicYear: event.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Photo URL</label>
                <Input value={formData.photoUrl} onChange={(event) => setFormData({ ...formData, photoUrl: event.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-medium">Parent / Guardian Information</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parent Name</label>
                  <Input value={formData.parentName} onChange={(event) => setFormData({ ...formData, parentName: event.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parent Phone</label>
                  <Input value={formData.parentPhone} onChange={(event) => setFormData({ ...formData, parentPhone: event.target.value })} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Parent Email</label>
                  <Input type="email" value={formData.parentEmail} onChange={(event) => setFormData({ ...formData, parentEmail: event.target.value })} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingStudent || !isStudentFormValid}>
                {savingStudent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingStudent ? 'Update Student' : 'Create Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Year-End Promotion</DialogTitle>
            <DialogDescription>Promote all active students in a class from one academic year to the next</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePromoteStudents} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={promotionForm.classId} onValueChange={(value) => setPromotionForm({ ...promotionForm, classId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Year</label>
                <Input value={promotionForm.fromYear} onChange={(event) => setPromotionForm({ ...promotionForm, fromYear: event.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Year</label>
                <Input value={promotionForm.toYear} onChange={(event) => setPromotionForm({ ...promotionForm, toYear: event.target.value })} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={promotingStudents || !promotionForm.classId}>
                {promotingStudents ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Promote Students
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          {viewingStudent ? (
            <>
              <DialogHeader>
                <DialogTitle>{getStudentName(viewingStudent)}</DialogTitle>
                <DialogDescription>Profile and student documents stored in the backend</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                      {viewingStudent.profileImageUrl ? (
                        <img src={viewingStudent.profileImageUrl} alt={getStudentName(viewingStudent)} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-10 w-10" />
                          <span className="text-xs">No photo</span>
                        </div>
                      )}
                    </div>

                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{viewingStudent.rollNumber || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Academic Year</p>
                        <p className="font-medium">{viewingStudent.academicYear}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Class</p>
                        <p className="font-medium">{viewingStudent.className || `Class ${shortId(viewingStudent.classId)}`}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Section</p>
                        <p className="font-medium">{viewingStudent.sectionName || shortId(viewingStudent.sectionId)}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Parent Name</p>
                        <p className="font-medium">{viewingStudent.parentName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Parent Phone</p>
                        <p className="font-medium">{viewingStudent.parentPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Parent Email</p>
                        <p className="font-medium">{viewingStudent.parentEmail || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{viewingStudent.dateOfBirth || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{viewingStudent.address || '-'}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Upload Document</CardTitle>
                      <CardDescription>Save document metadata and URL against this student</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUploadDocument} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Document Type</label>
                            <Input value={documentForm.documentType} onChange={(event) => setDocumentForm({ ...documentForm, documentType: event.target.value })} placeholder="AADHAAR / TC / BIRTH_CERTIFICATE" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">File URL</label>
                            <Input value={documentForm.fileUrl} onChange={(event) => setDocumentForm({ ...documentForm, fileUrl: event.target.value })} placeholder="https://..." required />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">File Name</label>
                            <Input value={documentForm.fileName} onChange={(event) => setDocumentForm({ ...documentForm, fileName: event.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">File Type</label>
                            <Input value={documentForm.fileType} onChange={(event) => setDocumentForm({ ...documentForm, fileType: event.target.value })} placeholder="application/pdf" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">File Size</label>
                            <Input value={documentForm.fileSize} onChange={(event) => setDocumentForm({ ...documentForm, fileSize: event.target.value })} placeholder="102400" />
                          </div>
                        </div>
                        <Button type="submit" disabled={uploadingDocument}>
                          {uploadingDocument ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                          Upload Document
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Uploaded Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loadingDocuments ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : documents.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                          No documents uploaded for this student yet
                        </div>
                      ) : (
                        <ScrollArea className="h-[260px] pr-4">
                          <div className="space-y-3">
                            {documents.map((document) => (
                              <div key={document.id} className="flex items-center justify-between rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{document.documentType}</p>
                                    <p className="text-sm text-muted-foreground">{document.fileName || document.fileUrl}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={document.fileUrl} target="_blank" rel="noreferrer">
                                      View
                                    </a>
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteDocument(document.id)}>
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
