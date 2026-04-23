'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Pencil, Trash2, Calendar, Upload, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

interface Schedule {
  id: string
  title: string
  grade: string
  fileUrl: string
  type: string
  uploadDate: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ScheduleFormData {
  title: string
  grade: string
  fileUrl: string
  type: string
  uploadDate: string
  active: boolean
}

const defaultFormData: ScheduleFormData = {
  title: '',
  grade: 'عام',
  fileUrl: '',
  type: 'حالي',
  uploadDate: new Date().toISOString().split('T')[0],
  active: true,
}

const gradeOptions = [
  { value: 'الأول الإعدادي', label: 'الأول الإعدادي' },
  { value: 'الثاني الإعدادي', label: 'الثاني الإعدادي' },
  { value: 'الثالث الإعدادي', label: 'الثالث الإعدادي' },
  { value: 'هيئة التدريس', label: 'هيئة التدريس' },
  { value: 'عام', label: 'عام' },
]

const typeOptions = [
  { value: 'حالي', label: 'حالي' },
  { value: 'أرشيف', label: 'أرشيف' },
]

const gradeColors: Record<string, string> = {
  'الأول الإعدادي': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'الثاني الإعدادي': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'الثالث الإعدادي': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'هيئة التدريس': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'عام': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState<ScheduleFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/schedules')
      const data = await res.json()
      if (Array.isArray(data)) {
        setSchedules(data)
      }
    } catch {
      toast.error('حدث خطأ في جلب الجداول')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      })
      const data = await res.json()
      if (res.ok) {
        setFormData((prev) => ({ ...prev, fileUrl: data.url }))
        toast.success('تم رفع الملف بنجاح')
      } else {
        toast.error(data.error || 'حدث خطأ في رفع الملف')
      }
    } catch {
      toast.error('حدث خطأ في رفع الملف')
    } finally {
      setUploading(false)
    }
  }

  const openAddDialog = () => {
    setEditingSchedule(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      title: schedule.title,
      grade: schedule.grade,
      fileUrl: schedule.fileUrl,
      type: schedule.type,
      uploadDate: schedule.uploadDate,
      active: schedule.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('العنوان مطلوب')
      return
    }
    if (!formData.fileUrl.trim()) {
      toast.error('رابط الملف مطلوب')
      return
    }

    setSaving(true)
    try {
      if (editingSchedule) {
        const res = await fetch(`/api/schedules/${editingSchedule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم تحديث الجدول بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
        }
      } else {
        const res = await fetch('/api/schedules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم إضافة الجدول بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
        }
      }
      setDialogOpen(false)
      fetchSchedules()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingSchedule) return
    try {
      const res = await fetch(`/api/schedules/${deletingSchedule.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الجدول بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingSchedule(null)
      fetchSchedules()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A374E]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الجداول</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة جداول الحصص والامتحانات</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة جدول
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد جداول حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;إضافة جدول&quot; لإضافة جدول جديد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#2A374E]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#2A374E] dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{schedule.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{schedule.uploadDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={gradeColors[schedule.grade] || gradeColors['عام']}>
                    {schedule.grade}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      schedule.type === 'حالي'
                        ? 'border-emerald-300 text-emerald-600 dark:border-emerald-600 dark:text-emerald-400'
                        : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                    }
                  >
                    {schedule.type}
                  </Badge>
                </div>

                {schedule.fileUrl && (
                  <a
                    href={schedule.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-600 underline mb-3 block"
                  >
                    عرض الملف
                  </a>
                )}

                <div className="flex items-center gap-1 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(schedule)}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setDeletingSchedule(schedule)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'تعديل الجدول' : 'إضافة جدول جديد'}</DialogTitle>
            <DialogDescription>
              {editingSchedule ? 'قم بتعديل بيانات الجدول' : 'أدخل بيانات الجدول الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-title">العنوان</Label>
              <Input
                id="schedule-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الجدول"
              />
            </div>
            <div className="space-y-2">
              <Label>الصف</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, grade: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الصف" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ملف الجدول (PDF)</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="أدخل رابط الملف أو ارفع ملف"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-2 shrink-0"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  رفع
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.png"
                className="hidden"
                onChange={handleFileUpload}
              />
              {formData.fileUrl && (
                <p className="text-xs text-emerald-600 mt-1">تم رفع الملف: {formData.fileUrl}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-date">تاريخ الرفع</Label>
              <Input
                id="schedule-date"
                type="date"
                value={formData.uploadDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, uploadDate: e.target.value }))}
              />
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
              {editingSchedule ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الجدول &quot;{deletingSchedule?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
    </div>
  )
}
