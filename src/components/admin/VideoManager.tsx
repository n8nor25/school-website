'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Pencil, Trash2, Video, Upload, Loader2, Play, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface VideoItem {
  id: string
  title: string
  description: string | null
  videoUrl: string
  duration: string
  thumbnail: string | null
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
}

interface VideoFormData {
  title: string
  description: string
  videoUrl: string
  duration: string
  thumbnail: string
  order: number
  active: boolean
}

const defaultFormData: VideoFormData = {
  title: '',
  description: '',
  videoUrl: '',
  duration: '00:00',
  thumbnail: '',
  order: 0,
  active: true,
}

export default function VideoManager() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [deletingVideo, setDeletingVideo] = useState<VideoItem | null>(null)
  const [formData, setFormData] = useState<VideoFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const videoFileRef = useRef<HTMLInputElement>(null)
  const thumbFileRef = useRef<HTMLInputElement>(null)

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      if (Array.isArray(data)) {
        setVideos(data)
      }
    } catch {
      toast.error('حدث خطأ في جلب الفيديوهات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const uploadFile = async (file: File, type: 'video' | 'thumbnail') => {
    const setUploading = type === 'video' ? setUploadingVideo : setUploadingThumb
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
        if (type === 'video') {
          setFormData((prev) => ({ ...prev, videoUrl: data.url }))
        } else {
          setFormData((prev) => ({ ...prev, thumbnail: data.url }))
        }
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
    setEditingVideo(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      duration: video.duration,
      thumbnail: video.thumbnail || '',
      order: video.order,
      active: video.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('العنوان مطلوب')
      return
    }
    if (!formData.videoUrl.trim()) {
      toast.error('رابط الفيديو مطلوب')
      return
    }

    setSaving(true)
    try {
      if (editingVideo) {
        const res = await fetch(`/api/videos/${editingVideo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم تحديث الفيديو بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
        }
      } else {
        const res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم إضافة الفيديو بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
        }
      }
      setDialogOpen(false)
      fetchVideos()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingVideo) return
    try {
      const res = await fetch(`/api/videos/${deletingVideo.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الفيديو بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingVideo(null)
      fetchVideos()
    }
  }

  const toggleActive = async (video: VideoItem) => {
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !video.active }),
      })
      if (res.ok) {
        toast.success(video.active ? 'تم إلغاء تفعيل الفيديو' : 'تم تفعيل الفيديو')
        fetchVideos()
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الفيديوهات</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة فيديوهات الموقع</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة فيديو
        </Button>
      </div>

      {videos.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد فيديوهات حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;إضافة فيديو&quot; لإضافة فيديو جديد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-gray-900">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className="bg-black/60 text-white backdrop-blur-sm">
                    <Clock className="w-3 h-3 ml-1" />
                    {video.duration}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={video.active ? 'default' : 'secondary'}
                    className={video.active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}
                  >
                    {video.active ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleActive(video)}
                      title={video.active ? 'إلغاء التفعيل' : 'تفعيل'}
                    >
                      <Switch checked={video.active} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(video)}
                    >
                      <Pencil className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setDeletingVideo(video)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">#{video.order}</Badge>
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
            <DialogTitle>{editingVideo ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
            <DialogDescription>
              {editingVideo ? 'قم بتعديل بيانات الفيديو' : 'أدخل بيانات الفيديو الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="video-title">العنوان</Label>
              <Input
                id="video-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الفيديو"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-description">الوصف</Label>
              <Textarea
                id="video-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصف الفيديو"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الفيديو</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="أدخل رابط الفيديو أو ارفع ملف"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoFileRef.current?.click()}
                  disabled={uploadingVideo}
                  className="gap-2 shrink-0"
                >
                  {uploadingVideo ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  رفع
                </Button>
              </div>
              <input
                ref={videoFileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadFile(file, 'video')
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-duration">المدة</Label>
                <Input
                  id="video-duration"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="00:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-order">الترتيب</Label>
                <Input
                  id="video-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>صورة مصغرة</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.thumbnail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="أدخل رابط الصورة المصغرة أو ارفع ملف"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => thumbFileRef.current?.click()}
                  disabled={uploadingThumb}
                  className="gap-2 shrink-0"
                >
                  {uploadingThumb ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  رفع
                </Button>
              </div>
              <input
                ref={thumbFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) uploadFile(file, 'thumbnail')
                }}
              />
              {formData.thumbnail && (
                <div className="mt-2 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={formData.thumbnail}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="video-active">نشط</Label>
              <Switch
                id="video-active"
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
              {saving && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
              {editingVideo ? 'تحديث' : 'إضافة'}
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
              هل أنت متأكد من حذف الفيديو &quot;{deletingVideo?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
