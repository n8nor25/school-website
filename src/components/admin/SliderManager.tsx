'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface SliderImage {
  id: string
  title: string
  category: string
  imageUrl: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

interface SliderFormData {
  title: string
  category: string
  imageUrl: string
  order: number
  active: boolean
}

const defaultFormData: SliderFormData = {
  title: '',
  category: 'تعليم',
  imageUrl: '',
  order: 0,
  active: true,
}

export default function SliderManager() {
  const [sliders, setSliders] = useState<SliderImage[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<SliderImage | null>(null)
  const [deletingSlider, setDeletingSlider] = useState<SliderImage | null>(null)
  const [formData, setFormData] = useState<SliderFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/slider')
      const data = await res.json()
      if (Array.isArray(data)) {
        setSliders(data)
      }
    } catch {
      toast.error('حدث خطأ في جلب الصور')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSliders()
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
        setFormData((prev) => ({ ...prev, imageUrl: data.url }))
        toast.success('تم رفع الصورة بنجاح')
      } else {
        toast.error(data.error || 'حدث خطأ في رفع الصورة')
      }
    } catch {
      toast.error('حدث خطأ في رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const openAddDialog = () => {
    setEditingSlider(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (slider: SliderImage) => {
    setEditingSlider(slider)
    setFormData({
      title: slider.title,
      category: slider.category,
      imageUrl: slider.imageUrl,
      order: slider.order,
      active: slider.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('العنوان مطلوب')
      return
    }
    if (!formData.imageUrl.trim()) {
      toast.error('رابط الصورة مطلوب')
      return
    }

    setSaving(true)
    try {
      if (editingSlider) {
        const res = await fetch(`/api/slider/${editingSlider.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم تحديث الصورة بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
        }
      } else {
        const res = await fetch('/api/slider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم إضافة الصورة بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
        }
      }
      setDialogOpen(false)
      fetchSliders()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingSlider) return
    try {
      const res = await fetch(`/api/slider/${deletingSlider.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الصورة بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingSlider(null)
      fetchSliders()
    }
  }

  const toggleActive = async (slider: SliderImage) => {
    try {
      const res = await fetch(`/api/slider/${slider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slider.active }),
      })
      if (res.ok) {
        toast.success(slider.active ? 'تم إلغاء تفعيل الصورة' : 'تم تفعيل الصورة')
        fetchSliders()
      }
    } catch {
      toast.error('حدث خطأ في تحديث الحالة')
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة السلايدر</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة صور العرض في الصفحة الرئيسية</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة صورة
        </Button>
      </div>

      {sliders.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد صور حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;إضافة صورة&quot; لإضافة صورة جديدة</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sliders.map((slider) => (
            <Card key={slider.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                <img
                  src={slider.imageUrl}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png'
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge
                    variant={slider.active ? 'default' : 'secondary'}
                    className={
                      slider.active
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-400 text-white'
                    }
                  >
                    {slider.active ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-[#2A374E] text-white">#{slider.order}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">{slider.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{slider.category}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleActive(slider)}
                      title={slider.active ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      {slider.active ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-emerald-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(slider)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setDeletingSlider(slider)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <Switch
                    checked={slider.active}
                    onCheckedChange={() => toggleActive(slider)}
                  />
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
            <DialogTitle>{editingSlider ? 'تعديل الصورة' : 'إضافة صورة جديدة'}</DialogTitle>
            <DialogDescription>
              {editingSlider ? 'قم بتعديل بيانات الصورة' : 'أدخل بيانات الصورة الجديدة'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="slider-title">العنوان</Label>
              <Input
                id="slider-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الصورة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider-category">التصنيف</Label>
              <Input
                id="slider-category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="أدخل التصنيف"
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الصورة</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="أدخل رابط الصورة أو ارفع ملف"
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
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              {formData.imageUrl && (
                <div className="mt-2 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={formData.imageUrl}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider-order">الترتيب</Label>
              <Input
                id="slider-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="ترتيب العرض"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="slider-active">نشط</Label>
              <Switch
                id="slider-active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
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
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : null}
              {editingSlider ? 'تحديث' : 'إضافة'}
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
              هل أنت متأكد من حذف الصورة &quot;{deletingSlider?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
