'use client'

import { useState, useEffect, useRef } from 'react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Upload,
  Trash2,
  Loader2,
  FileSpreadsheet,
  GraduationCap,
  Users,
  Clock,
  Plus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'

interface ExamResultGrade {
  id: string
  gradeName: string
  studentCount: number
  updatedAt: string
}

interface ExamResultEntry {
  seatNumber: string
  studentName: string
  arabic: number
  english: number
  social: number
  math: number
  science: number
  total: number
  religion: number
  art: number
  computer: number
}

interface UploadPayload {
  gradeName: string
  results: ExamResultEntry[]
}

const sampleData: UploadPayload = {
  gradeName: 'الأول الإعدادي',
  results: [
    { seatNumber: '71200', studentName: 'ابانوب روماني منير عزمي', arabic: 28.5, english: 2, social: 3, math: 3, science: 2.5, total: 39, religion: 11, art: 5, computer: 5 },
    { seatNumber: '71206', studentName: 'احمد سيد حامد محمود', arabic: 33, english: 13, social: 17, math: 14, science: 16, total: 93, religion: 13.5, art: 6, computer: 5 },
  ],
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export default function ResultsManager() {
  const [grades, setGrades] = useState<ExamResultGrade[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGrade, setDeletingGrade] = useState<ExamResultGrade | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Upload form state
  const [gradeName, setGradeName] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [inputMode, setInputMode] = useState<'json' | 'file'>('json')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchGrades = async () => {
    try {
      const res = await fetch('/api/exam-results')
      const data = await res.json()
      if (Array.isArray(data)) {
        setGrades(data)
      }
    } catch {
      toast.error('حدث خطأ في جلب نتائج الامتحانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGrades()
  }, [])

  const resetUploadForm = () => {
    setGradeName('')
    setJsonData('')
    setInputMode('json')
  }

  const openUploadDialog = () => {
    resetUploadForm()
    setUploadDialogOpen(true)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)

      if (parsed.gradeName) {
        setGradeName(parsed.gradeName)
      }
      if (parsed.results && Array.isArray(parsed.results)) {
        setJsonData(JSON.stringify(parsed, null, 2))
      } else if (Array.isArray(parsed)) {
        setJsonData(JSON.stringify({ gradeName: gradeName || '', results: parsed }, null, 2))
      } else {
        setJsonData(text)
      }

      setInputMode('json')
      toast.success('تم قراءة الملف بنجاح')
    } catch {
      toast.error('فشل في قراءة الملف. تأكد من أنه ملف JSON صالح')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!gradeName.trim()) {
      toast.error('يرجى إدخال اسم الصف')
      return
    }

    if (!jsonData.trim()) {
      toast.error('يرجى إدخال بيانات النتائج')
      return
    }

    let parsed: UploadPayload
    try {
      const raw = JSON.parse(jsonData)
      if (raw.results && Array.isArray(raw.results)) {
        parsed = {
          gradeName: gradeName.trim(),
          results: raw.results,
        }
      } else if (Array.isArray(raw)) {
        parsed = {
          gradeName: gradeName.trim(),
          results: raw,
        }
      } else {
        toast.error('صيغة البيانات غير صحيحة. يجب أن تحتوي على مصفوفة results')
        return
      }
    } catch {
      toast.error('بيانات JSON غير صالحة. تأكد من الصيغة الصحيحة')
      return
    }

    if (parsed.results.length === 0) {
      toast.error('لا توجد نتائج للرفع')
      return
    }

    // Validate required fields
    for (let i = 0; i < parsed.results.length; i++) {
      if (!parsed.results[i].seatNumber || !parsed.results[i].studentName) {
        toast.error(`السطر ${i + 1}: رقم الجلوس واسم الطالب مطلوبان`)
        return
      }
    }

    setUploading(true)
    try {
      const res = await fetch('/api/exam-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`تم رفع النتائج بنجاح - ${data.resultsCount} طالب`, {
          icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        })
        setUploadDialogOpen(false)
        resetUploadForm()
        fetchGrades()
      } else {
        toast.error(data.error || 'حدث خطأ في رفع النتائج')
      }
    } catch {
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setUploading(false)
    }
  }

  const handleImportSample = async () => {
    setUploading(true)
    try {
      const res = await fetch('/api/exam-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`تم استيراد البيانات التجريبية بنجاح - ${data.resultsCount} طالب`, {
          icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
        })
        fetchGrades()
      } else {
        toast.error(data.error || 'حدث خطأ في استيراد البيانات')
      }
    } catch {
      toast.error('حدث خطأ في الاتصال بالخادم')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingGrade) return
    try {
      const res = await fetch(`/api/exam-results/${deletingGrade.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('تم حذف صف النتائج وجميع البيانات المرتبطة بنجاح')
      } else {
        const data = await res.json()
        toast.error(data.error || 'حدث خطأ في الحذف')
      }
    } catch {
      toast.error('حدث خطأ في الحذف')
    } finally {
      setDeleteDialogOpen(false)
      setDeletingGrade(null)
      fetchGrades()
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
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة نتائج الامتحانات</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">رفع وإدارة نتائج الطلاب في الامتحانات</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleImportSample}
            disabled={uploading}
            variant="outline"
            className="gap-2 border-[#2A374E]/30 text-[#2A374E] dark:border-blue-400/30 dark:text-blue-300 hover:bg-[#2A374E]/5"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            استيراد بيانات تجريبية
          </Button>
          <Button
            onClick={openUploadDialog}
            className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
          >
            <Upload className="w-4 h-4" />
            رفع نتائج جديدة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2A374E]/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-[#2A374E] dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الصفوف</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{grades.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الطلاب</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {grades.reduce((sum, g) => sum + g.studentCount, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">آخر تحديث</p>
              <p className="text-sm font-bold text-gray-800 dark:text-white mt-1">
                {grades.length > 0 ? formatDate(grades[0].updatedAt) : 'لا يوجد'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades List */}
      {grades.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد نتائج امتحانات حالياً</p>
            <p className="text-gray-400 text-sm mt-1">اضغط على &quot;رفع نتائج جديدة&quot; أو &quot;استيراد بيانات تجريبية&quot; للبدء</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#2A374E] dark:text-blue-300" />
              صفوف النتائج
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">#</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">اسم الصف</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">عدد الطلاب</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">آخر تحديث</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, index) => (
                  <TableRow key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <TableCell className="text-gray-500 dark:text-gray-400 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#2A374E]/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-[#2A374E] dark:text-blue-300" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">{grade.gradeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 gap-1"
                      >
                        <Users className="w-3 h-3" />
                        {grade.studentCount} طالب
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(grade.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          setDeletingGrade(grade)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2A374E] dark:text-blue-300" />
              رفع نتائج امتحانات
            </DialogTitle>
            <DialogDescription>
              أدخل بيانات النتائج بصيغة JSON أو ارفع ملف JSON
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Grade Name */}
            <div className="space-y-2">
              <Label htmlFor="grade-name" className="font-medium">
                اسم الصف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="grade-name"
                value={gradeName}
                onChange={(e) => setGradeName(e.target.value)}
                placeholder="مثال: الأول الإعدادي"
                className="text-right"
              />
            </div>

            {/* Input Mode Switch */}
            <div className="space-y-2">
              <Label className="font-medium">طريقة الإدخال</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={inputMode === 'json' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('json')}
                  className={
                    inputMode === 'json'
                      ? 'bg-[#2A374E] hover:bg-[#1e2a3d] text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                >
                  لصق JSON
                </Button>
                <Button
                  type="button"
                  variant={inputMode === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInputMode('file')}
                  className={
                    inputMode === 'file'
                      ? 'bg-[#2A374E] hover:bg-[#1e2a3d] text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                >
                  رفع ملف
                </Button>
              </div>
            </div>

            {/* JSON Input */}
            {inputMode === 'json' ? (
              <div className="space-y-2">
                <Label htmlFor="json-data" className="font-medium">
                  بيانات JSON <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="json-data"
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder={`{
  "gradeName": "الأول الإعدادي",
  "results": [
    {
      "seatNumber": "71200",
      "studentName": "اسم الطالب",
      "arabic": 28.5,
      "english": 2,
      "social": 3,
      "math": 3,
      "science": 2.5,
      "total": 39,
      "religion": 11,
      "art": 5,
      "computer": 5
    }
  ]
}`}
                  rows={12}
                  className="font-mono text-sm text-left direction-ltr"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  الصيغة المطلوبة: كائن JSON يحتوي على gradeName ومصفوفة results
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#2A374E]/50 dark:hover:border-blue-400/50 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">ارفع ملف JSON</p>
                  <p className="text-gray-400 text-sm mb-4">اسحب الملف هنا أو اضغط للاختيار</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    اختيار ملف
                  </Button>
                </div>
                {jsonData && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">تم قراءة الملف بنجاح</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !gradeName.trim() || !jsonData.trim()}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'جارٍ الرفع...' : 'رفع النتائج'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف نتائج صف &quot;{deletingGrade?.gradeName}&quot;؟ سيتم حذف جميع نتائج الطلاب المرتبطة بهذا الصف ({deletingGrade?.studentCount} طالب). لا يمكن التراجع عن هذا الإجراء.
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
