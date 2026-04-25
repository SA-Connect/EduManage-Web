import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { CheckCircle, XCircle, Clock, AlertCircle, Search, Loader2, Save } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { attendanceApi, type AttendanceRecord } from '@/features/attendance/api/attendanceApi'
import { studentApi, type Student } from '@/features/student/api/studentApi'
import { academicApi, type AcademicClass } from '@/features/academic/api/academicApi'
import { toast } from 'sonner'

const statusConfig = {
  PRESENT: { label: 'Present', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  ABSENT: { label: 'Absent', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
  LATE: { label: 'Late', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  EXCUSED: { label: 'Excused', icon: AlertCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
}

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([])
  const [academicClasses, setAcademicClasses] = useState<AcademicClass[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('ALL')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, AttendanceRecord['status']>>(new Map())
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle')
  const [activeTab, setActiveTab] = useState('mark')

  const classes = academicClasses.map((academicClass) => ({
    id: academicClass.id,
    name: academicClass.name,
  }))

  const sections = academicClasses.find((academicClass) => academicClass.id === selectedClass)?.sections ?? []

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.trim().toLowerCase()
    const matchesClass = selectedClass !== '' && student.classId === selectedClass
    const matchesSection =
      selectedSection === 'ALL' ||
      (selectedSection === 'NO_SECTION' ? !student.sectionId : student.sectionId === selectedSection)
    const matchesSearch =
      searchQuery === '' ||
      fullName.includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesClass && matchesSection && matchesSearch
  })

  const stats = {
    present: Array.from(attendanceRecords.values()).filter((s) => s === 'PRESENT').length,
    absent: Array.from(attendanceRecords.values()).filter((s) => s === 'ABSENT').length,
    late: Array.from(attendanceRecords.values()).filter((s) => s === 'LATE').length,
    excused: Array.from(attendanceRecords.values()).filter((s) => s === 'EXCUSED').length,
    total: filteredStudents.length,
  }

  const markedStudents = filteredStudents.filter((student) => attendanceRecords.has(student.id)).length
  const completionPercentage = filteredStudents.length === 0 ? 0 : Math.round((markedStudents / filteredStudents.length) * 100)
  const hasUnsavedChanges = saveState === 'dirty' || saveState === 'error'

  useEffect(() => {
    loadAcademicClasses()
    loadStudents()
  }, [])

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadAttendance()
    } else {
      setAttendanceRecords(new Map())
    }
  }, [selectedClass, selectedSection, selectedDate])

  useEffect(() => {
    setSelectedSection('ALL')
  }, [selectedClass])

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
    setLoadingStudents(true)
    try {
      const data = await studentApi.getAll({ status: 'ACTIVE', size: 500 })
      setStudents(data.content)
    } catch (error) {
      console.error('Failed to load students:', error)
      setStudents([])
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadAttendance = async () => {
    setLoadingAttendance(true)
    try {
      const sectionId = selectedSection === 'ALL' || selectedSection === 'NO_SECTION' ? undefined : selectedSection
      const records = await attendanceApi.getClassAttendance(selectedClass, selectedDate, sectionId)
      const recordMap = new Map<string, AttendanceRecord['status']>()
      records.forEach((record) => {
        recordMap.set(record.studentId, record.status)
      })
      setAttendanceRecords(recordMap)
      setSaveState('idle')
    } catch {
      setAttendanceRecords(new Map())
      setSaveState('idle')
    } finally {
      setLoadingAttendance(false)
    }
  }

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendanceRecords((prev) => {
      const newMap = new Map(prev)
      newMap.set(studentId, status)
      return newMap
    })
    setSaveState('dirty')
  }

  const handleBulkStatus = (status: AttendanceRecord['status']) => {
    setAttendanceRecords((prev) => {
      const newMap = new Map(prev)
      filteredStudents.forEach((student) => {
        newMap.set(student.id, status)
      })
      return newMap
    })
    setSaveState('dirty')
  }

  const handleSave = async () => {
    if (!selectedClass || !selectedDate) return

    const selectedClassName = classes.find((cls) => cls.id === selectedClass)?.name || 'Selected class'
    const selectedSectionName =
      selectedSection === 'ALL'
        ? 'All sections'
        : sections.find((section) => section.id === selectedSection)?.name || 'Selected section'

    const loadingToastId = toast.loading('Saving attendance...', {
      description: `${selectedClassName} • ${selectedSectionName} • ${selectedDate}`,
    })

    setSaving(true)
    setSaveState('saving')
    try {
      const records = Array.from(attendanceRecords.entries()).map(([studentId, status]) => ({
        studentId,
        status,
      }))

      const savedAttendance = await attendanceApi.markAttendance({
        classId: selectedClass,
        sectionId: selectedSection === 'ALL' || selectedSection === 'NO_SECTION' ? undefined : selectedSection,
        date: selectedDate,
        records,
      })
      await loadAttendance()
      const savedAt = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      setLastSavedAt(savedAt)
      setSaveState('saved')

      toast.success('Attendance saved', {
        id: loadingToastId,
        description: `${savedAttendance.totalStudents} records saved for ${selectedClassName} • ${selectedSectionName} on ${selectedDate}.`,
      })
    } catch (error) {
      console.error('Failed to save attendance:', error)
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'The attendance could not be saved. Please try again.'
      toast.error('Save failed', {
        id: loadingToastId,
        description: message,
      })
      setSaveState('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student attendance daily</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-2xl font-bold">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Excused</p>
                <p className="text-2xl font-bold">{stats.excused}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="history">View History</TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>Select class, section, and date to mark attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedClass}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Sections</SelectItem>
                    {sections.length > 0 ? sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="NO_SECTION">No Section Assigned</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-[200px]"
                />

                <Button
                  onClick={handleSave}
                  disabled={saving || !selectedClass || filteredStudents.length === 0 || markedStudents === 0 || !hasUnsavedChanges}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Attendance' : 'Saved'}
                </Button>
              </div>

              {selectedClass ? (
                <Alert className="border-primary/20 bg-primary/5">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle className="flex items-center gap-2">
                    Attendance save status
                    <Badge variant={saveState === 'saved' ? 'default' : hasUnsavedChanges ? 'secondary' : 'outline'}>
                      {saving
                        ? 'Saving'
                        : saveState === 'saved'
                          ? 'Saved'
                          : hasUnsavedChanges
                            ? 'Unsaved changes'
                            : 'Up to date'}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="space-y-3">
                    <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        {saving
                          ? 'Saving attendance to the backend now.'
                          : hasUnsavedChanges
                            ? 'You have changes that are not saved yet.'
                            : lastSavedAt
                              ? `Attendance is saved. Last saved at ${lastSavedAt}.`
                              : 'Mark attendance and click Save Attendance to persist it.'}
                      </span>
                      <span className="text-muted-foreground">
                        {markedStudents} of {filteredStudents.length} students marked
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Completion</span>
                        <span>{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex min-h-6 items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {!selectedClass
                    ? 'Choose a class and section to begin.'
                    : searchQuery
                      ? `${filteredStudents.length} students match your current search`
                      : `${filteredStudents.length} students in current view`}
                </span>
                {hasUnsavedChanges && !saving ? (
                  <span className="text-amber-600">Unsaved changes</span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus('PRESENT')} disabled={filteredStudents.length === 0}>
                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus('ABSENT')} disabled={filteredStudents.length === 0}>
                  <XCircle className="mr-1 h-4 w-4 text-red-500" />
                  Mark All Absent
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkStatus('LATE')} disabled={filteredStudents.length === 0}>
                  <Clock className="mr-1 h-4 w-4 text-amber-500" />
                  Mark All Late
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {loadingStudents || loadingAttendance ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {!selectedClass ? (
                      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        Select a class to load students from the backend
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        No students were returned from the backend for this class and section
                      </div>
                    ) : (
                      filteredStudents.map((student) => {
                        const currentStatus = attendanceRecords.get(student.id)
                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium">
                                {student.rollNumber}
                              </div>
                              <div>
                                <p className="font-medium">{`${student.firstName} ${student.lastName}`.trim()}</p>
                                <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              {(Object.keys(statusConfig) as AttendanceRecord['status'][]).map(
                                (status) => {
                                  const config = statusConfig[status]
                                  const Icon = config.icon
                                  const isActive = currentStatus === status
                                  return (
                                    <Button
                                      key={status}
                                      variant={isActive ? 'default' : 'ghost'}
                                      size="sm"
                                      onClick={() => handleStatusChange(student.id, status)}
                                      className={`h-8 w-8 p-0 ${isActive ? config.color : ''}`}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </Button>
                                  )
                                }
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View past attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Select a class and date to view historical attendance
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
