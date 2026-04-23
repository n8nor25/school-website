'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Save,
  Loader2,
  Search,
  TrendingUp,
  UserX,
  Building2,
  Users,
  ClipboardCheck,
  Pencil,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'

// --- Types ---
type AttendanceStatus = 'حاضر' | 'غائب' | 'متأخر' | 'إذن'

interface Classroom {
  id: string
  name: string
  grade: string
  section: string
  students: { id: string; name: string; status: string }[]
  _count: { students: number }
}

interface Student {
  id: string
  name: string
  classRoom: { id: string; name: string; grade: string; section: string } | null
  status: string
}

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: AttendanceStatus
  note: string | null
  student: {
    id: string
    name: string
    classRoom: { id: string; name: string; grade: string; section: string } | null
  }
}

interface AttendanceEntry {
  studentId: string
  studentName: string
  classroomName: string
  status: AttendanceStatus
  note: string
}

// --- Constants ---
const STATUS_CONFIG: Record<AttendanceStatus, { color: string; bgActive: string; bgInactive: string; borderActive: string; borderInactive: string; icon: React.ReactNode; badgeClass: string }> = {
  'حاضر': {
    color: 'text-emerald-700 dark:text-emerald-300',
    bgActive: 'bg-emerald-500 hover:bg-emerald-600',
    bgInactive: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900',
    borderActive: 'border-emerald-500',
    borderInactive: 'border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-4 h-4" />,
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  'غائب': {
    color: 'text-red-700 dark:text-red-300',
    bgActive: 'bg-red-500 hover:bg-red-600',
    bgInactive: 'bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900',
    borderActive: 'border-red-500',
    borderInactive: 'border-red-200 dark:border-red-800',
    icon: <XCircle className="w-4 h-4" />,
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800',
  },
  'متأخر': {
    color: 'text-amber-700 dark:text-amber-300',
    bgActive: 'bg-amber-500 hover:bg-amber-600',
    bgInactive: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900',
    borderActive: 'border-amber-500',
    borderInactive: 'border-amber-200 dark:border-amber-800',
    icon: <Clock className="w-4 h-4" />,
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  'إذن': {
    color: 'text-sky-700 dark:text-sky-300',
    bgActive: 'bg-sky-500 hover:bg-sky-600',
    bgInactive: 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950 dark:hover:bg-sky-900',
    borderActive: 'border-sky-500',
    borderInactive: 'border-sky-200 dark:border-sky-800',
    icon: <ShieldCheck className="w-4 h-4" />,
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  },
}

const ALL_STATUSES: AttendanceStatus[] = ['حاضر', 'غائب', 'متأخر', 'إذن']

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatDateArabic(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// --- Component ---
export default function AttendanceManager() {
  // Core state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClassId, setSelectedClassId] = useState<string>('all')
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([])
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)

  // History filters
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all')
  const [historyClassFilter, setHistoryClassFilter] = useState<string>('all')
  const [historyStartDate, setHistoryStartDate] = useState<string>('')
  const [historyEndDate, setHistoryEndDate] = useState<string>('')

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('حاضر')
  const [editNote, setEditNote] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Stats
  const [weeklyRate, setWeeklyRate] = useState<number>(0)
  const [mostAbsentStudent, setMostAbsentStudent] = useState<string>('')
  const [mostAbsentClass, setMostAbsentClass] = useState<string>('')

  // Calendar open state
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Fetch classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch('/api/classrooms')
        const data = await res.json()
        if (Array.isArray(data)) {
          setClassrooms(data)
        }
      } catch {
        toast.error('حدث خطأ في جلب الفصول')
      }
    }
    fetchClassrooms()
  }, [])

  // Load attendance data for selected date/class
  const loadAttendance = useCallback(async () => {
    setLoading(true)
    try {
      const dateStr = formatDate(selectedDate)

      // Fetch students for the selected class
      const studentsUrl =
        selectedClassId === 'all'
          ? '/api/students'
          : `/api/students?classRoomId=${selectedClassId}`
      const studentsRes = await fetch(studentsUrl)
      const studentsData: Student[] = await studentsRes.json()

      // Fetch existing attendance for this date
      const attendanceUrl =
        selectedClassId === 'all'
          ? `/api/attendance?date=${dateStr}`
          : `/api/attendance?date=${dateStr}&classRoomId=${selectedClassId}`
      const attendanceRes = await fetch(attendanceUrl)
      const attendanceData: AttendanceRecord[] = await attendanceRes.json()

      // Build a map of existing attendance
      const attendanceMap = new Map<string, AttendanceRecord>()
      attendanceData.forEach((record) => {
        attendanceMap.set(record.studentId, record)
      })

      // Build attendance entries
      const entries: AttendanceEntry[] = studentsData
        .filter((s) => s.status === 'نشط')
        .map((student) => {
          const existing = attendanceMap.get(student.id)
          return {
            studentId: student.id,
            studentName: student.name,
            classroomName: student.classRoom?.name || 'غير محدد',
            status: (existing?.status as AttendanceStatus) || 'حاضر',
            note: existing?.note || '',
          }
        })

      setAttendanceEntries(entries)
    } catch {
      toast.error('حدث خطأ في جلب بيانات الحضور')
    } finally {
      setLoading(false)
    }
  }, [selectedDate, selectedClassId])

  // Load attendance history
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const params = new URLSearchParams()
      if (historyStartDate) params.set('startDate', historyStartDate)
      if (historyEndDate) params.set('endDate', historyEndDate)
      if (historyClassFilter !== 'all') params.set('classRoomId', historyClassFilter)
      if (historyStatusFilter !== 'all') params.set('status', historyStatusFilter)

      const res = await fetch(`/api/attendance?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setAttendanceHistory(data.slice(0, 50))
      }
    } catch {
      toast.error('حدث خطأ في جلب سجل الحضور')
    } finally {
      setHistoryLoading(false)
    }
  }, [historyStartDate, historyEndDate, historyClassFilter, historyStatusFilter])

  // Load quick stats
  const loadQuickStats = useCallback(async () => {
    try {
      // Weekly attendance rate
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - 6)
      const weekStartStr = formatDate(weekStart)
      const todayStr = formatDate(today)

      const weekRes = await fetch(
        `/api/attendance?startDate=${weekStartStr}&endDate=${todayStr}`
      )
      const weekData: AttendanceRecord[] = await weekRes.json()

      if (weekData.length > 0) {
        const presentCount = weekData.filter(
          (r) => r.status === 'حاضر' || r.status === 'متأخر'
        ).length
        setWeeklyRate(Math.round((presentCount / weekData.length) * 100))
      }

      // Most absent student
      const absentCounts = new Map<string, { name: string; count: number }>()
      weekData
        .filter((r) => r.status === 'غائب')
        .forEach((r) => {
          const current = absentCounts.get(r.studentId) || {
            name: r.student.name,
            count: 0,
          }
          current.count++
          absentCounts.set(r.studentId, current)
        })

      let topAbsentStudent = ''
      let topAbsentCount = 0
      absentCounts.forEach((val) => {
        if (val.count > topAbsentCount) {
          topAbsentCount = val.count
          topAbsentStudent = val.name
        }
      })
      setMostAbsentStudent(
        topAbsentStudent ? `${topAbsentStudent} (${topAbsentCount})` : 'لا يوجد'
      )

      // Most absent class
      const classAbsentCounts = new Map<string, { name: string; count: number }>()
      weekData
        .filter((r) => r.status === 'غائب' && r.student.classRoom)
        .forEach((r) => {
          const classId = r.student.classRoom!.id
          const current = classAbsentCounts.get(classId) || {
            name: r.student.classRoom!.name,
            count: 0,
          }
          current.count++
          classAbsentCounts.set(classId, current)
        })

      let topAbsentClass = ''
      let topClassCount = 0
      classAbsentCounts.forEach((val) => {
        if (val.count > topClassCount) {
          topClassCount = val.count
          topAbsentClass = val.name
        }
      })
      setMostAbsentClass(topAbsentClass || 'لا يوجد')
    } catch {
      // silently fail for stats
    }
  }, [])

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  useEffect(() => {
    loadQuickStats()
  }, [loadQuickStats])

  // Handlers
  const updateEntryStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, status } : entry
      )
    )
  }

  const updateEntryNote = (studentId: string, note: string) => {
    setAttendanceEntries((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, note } : entry
      )
    )
  }

  const handleSaveAll = async () => {
    if (attendanceEntries.length === 0) {
      toast.error('لا يوجد طلاب لحفظ الحضور')
      return
    }

    setSaving(true)
    try {
      const dateStr = formatDate(selectedDate)
      const records = attendanceEntries.map((entry) => ({
        studentId: entry.studentId,
        date: dateStr,
        status: entry.status,
        note: entry.note || undefined,
      }))

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`تم حفظ الحضور بنجاح (${data.count || records.length} سجل)`)
        loadAttendance()
        loadHistory()
        loadQuickStats()
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في حفظ الحضور')
      }
    } catch {
      toast.error('حدث خطأ في حفظ الحضور')
    } finally {
      setSaving(false)
    }
  }

  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record)
    setEditStatus(record.status)
    setEditNote(record.note || '')
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRecord) return
    setEditSaving(true)
    try {
      const dateStr = editingRecord.date
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: editingRecord.studentId,
          date: dateStr,
          status: editStatus,
          note: editNote || undefined,
        }),
      })
      if (res.ok) {
        toast.success('تم تحديث سجل الحضور')
        setEditDialogOpen(false)
        loadHistory()
        loadAttendance()
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في التحديث')
      }
    } catch {
      toast.error('حدث خطأ في التحديث')
    } finally {
      setEditSaving(false)
    }
  }

  // Compute summary
  const summary = {
    present: attendanceEntries.filter((e) => e.status === 'حاضر').length,
    absent: attendanceEntries.filter((e) => e.status === 'غائب').length,
    late: attendanceEntries.filter((e) => e.status === 'متأخر').length,
    excused: attendanceEntries.filter((e) => e.status === 'إذن').length,
    total: attendanceEntries.length,
  }

  const attendanceRate =
    summary.total > 0
      ? Math.round(((summary.present + summary.late) / summary.total) * 100)
      : 0

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          إدارة الحضور والغياب
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          تسجيل ومتابعة حضور الطلاب يومياً
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نسبة الحضور هذا الأسبوع
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {weeklyRate}%
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                أكثر الطلاب غياباً
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-[180px]">
                {mostAbsentStudent}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                أكثر الفصول غياباً
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-white truncate max-w-[180px]">
                {mostAbsentClass}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Class Selector */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            {/* Date Picker */}
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                التاريخ
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right gap-2 h-11 font-normal"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {formatDateArabic(formatDate(selectedDate))}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="bottom">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date)
                        setCalendarOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Class Selector */}
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                الفصل
              </label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {classrooms.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade}/{cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Load Button */}
            <Button
              onClick={loadAttendance}
              disabled={loading}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white h-11 px-6 gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              عرض
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary Card */}
      {attendanceEntries.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#2A374E]" />
                <span className="font-bold text-gray-800 dark:text-white">
                  ملخص الحضور - {formatDateArabic(formatDate(selectedDate))}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <Badge className={`${STATUS_CONFIG['حاضر'].badgeClass} text-sm px-3 py-1`}>
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                  حاضر {summary.present}
                </Badge>
                <Badge className={`${STATUS_CONFIG['غائب'].badgeClass} text-sm px-3 py-1`}>
                  <XCircle className="w-3 h-3 ml-1" />
                  غائب {summary.absent}
                </Badge>
                <Badge className={`${STATUS_CONFIG['متأخر'].badgeClass} text-sm px-3 py-1`}>
                  <Clock className="w-3 h-3 ml-1" />
                  متأخر {summary.late}
                </Badge>
                <Badge className={`${STATUS_CONFIG['إذن'].badgeClass} text-sm px-3 py-1`}>
                  <ShieldCheck className="w-3 h-3 ml-1" />
                  إذن {summary.excused}
                </Badge>
              </div>
              <div className="flex items-center gap-3 min-w-[180px]">
                <Progress value={attendanceRate} className="flex-1 h-3" />
                <span className="text-sm font-bold text-gray-800 dark:text-white min-w-[40px]">
                  {attendanceRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Attendance Entry */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-[#2A374E]" />
              تسجيل الحضور
              {attendanceEntries.length > 0 && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({attendanceEntries.length} طالب)
                </span>
              )}
            </CardTitle>
            {attendanceEntries.length > 0 && (
              <Button
                onClick={handleSaveAll}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                حفظ الكل
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
            </div>
          ) : attendanceEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                لا يوجد طلاب للعرض
              </p>
              <p className="text-gray-400 text-sm mt-1">
                اختر تاريخاً وفصلاً ثم اضغط &quot;عرض&quot;
              </p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right p-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                      #
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      الطالب
                    </th>
                    {selectedClassId === 'all' && (
                      <th className="text-right p-3 text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        الفصل
                      </th>
                    )}
                    <th className="text-center p-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      الحالة
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      ملاحظة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceEntries.map((entry, index) => (
                    <tr
                      key={entry.studentId}
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-3 text-sm text-gray-400">{index + 1}</td>
                      <td className="p-3">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {entry.studentName}
                        </span>
                      </td>
                      {selectedClassId === 'all' && (
                        <td className="p-3 hidden md:table-cell">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.classroomName}
                          </span>
                        </td>
                      )}
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {ALL_STATUSES.map((status) => {
                            const config = STATUS_CONFIG[status]
                            const isActive = entry.status === status
                            return (
                              <button
                                key={status}
                                onClick={() => updateEntryStatus(entry.studentId, status)}
                                className={`
                                  flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                                  transition-all duration-150 min-w-[70px] justify-center
                                  border-2 touch-manipulation
                                  ${
                                    isActive
                                      ? `${config.bgActive} text-white ${config.borderActive} shadow-sm`
                                      : `${config.bgInactive} ${config.color} ${config.borderInactive}`
                                  }
                                `}
                                title={status}
                              >
                                {config.icon}
                                <span className="hidden sm:inline">{status}</span>
                              </button>
                            )
                          })}
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <Input
                          value={entry.note}
                          onChange={(e) =>
                            updateEntryNote(entry.studentId, e.target.value)
                          }
                          placeholder="ملاحظة..."
                          className="h-9 text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-[#2A374E]" />
              سجل الحضور
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* History Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                من تاريخ
              </label>
              <Input
                type="date"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                إلى تاريخ
              </label>
              <Input
                type="date"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                الفصل
              </label>
              <Select value={historyClassFilter} onValueChange={setHistoryClassFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {classrooms.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                الحالة
              </label>
              <Select value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {ALL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={loadHistory}
              disabled={historyLoading}
              className="h-9 gap-1"
            >
              {historyLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Search className="w-3 h-3" />
              )}
              بحث
            </Button>
          </div>

          {/* History Table */}
          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#2A374E]" />
            </div>
          ) : attendanceHistory.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">لا توجد سجلات حضور</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الطالب</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">ملاحظة</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.student.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateArabic(record.date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${STATUS_CONFIG[record.status as AttendanceStatus]?.badgeClass || ''} text-xs`}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell max-w-[150px] truncate">
                        {record.note || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditRecord(record)}
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Record Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل سجل الحضور</DialogTitle>
            <DialogDescription>
              تعديل حالة حضور {editingRecord?.student.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {ALL_STATUSES.map((status) => {
                  const config = STATUS_CONFIG[status]
                  const isActive = editStatus === status
                  return (
                    <button
                      key={status}
                      onClick={() => setEditStatus(status)}
                      className={`
                        flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-150 border-2 touch-manipulation
                        ${
                          isActive
                            ? `${config.bgActive} text-white ${config.borderActive} shadow-sm`
                            : `${config.bgInactive} ${config.color} ${config.borderInactive}`
                        }
                      `}
                    >
                      {config.icon}
                      {status}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ملاحظة
              </label>
              <Input
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="أدخل ملاحظة (اختياري)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={editSaving}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white"
            >
              {editSaving && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
