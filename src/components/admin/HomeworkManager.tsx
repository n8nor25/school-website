'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
  Loader2,
  Search,
  BookOpen,
  Clock,
  CalendarDays,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'

// ===== Types =====

interface ClassRoom {
  id: string
  name: string
  grade: string
  section: string
}

interface Subject {
  id: string
  name: string
}

interface Homework {
  id: string
  title: string
  description: string
  subjectId: string | null
  classRoomId: string
  dueDate: string
  attachments: string | null
  notes: string | null
  status: string
  createdAt: string
  updatedAt: string
  subject: {
    id: string
    name: string
  } | null
  classRoom: {
    id: string
    name: string
    grade: string
    section: string
  }
}

interface HomeworkFormData {
  title: string
  description: string
  subjectId: string
  classRoomId: string
  dueDate: string
  notes: string
  status: string
}

// ===== Constants =====

const STATUS_OPTIONS = [
  { value: 'نشط', label: 'نشط' },
  { value: 'منتهي', label: 'منتهي' },
  { value: 'مغلق', label: 'مغلق' },
]

const STATUS_STYLES: Record<string, { bgClass: string; textClass: string; icon: typeof CheckCircle }> = {
  'نشط': {
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle,
  },
  'منتهي': {
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-300',
    icon: AlertCircle,
  },
  'مغلق': {
    bgClass: 'bg-gray-100 dark:bg-gray-800/50',
    textClass: 'text-gray-600 dark:text-gray-400',
    icon: Clock,
  },
}

const defaultFormData: HomeworkFormData = {
  title: '',
  description: '',
  subjectId: '',
  classRoomId: '',
  dueDate: '',
  notes: '',
  status: 'نشط',
}

const ITEMS_PER_PAGE = 10

// ===== Helper Functions =====

function isOverdue(dueDate: string, status: string): boolean {
  if (status === 'مغلق') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  return due < today
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusBadge(status: string) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['نشط']
  const IconComp = style.icon
  return (
    <Badge className={`${style.bgClass} ${style.textClass} border-0 text-xs font-medium gap-1`}>
      <IconComp className="w-3 h-3" />
      {status}
    </Badge>
  )
}

// ===== Component =====

export default function HomeworkManager() {
  // ===== Core Data =====
  const [homework, setHomework] = useState<Homework[]>([])
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // ===== Filters =====
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filtersApplied, setFiltersApplied] = useState(false)

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1)

  // ===== Add/Edit Dialog =====
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null)
  const [formData, setFormData] = useState<HomeworkFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)

  // ===== Delete Dialog =====
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingHomework, setDeletingHomework] = useState<Homework | null>(null)

  // ===== Data Fetching =====

  const fetchClassrooms = async () => {
    try {
      const res = await fetch('/api/classrooms')
      const data = await res.json()
      if (Array.isArray(data)) {
        setClassrooms(data)
      }
    } catch {
      // silent
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      if (Array.isArray(data)) {
        setSubjects(data)
      }
    } catch {
      // silent
    }
  }

  const fetchHomework = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterClass && filterClass !== 'all') params.set('classRoomId', filterClass)
      if (filterSubject && filterSubject !== 'all') params.set('subjectId', filterSubject)
      if (filterStatus && filterStatus !== 'all') params.set('status', filterStatus)

      const res = await fetch(`/api/homework?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setHomework(data)
        setCurrentPage(1)
      }
      setFiltersApplied(true)
    } catch {
      toast.error('حدث خطأ في جلب الواجبات')
    } finally {
      setLoading(false)
    }
  }, [filterClass, filterSubject, filterStatus])

  useEffect(() => {
    fetchClassrooms()
    fetchSubjects()
  }, [])

  useEffect(() => {
    fetchHomework()
  }, [fetchHomework])

  // ===== Pagination =====
  const totalPages = Math.max(1, Math.ceil(homework.length / ITEMS_PER_PAGE))
  const paginatedHomework = homework.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ===== Handlers =====

  const openAddDialog = () => {
    setEditingHomework(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (hw: Homework) => {
    setEditingHomework(hw)
    setFormData({
      title: hw.title,
      description: hw.description,
      subjectId: hw.subjectId || '',
      classRoomId: hw.classRoomId,
      dueDate: hw.dueDate,
      notes: hw.notes || '',
      status: hw.status,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('يرجى إدخال عنوان الواجب')
      return
    }
    if (!formData.description.trim()) {
      toast.error('يرجى إدخال وصف الواجب')
      return
    }
    if (!formData.classRoomId) {
      toast.error('يرجى اختيار الفصل')
      return
    }
    if (!formData.dueDate) {
      toast.error('يرجى تحديد تاريخ التسليم')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        classRoomId: formData.classRoomId,
        dueDate: formData.dueDate,
        subjectId: formData.subjectId || null,
        notes: formData.notes.trim() || null,
        status: formData.status,
      }

      if (editingHomework) {
        const res = await fetch(`/api/homework/${editingHomework.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم تحديث الواجب بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
          return
        }
      } else {
        const res = await fetch('/api/homework', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم إضافة الواجب بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
          return
        }
      }
      setDialogOpen(false)
      fetchHomework()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingHomework) return
    try {
      const res = await fetch(`/api/homework/${deletingHomework.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الواجب بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingHomework(null)
      fetchHomework()
    }
  }

  // ===== Render =====

  if (loading && !filtersApplied) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الواجبات</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إضافة وتعديل ومتابعة واجبات الطلاب</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة واجب
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Classroom Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">الفصل</Label>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full h-10">
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
            </div>

            {/* Subject Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">المادة</Label>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="جميع المواد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المواد</SelectItem>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">الحالة</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full h-10">
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
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <Button
                onClick={() => fetchHomework()}
                disabled={loading}
                className="w-full bg-[#2A374E] hover:bg-[#1e2a3d] text-white h-10 gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                عرض
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Homework Table */}
      {homework.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد واجبات</p>
            <p className="text-gray-400 text-sm mt-1">
              استخدم الفلاتر أعلاه لعرض الواجبات أو أضف واجب جديد
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">#</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">العنوان</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">الفصل</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">المادة</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">تاريخ التسليم</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400">الحالة</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHomework.map((hw, idx) => {
                  const overdue = isOverdue(hw.dueDate, hw.status)

                  return (
                    <TableRow
                      key={hw.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {hw.title}
                          </p>
                          {hw.notes && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                              {hw.notes}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="bg-[#2A374E]/10 text-[#2A374E] dark:bg-[#2A374E]/20 dark:text-blue-300">
                          {hw.classRoom?.name || 'غير محدد'} - {hw.classRoom?.section || ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {hw.subject ? (
                          <Badge variant="outline" className="text-xs font-medium border-gray-300 dark:border-gray-600">
                            {hw.subject.name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className={`w-4 h-4 ${overdue ? 'text-red-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
                            {formatDate(hw.dueDate)}
                          </span>
                        </div>
                        {overdue && (
                          <p className="text-[10px] text-red-500 mt-0.5 mr-5">تأخر عن الموعد</p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(hw.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(hw)}
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setDeletingHomework(hw)
                              setDeleteDialogOpen(true)
                            }}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, homework.length)} من {homework.length}
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

      {/* ===== Add/Edit Homework Dialog ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2A374E]" />
              {editingHomework ? 'تعديل الواجب' : 'إضافة واجب جديد'}
            </DialogTitle>
            <DialogDescription>
              {editingHomework ? 'قم بتعديل بيانات الواجب' : 'أدخل بيانات الواجب الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label>
                عنوان الواجب <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الواجب"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>
                الوصف <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصف الواجب"
                rows={3}
              />
            </div>

            {/* Classroom & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  الفصل <span className="text-red-500">*</span>
                </Label>
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
                <Label>المادة (اختياري)</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, subjectId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون مادة</SelectItem>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  تاريخ التسليم <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="pr-10"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

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

            {/* Notes */}
            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="ملاحظات إضافية (اختياري)"
                rows={2}
              />
            </div>

            {/* Due Date Preview */}
            {formData.dueDate && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">تاريخ التسليم</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className={`w-4 h-4 ${isOverdue(formData.dueDate, formData.status) ? 'text-red-500' : 'text-emerald-500'}`} />
                    <span className={`text-sm font-bold ${isOverdue(formData.dueDate, formData.status) ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {formatDate(formData.dueDate)}
                    </span>
                  </div>
                </div>
                {isOverdue(formData.dueDate, formData.status) && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    هذا التاريخ قد مر بالفعل
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                editingHomework ? 'تحديث' : 'إضافة'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Delete Confirmation Dialog ===== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الواجب &quot;{deletingHomework?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
