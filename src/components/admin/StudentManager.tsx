'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'

// ===== Types =====

interface ClassRoom {
  id: string
  name: string
  grade: string
  section: string
}

interface Parent {
  id: string
  name: string
  phone: string
  relation: string
}

interface Student {
  id: string
  name: string
  nationalId: string | null
  classRoomId: string
  parentId: string | null
  phone: string | null
  address: string | null
  birthDate: string | null
  enrollDate: string | null
  status: string
  createdAt: string
  classRoom: ClassRoom
  parent: Parent | null
  _count?: {
    attendance: number
    grades: number
  }
}

interface AttendanceRecord {
  id: string
  date: string
  status: string
  note: string | null
}

interface GradeRecord {
  id: string
  examType: string
  score: number
  maxScore: number
  term: string
  note: string | null
  subject: {
    id: string
    name: string
  }
}

interface StudentDetail extends Student {
  attendance: AttendanceRecord[]
  grades: GradeRecord[]
  classRoom: ClassRoom & { academicYear?: string }
  parent: (Parent & { email?: string }) | null
}

interface StudentFormData {
  name: string
  nationalId: string
  classRoomId: string
  parentId: string
  phone: string
  address: string
  birthDate: string
  enrollDate: string
  status: string
}

const STATUS_OPTIONS = [
  { value: 'نشط', label: 'نشط', color: 'bg-emerald-500 text-white' },
  { value: 'متوقف', label: 'متوقف', color: 'bg-red-500 text-white' },
  { value: 'منقول', label: 'منقول', color: 'bg-amber-500 text-white' },
]

const defaultFormData: StudentFormData = {
  name: '',
  nationalId: '',
  classRoomId: '',
  parentId: '',
  phone: '',
  address: '',
  birthDate: '',
  enrollDate: '',
  status: 'نشط',
}

const ITEMS_PER_PAGE = 10

export default function StudentManager() {
  // ===== State =====
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<StudentFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null)

  // Detail view
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // ===== Data Fetching =====

  const fetchStudents = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (filterClass && filterClass !== 'all') params.set('classRoomId', filterClass)
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus)

      const res = await fetch(`/api/students?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setStudents(data)
        setCurrentPage(1)
      }
    } catch {
      toast.error('حدث خطأ في جلب بيانات الطلاب')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filterClass, filterStatus])

  const fetchClassrooms = async () => {
    try {
      const res = await fetch('/api/classrooms')
      const data = await res.json()
      if (Array.isArray(data)) {
        setClassrooms(data)
      }
    } catch {
      // Silent fail - classrooms are for dropdown
    }
  }

  const fetchParents = async () => {
    try {
      const res = await fetch('/api/parents')
      const data = await res.json()
      if (Array.isArray(data)) {
        setParents(data)
      }
    } catch {
      // Silent fail - parents are for dropdown
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    fetchClassrooms()
    fetchParents()
  }, [])

  // ===== Pagination =====
  const totalPages = Math.max(1, Math.ceil(students.length / ITEMS_PER_PAGE))
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ===== Handlers =====

  const openAddDialog = () => {
    setEditingStudent(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      nationalId: student.nationalId || '',
      classRoomId: student.classRoomId,
      parentId: student.parentId || '',
      phone: student.phone || '',
      address: student.address || '',
      birthDate: student.birthDate || '',
      enrollDate: student.enrollDate || '',
      status: student.status,
    })
    setDialogOpen(true)
  }

  const openDetailDialog = async (student: Student) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/students/${student.id}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedStudent(data)
      } else {
        toast.error('حدث خطأ في جلب بيانات الطالب')
        setDetailOpen(false)
      }
    } catch {
      toast.error('حدث خطأ في جلب بيانات الطالب')
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('اسم الطالب مطلوب')
      return
    }
    if (!formData.classRoomId) {
      toast.error('يرجى اختيار الفصل')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name.trim(),
        nationalId: formData.nationalId.trim() || null,
        classRoomId: formData.classRoomId,
        parentId: formData.parentId || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        birthDate: formData.birthDate || null,
        enrollDate: formData.enrollDate || null,
        status: formData.status,
      }

      if (editingStudent) {
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم تحديث بيانات الطالب بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
          return
        }
      } else {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم إضافة الطالب بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
          return
        }
      }
      setDialogOpen(false)
      fetchStudents()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingStudent) return
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الطالب بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingStudent(null)
      fetchStudents()
    }
  }

  const getStatusBadge = (status: string) => {
    const found = STATUS_OPTIONS.find((s) => s.value === status)
    if (found) {
      return (
        <Badge className={`${found.color} border-0`}>
          {found.label}
        </Badge>
      )
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'حاضر':
        return <Badge className="bg-emerald-500 text-white border-0">حاضر</Badge>
      case 'غائب':
        return <Badge className="bg-red-500 text-white border-0">غائب</Badge>
      case 'متأخر':
        return <Badge className="bg-amber-500 text-white border-0">متأخر</Badge>
      case 'إذن':
        return <Badge className="bg-sky-500 text-white border-0">إذن</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100
    if (pct >= 85) return 'text-emerald-600 dark:text-emerald-400'
    if (pct >= 70) return 'text-sky-600 dark:text-sky-400'
    if (pct >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  // ===== Render =====

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الطلاب</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إضافة وتعديل وحذف بيانات الطلاب</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة طالب
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="بحث بالاسم أو الرقم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Class Filter */}
            <Select
              value={filterClass}
              onValueChange={(val) => setFilterClass(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="جميع الفصول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفصول</SelectItem>
                {classrooms.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filterStatus}
              onValueChange={(val) => setFilterStatus(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Results count */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{students.length} طالب</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      {students.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا يوجد طلاب حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;إضافة طالب&quot; لإضافة طالب جديد</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">#</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">الاسم</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">الفصل</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">الهاتف</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">الحالة</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student, idx) => (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    onClick={() => openDetailDialog(student)}
                  >
                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{student.name}</p>
                        {student.nationalId && (
                          <p className="text-xs text-gray-400 mt-0.5">{student.nationalId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className="bg-[#2A374E]/10 text-[#2A374E] dark:bg-[#2A374E]/20 dark:text-blue-300">
                        {student.classRoom?.name} - {student.classRoom?.section}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">
                      {student.phone || '—'}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(student)}
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setDeletingStudent(student)
                            setDeleteDialogOpen(true)
                          }}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, students.length)} من {students.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ===== Add/Edit Dialog ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</DialogTitle>
            <DialogDescription>
              {editingStudent ? 'قم بتعديل بيانات الطالب' : 'أدخل بيانات الطالب الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="student-name">اسم الطالب <span className="text-red-500">*</span></Label>
              <Input
                id="student-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم الطالب"
              />
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <Label htmlFor="student-nationalId">الرقم القومي</Label>
              <Input
                id="student-nationalId"
                value={formData.nationalId}
                onChange={(e) => setFormData((prev) => ({ ...prev, nationalId: e.target.value }))}
                placeholder="أدخل الرقم القومي (اختياري)"
              />
            </div>

            {/* Classroom & Parent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الفصل <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.classRoomId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, classRoomId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفصل" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>ولي الأمر</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, parentId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر ولي الأمر" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.relation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-phone">رقم الهاتف</Label>
                <Input
                  id="student-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-address">العنوان</Label>
                <Input
                  id="student-address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="أدخل العنوان"
                />
              </div>
            </div>

            {/* Birth Date & Enroll Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student-birthDate">تاريخ الميلاد</Label>
                <Input
                  id="student-birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-enrollDate">تاريخ القيد</Label>
                <Input
                  id="student-enrollDate"
                  type="date"
                  value={formData.enrollDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enrollDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              {editingStudent ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Delete Confirmation Dialog ===== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الطالب &quot;{deletingStudent?.name}&quot;؟ سيتم حذف جميع سجلات الحضور والدرجات المرتبطة. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== Student Detail Dialog ===== */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2A374E]" />
              بيانات الطالب
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
            </div>
          ) : selectedStudent ? (
            <div className="space-y-6">
              {/* Basic Info Card */}
              <Card className="border dark:border-gray-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedStudent.name}</h3>
                      {selectedStudent.nationalId && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">رقم قومي: {selectedStudent.nationalId}</p>
                      )}
                    </div>
                    {getStatusBadge(selectedStudent.status)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <GraduationCap className="w-4 h-4 text-[#2A374E] shrink-0" />
                      <span>{selectedStudent.classRoom?.name} - {selectedStudent.classRoom?.section}</span>
                    </div>
                    {selectedStudent.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-[#2A374E] shrink-0" />
                        <span dir="ltr">{selectedStudent.phone}</span>
                      </div>
                    )}
                    {selectedStudent.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-[#2A374E] shrink-0" />
                        <span>{selectedStudent.address}</span>
                      </div>
                    )}
                    {selectedStudent.birthDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-[#2A374E] shrink-0" />
                        <span>الميلاد: {selectedStudent.birthDate}</span>
                      </div>
                    )}
                    {selectedStudent.enrollDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-[#2A374E] shrink-0" />
                        <span>القيد: {selectedStudent.enrollDate}</span>
                      </div>
                    )}
                    {selectedStudent.parent && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <User className="w-4 h-4 text-[#2A374E] shrink-0" />
                        <span>ولي الأمر: {selectedStudent.parent.name} ({selectedStudent.parent.relation})</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Two Column Layout for Attendance & Grades */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Attendance */}
                <Card className="border dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ClipboardCheck className="w-5 h-5 text-[#2A374E]" />
                      <h4 className="font-bold text-gray-800 dark:text-white">آخر سجلات الحضور</h4>
                    </div>
                    {selectedStudent.attendance && selectedStudent.attendance.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedStudent.attendance.slice(0, 10).map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                          >
                            <span className="text-sm text-gray-600 dark:text-gray-300">{record.date}</span>
                            {getAttendanceBadge(record.status)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">لا توجد سجلات حضور</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Grades */}
                <Card className="border dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-[#2A374E]" />
                      <h4 className="font-bold text-gray-800 dark:text-white">آخر الدرجات</h4>
                    </div>
                    {selectedStudent.grades && selectedStudent.grades.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedStudent.grades.map((grade) => (
                          <div
                            key={grade.id}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {grade.subject?.name || 'مادة'}
                              </span>
                              <span className={`text-sm font-bold ${getScoreColor(grade.score, grade.maxScore)}`}>
                                {grade.score}/{grade.maxScore}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{grade.examType}</span>
                              <span>•</span>
                              <span>{grade.term}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">لا توجد درجات مسجلة</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailOpen(false)
                    if (selectedStudent) {
                      openEditDialog(selectedStudent)
                    }
                  }}
                  className="gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  رجوع
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
