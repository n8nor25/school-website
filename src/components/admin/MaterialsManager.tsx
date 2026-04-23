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
  FileText,
  FileVideo,
  FileImage,
  File,
  Upload,
  Download,
  BookOpen,
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

interface Material {
  id: string
  title: string
  description: string | null
  fileType: string
  fileUrl: string
  fileName: string
  fileSize: number
  notes: string | null
  createdAt: string
  subjectId: string | null
  classRoomId: string | null
  subject: {
    id: string
    name: string
  } | null
  classRoom: {
    id: string
    name: string
    grade: string
    section: string
  } | null
}

interface MaterialFormData {
  title: string
  description: string
  fileType: string
  fileUrl: string
  fileName: string
  fileSize: string
  subjectId: string
  classRoomId: string
  notes: string
}

// ===== Constants =====

const FILE_TYPE_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'مستند' },
  { value: 'video', label: 'فيديو' },
  { value: 'image', label: 'صورة' },
  { value: 'other', label: 'أخرى' },
]

const FILE_TYPE_STYLES: Record<string, { bgClass: string; textClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  pdf: {
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-300',
    icon: FileText,
  },
  doc: {
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-300',
    icon: FileText,
  },
  video: {
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    textClass: 'text-purple-700 dark:text-purple-300',
    icon: FileVideo,
  },
  image: {
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-300',
    icon: FileImage,
  },
  other: {
    bgClass: 'bg-gray-100 dark:bg-gray-900/30',
    textClass: 'text-gray-700 dark:text-gray-300',
    icon: File,
  },
}

const defaultFormData: MaterialFormData = {
  title: '',
  description: '',
  fileType: 'pdf',
  fileUrl: '',
  fileName: '',
  fileSize: '',
  subjectId: '',
  classRoomId: '',
  notes: '',
}

const ITEMS_PER_PAGE = 10

// ===== Helper Functions =====

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileTypeLabel(fileType: string): string {
  const option = FILE_TYPE_OPTIONS.find((opt) => opt.value === fileType)
  return option ? option.label : fileType
}

function getFileTypeIcon(fileType: string) {
  const style = FILE_TYPE_STYLES[fileType] || FILE_TYPE_STYLES.other
  const Icon = style.icon
  return <Icon className="w-4 h-4" />
}

function getFileTypeBadge(fileType: string) {
  const style = FILE_TYPE_STYLES[fileType] || FILE_TYPE_STYLES.other
  return (
    <Badge className={`${style.bgClass} ${style.textClass} border-0 text-xs font-medium gap-1`}>
      {getFileTypeIcon(fileType)}
      {getFileTypeLabel(fileType)}
    </Badge>
  )
}

// ===== Component =====

export default function MaterialsManager() {
  // ===== Core Data =====
  const [materials, setMaterials] = useState<Material[]>([])
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // ===== Filters =====
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterFileType, setFilterFileType] = useState<string>('all')
  const [filtersApplied, setFiltersApplied] = useState(false)

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1)

  // ===== Add/Edit Dialog =====
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState<MaterialFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)

  // ===== Delete Dialog =====
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null)

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

  const fetchMaterials = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterClass && filterClass !== 'all') params.set('classRoomId', filterClass)
      if (filterSubject && filterSubject !== 'all') params.set('subjectId', filterSubject)
      if (filterFileType && filterFileType !== 'all') params.set('fileType', filterFileType)

      const res = await fetch(`/api/materials?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setMaterials(data)
        setCurrentPage(1)
      }
      setFiltersApplied(true)
    } catch {
      toast.error('حدث خطأ في جلب المواد التعليمية')
    } finally {
      setLoading(false)
    }
  }, [filterClass, filterSubject, filterFileType])

  useEffect(() => {
    fetchClassrooms()
    fetchSubjects()
  }, [])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  // ===== Pagination =====
  const totalPages = Math.max(1, Math.ceil(materials.length / ITEMS_PER_PAGE))
  const paginatedMaterials = materials.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ===== Handlers =====

  const openAddDialog = () => {
    setEditingMaterial(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      title: material.title,
      description: material.description || '',
      fileType: material.fileType,
      fileUrl: material.fileUrl,
      fileName: material.fileName,
      fileSize: material.fileSize ? String(material.fileSize) : '',
      subjectId: material.subjectId || '',
      classRoomId: material.classRoomId || '',
      notes: material.notes || '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('يرجى إدخال عنوان المادة')
      return
    }
    if (!formData.fileType) {
      toast.error('يرجى اختيار نوع الملف')
      return
    }
    if (!formData.fileUrl.trim()) {
      toast.error('يرجى إدخال رابط الملف')
      return
    }
    if (!formData.fileName.trim()) {
      toast.error('يرجى إدخال اسم الملف')
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        fileType: formData.fileType,
        fileUrl: formData.fileUrl.trim(),
        fileName: formData.fileName.trim(),
        fileSize: formData.fileSize ? Number(formData.fileSize) : 0,
        subjectId: formData.subjectId || null,
        classRoomId: formData.classRoomId || null,
        notes: formData.notes.trim() || null,
      }

      if (editingMaterial) {
        const res = await fetch(`/api/materials/${editingMaterial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم تحديث المادة التعليمية بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
          return
        }
      } else {
        const res = await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم إضافة المادة التعليمية بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
          return
        }
      }
      setDialogOpen(false)
      fetchMaterials()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingMaterial) return
    try {
      const res = await fetch(`/api/materials/${deletingMaterial.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف المادة التعليمية بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingMaterial(null)
      fetchMaterials()
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة المواد التعليمية</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">رفع وإدارة الملفات والمواد التعليمية</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة مادة تعليمية
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

            {/* File Type Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">نوع الملف</Label>
              <Select value={filterFileType} onValueChange={setFilterFileType}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {FILE_TYPE_OPTIONS.map((opt) => (
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
                onClick={() => fetchMaterials()}
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

      {/* Materials Table */}
      {materials.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد مواد تعليمية</p>
            <p className="text-gray-400 text-sm mt-1">
              استخدم الفلاتر أعلاه لعرض المواد أو أضف مادة تعليمية جديدة
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
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">نوع الملف</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">المادة</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">الفصل</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">حجم الملف</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMaterials.map((material, idx) => (
                  <TableRow
                    key={material.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {material.title}
                        </p>
                        {material.description && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                            {material.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {material.fileName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getFileTypeBadge(material.fileType)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {material.subject ? (
                        <Badge variant="secondary" className="bg-[#2A374E]/10 text-[#2A374E] dark:bg-[#2A374E]/20 dark:text-blue-300">
                          {material.subject.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">
                      {material.classRoom ? (
                        <span>{material.classRoom.name} - {material.classRoom.section}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center text-sm text-gray-600 dark:text-gray-300">
                      {formatFileSize(material.fileSize)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(material.fileUrl, '_blank')}
                          title="تحميل"
                        >
                          <Download className="w-4 h-4 text-emerald-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(material)}
                          title="تعديل"
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setDeletingMaterial(material)
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
                عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, materials.length)} من {materials.length}
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

      {/* ===== Add/Edit Material Dialog ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2A374E]" />
              {editingMaterial ? 'تعديل المادة التعليمية' : 'إضافة مادة تعليمية جديدة'}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial ? 'قم بتعديل بيانات المادة التعليمية' : 'أدخل بيانات المادة التعليمية الجديدة'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label>
                عنوان المادة <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان المادة التعليمية"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصفاً للمادة التعليمية (اختياري)"
                rows={3}
              />
            </div>

            {/* File Type */}
            <div className="space-y-2">
              <Label>
                نوع الملف <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.fileType}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, fileType: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر نوع الملف" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon(opt.value)}
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File URL & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  <div className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    رابط الملف <span className="text-red-500">*</span>
                  </div>
                </Label>
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="أدخل رابط الملف (URL)"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  اسم الملف <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.fileName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fileName: e.target.value }))}
                  placeholder="مثال: كتاب الرياضيات.pdf"
                  dir="ltr"
                />
              </div>
            </div>

            {/* File Size */}
            <div className="space-y-2">
              <Label>حجم الملف (بالبايت)</Label>
              <Input
                type="number"
                min="0"
                value={formData.fileSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, fileSize: e.target.value }))}
                placeholder="مثال: 1048576 (1 ميجابايت)"
              />
              {formData.fileSize && Number(formData.fileSize) > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  الحجم: {formatFileSize(Number(formData.fileSize))}
                </p>
              )}
            </div>

            {/* Subject & Classroom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label>الفصل (اختياري)</Label>
                <Select
                  value={formData.classRoomId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, classRoomId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفصل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون فصل</SelectItem>
                    {classrooms.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section}
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
                placeholder="أدخل ملاحظات إضافية (اختياري)"
                rows={2}
              />
            </div>

            {/* File Preview */}
            {formData.fileUrl && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${(FILE_TYPE_STYLES[formData.fileType] || FILE_TYPE_STYLES.other).bgClass}`}>
                    {getFileTypeIcon(formData.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {formData.fileName || 'ملف بدون اسم'}
                    </p>
                    <p className="text-xs text-gray-400 truncate" dir="ltr">
                      {formData.fileUrl}
                    </p>
                  </div>
                  {formData.fileSize && Number(formData.fileSize) > 0 && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {formatFileSize(Number(formData.fileSize))}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
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
                <>
                  <Upload className="w-4 h-4" />
                  {editingMaterial ? 'تحديث' : 'إضافة'}
                </>
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
              <Trash2 className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف المادة التعليمية &quot;{deletingMaterial?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
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
