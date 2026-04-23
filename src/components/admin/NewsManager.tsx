'use client'

import { useState, useEffect } from 'react'
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
import { Plus, Pencil, Trash2, Newspaper, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface NewsItem {
  id: string
  title: string
  content: string | null
  category: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface NewsFormData {
  title: string
  content: string
  category: string
  order: number
  active: boolean
}

const defaultFormData: NewsFormData = {
  title: '',
  content: '',
  category: 'عام',
  order: 0,
  active: true,
}

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [deletingNews, setDeletingNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState<NewsFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news')
      const data = await res.json()
      if (Array.isArray(data)) {
        setNews(data)
      }
    } catch {
      toast.error('حدث خطأ في جلب الأخبار')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const openAddDialog = () => {
    setEditingNews(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (item: NewsItem) => {
    setEditingNews(item)
    setFormData({
      title: item.title,
      content: item.content || '',
      category: item.category,
      order: item.order,
      active: item.active,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('العنوان مطلوب')
      return
    }

    setSaving(true)
    try {
      if (editingNews) {
        const res = await fetch(`/api/news/${editingNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم تحديث الخبر بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
        }
      } else {
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (res.ok) {
          toast.success('تم إضافة الخبر بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
        }
      }
      setDialogOpen(false)
      fetchNews()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingNews) return
    try {
      const res = await fetch(`/api/news/${deletingNews.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الخبر بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingNews(null)
      fetchNews()
    }
  }

  const toggleActive = async (item: NewsItem) => {
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      })
      if (res.ok) {
        toast.success(item.active ? 'تم إلغاء تفعيل الخبر' : 'تم تفعيل الخبر')
        fetchNews()
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الأخبار</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إدارة أخبار وإعلانات الموقع</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة خبر
        </Button>
      </div>

      {news.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد أخبار حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;إضافة خبر&quot; لإضافة خبر جديد</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">العنوان</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">التصنيف</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">الترتيب</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">الحالة</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{item.title}</p>
                        {item.content && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.content}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="bg-[#2A374E]/10 text-[#2A374E] dark:bg-[#2A374E]/20 dark:text-blue-300">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">#{item.order}</span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={item.active ? 'default' : 'secondary'}
                        className={item.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}
                      >
                        {item.active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleActive(item)}
                          title={item.active ? 'إلغاء التفعيل' : 'تفعيل'}
                        >
                          {item.active ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setDeletingNews(item)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}</DialogTitle>
            <DialogDescription>
              {editingNews ? 'قم بتعديل بيانات الخبر' : 'أدخل بيانات الخبر الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="news-title">العنوان</Label>
              <Input
                id="news-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان الخبر"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-content">المحتوى</Label>
              <Textarea
                id="news-content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="أدخل محتوى الخبر"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="news-category">التصنيف</Label>
              <Input
                id="news-category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="أدخل التصنيف"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="news-order">الترتيب</Label>
                <Input
                  id="news-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="ترتيب العرض"
                />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center justify-between p-2">
                  <Label htmlFor="news-active">نشط</Label>
                  <Switch
                    id="news-active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                  />
                </div>
              </div>
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
              {editingNews ? 'تحديث' : 'إضافة'}
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
              هل أنت متأكد من حذف الخبر &quot;{deletingNews?.title}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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
