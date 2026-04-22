'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Save,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
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

interface Student {
  id: string
  name: string
  classRoomId: string
  status: string
  classRoom: {
    id: string
    name: string
    grade: string
    section: string
  } | null
}

interface Grade {
  id: string
  studentId: string
  subjectId: string
  examType: string
  score: number
  maxScore: number
  term: string
  note: string | null
  createdAt: string
  student: {
    id: string
    name: string
    classRoom: {
      id: string
      name: string
      grade: string
      section: string
    } | null
  }
  subject: {
    id: string
    name: string
  }
}

interface GradeFormData {
  studentId: string
  subjectId: string
  examType: string
  score: string
  maxScore: string
  term: string
  note: string
}

interface BulkGradeEntry {
  studentId: string
  studentName: string
  score: string
  note: string
}

// ===== Constants =====

const TERM_OPTIONS = [
  { value: 'الفصل الأول', label: 'الفصل الأول' },
  { value: 'الفصل الثاني', label: 'الفصل الثاني' },
]

const EXAM_TYPE_OPTIONS = [
  { value: 'شهري', label: 'شهري' },
  { value: 'نصفي', label: 'نصفي' },
  { value: 'نهائي', label: 'نهائي' },
  { value: 'اختبار قصير', label: 'اختبار قصير' },
]

const GRADE_LEVELS = [
  { min: 90, label: 'ممتاز', bgClass: 'bg-emerald-100 dark:bg-emerald-900/30', textClass: 'text-emerald-700 dark:text-emerald-300', barClass: 'bg-emerald-500' },
  { min: 80, label: 'جيد جداً', bgClass: 'bg-sky-100 dark:bg-sky-900/30', textClass: 'text-sky-700 dark:text-sky-300', barClass: 'bg-sky-500' },
  { min: 70, label: 'جيد', bgClass: 'bg-yellow-100 dark:bg-yellow-900/30', textClass: 'text-yellow-700 dark:text-yellow-300', barClass: 'bg-yellow-500' },
  { min: 60, label: 'مقبول', bgClass: 'bg-orange-100 dark:bg-orange-900/30', textClass: 'text-orange-700 dark:text-orange-300', barClass: 'bg-orange-500' },
  { min: 0, label: 'راسب', bgClass: 'bg-red-100 dark:bg-red-900/30', textClass: 'text-red-700 dark:text-red-300', barClass: 'bg-red-500' },
]

const defaultFormData: GradeFormData = {
  studentId: '',
  subjectId: '',
  examType: 'شهري',
  score: '',
  maxScore: '100',
  term: 'الفصل الأول',
  note: '',
}

const ITEMS_PER_PAGE = 10

// ===== Helper Functions =====

function getGradeLevel(percentage: number) {
  return GRADE_LEVELS.find((level) => percentage >= level.min) || GRADE_LEVELS[GRADE_LEVELS.length - 1]
}

function getScoreBadge(score: number, maxScore: number) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0
  const level = getGradeLevel(pct)
  return (
    <Badge className={`${level.bgClass} ${level.textClass} border-0 text-xs font-medium`}>
      {level.label}
    </Badge>
  )
}

// ===== Component =====

export default function GradeManager() {
  // ===== Core Data =====
  const [grades, setGrades] = useState<Grade[]>([])
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  // ===== Filters =====
  const [filterClass, setFilterClass] = useState<string>('all')
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterTerm, setFilterTerm] = useState<string>('all')
  const [filterExamType, setFilterExamType] = useState<string>('all')
  const [filtersApplied, setFiltersApplied] = useState(false)

  // ===== Pagination =====
  const [currentPage, setCurrentPage] = useState(1)

  // ===== Add/Edit Dialog =====
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [formData, setFormData] = useState<GradeFormData>(defaultFormData)
  const [saving, setSaving] = useState(false)
  const [studentsForDialog, setStudentsForDialog] = useState<Student[]>([])

  // ===== Delete Dialog =====
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null)

  // ===== Bulk Entry =====
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [bulkClassId, setBulkClassId] = useState<string>('')
  const [bulkSubjectId, setBulkSubjectId] = useState<string>('')
  const [bulkExamType, setBulkExamType] = useState<string>('شهري')
  const [bulkTerm, setBulkTerm] = useState<string>('الفصل الأول')
  const [bulkMaxScore, setBulkMaxScore] = useState<string>('100')
  const [bulkEntries, setBulkEntries] = useState<BulkGradeEntry[]>([])
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkStudentsLoading, setBulkStudentsLoading] = useState(false)

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

  const fetchStudents = async (classRoomId?: string) => {
    try {
      const url = classRoomId ? `/api/students?classRoomId=${classRoomId}` : '/api/students'
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data)) {
        setStudents(data)
      }
    } catch {
      // silent
    }
  }

  const fetchGrades = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterClass && filterClass !== 'all') params.set('classRoomId', filterClass)
      if (filterSubject && filterSubject !== 'all') params.set('subjectId', filterSubject)
      if (filterTerm && filterTerm !== 'all') params.set('term', filterTerm)
      if (filterExamType && filterExamType !== 'all') params.set('examType', filterExamType)

      const res = await fetch(`/api/grades?${params.toString()}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setGrades(data)
        setCurrentPage(1)
      }
      setFiltersApplied(true)
    } catch {
      toast.error('حدث خطأ في جلب الدرجات')
    } finally {
      setLoading(false)
    }
  }, [filterClass, filterSubject, filterTerm, filterExamType])

  useEffect(() => {
    fetchClassrooms()
    fetchSubjects()
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  // Fetch students for the add/edit dialog when classroom changes
  const fetchStudentsForDialog = async (classRoomId?: string) => {
    try {
      const url = classRoomId ? `/api/students?classRoomId=${classRoomId}` : '/api/students'
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data)) {
        setStudentsForDialog(data.filter((s: Student) => s.status === 'نشط'))
      }
    } catch {
      // silent
    }
  }

  // ===== Pagination =====
  const totalPages = Math.max(1, Math.ceil(grades.length / ITEMS_PER_PAGE))
  const paginatedGrades = grades.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ===== Summary Computation =====
  const classSummary = (() => {
    if (filterClass === 'all' || grades.length === 0) return null

    const scores = grades.map((g) => (g.score / g.maxScore) * 100)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    const highest = Math.max(...scores)
    const lowest = Math.min(...scores)
    const passCount = scores.filter((s) => s >= 60).length
    const passRate = (passCount / scores.length) * 100

    // Distribution
    const distribution = GRADE_LEVELS.map((level) => ({
      label: level.label,
      count: scores.filter((s) => {
        if (level.min === 90) return s >= 90
        if (level.min === 80) return s >= 80 && s < 90
        if (level.min === 70) return s >= 70 && s < 80
        if (level.min === 60) return s >= 60 && s < 70
        return s < 60
      }).length,
      barClass: level.barClass,
      bgClass: level.bgClass,
      textClass: level.textClass,
    }))

    return { avg, highest, lowest, passRate, distribution, total: grades.length }
  })()

  // ===== Handlers =====

  const openAddDialog = () => {
    setEditingGrade(null)
    setFormData(defaultFormData)
    fetchStudentsForDialog()
    setDialogOpen(true)
  }

  const openEditDialog = (grade: Grade) => {
    setEditingGrade(grade)
    setFormData({
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      examType: grade.examType,
      score: String(grade.score),
      maxScore: String(grade.maxScore),
      term: grade.term,
      note: grade.note || '',
    })
    fetchStudentsForDialog(grade.student.classRoom?.id)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.studentId) {
      toast.error('يرجى اختيار الطالب')
      return
    }
    if (!formData.subjectId) {
      toast.error('يرجى اختيار المادة')
      return
    }
    if (!formData.examType) {
      toast.error('يرجى اختيار نوع الامتحان')
      return
    }
    if (!formData.score || isNaN(Number(formData.score))) {
      toast.error('يرجى إدخال درجة صحيحة')
      return
    }
    const scoreNum = Number(formData.score)
    const maxNum = Number(formData.maxScore) || 100
    if (scoreNum < 0 || scoreNum > maxNum) {
      toast.error('الدرجة يجب أن تكون بين 0 والدرجة العظمى')
      return
    }

    setSaving(true)
    try {
      const payload = {
        studentId: formData.studentId,
        subjectId: formData.subjectId,
        examType: formData.examType,
        score: scoreNum,
        maxScore: maxNum,
        term: formData.term,
        note: formData.note.trim() || null,
      }

      if (editingGrade) {
        const res = await fetch(`/api/grades/${editingGrade.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم تحديث الدرجة بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في التحديث')
          return
        }
      } else {
        const res = await fetch('/api/grades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          toast.success('تم إضافة الدرجة بنجاح')
        } else {
          const data = await res.json()
          toast.error(data.error || 'حدث خطأ في الإضافة')
          return
        }
      }
      setDialogOpen(false)
      fetchGrades()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingGrade) return
    try {
      const res = await fetch(`/api/grades/${deletingGrade.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('تم حذف الدرجة بنجاح')
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

  // ===== Bulk Entry Handlers =====

  const openBulkDialog = () => {
    setBulkClassId('')
    setBulkSubjectId('')
    setBulkExamType('شهري')
    setBulkTerm('الفصل الأول')
    setBulkMaxScore('100')
    setBulkEntries([])
    setBulkDialogOpen(true)
  }

  const loadBulkStudents = async () => {
    if (!bulkClassId) {
      toast.error('يرجى اختيار الفصل أولاً')
      return
    }
    setBulkStudentsLoading(true)
    try {
      const res = await fetch(`/api/students?classRoomId=${bulkClassId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const activeStudents = data.filter((s: Student) => s.status === 'نشط')
        setBulkEntries(
          activeStudents.map((s: Student) => ({
            studentId: s.id,
            studentName: s.name,
            score: '',
            note: '',
          }))
        )
      }
    } catch {
      toast.error('حدث خطأ في جلب الطلاب')
    } finally {
      setBulkStudentsLoading(false)
    }
  }

  const updateBulkScore = (studentId: string, score: string) => {
    setBulkEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, score } : e))
    )
  }

  const updateBulkNote = (studentId: string, note: string) => {
    setBulkEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, note } : e))
    )
  }

  const handleBulkSave = async () => {
    if (!bulkSubjectId) {
      toast.error('يرجى اختيار المادة')
      return
    }
    if (!bulkExamType) {
      toast.error('يرجى اختيار نوع الامتحان')
      return
    }

    const validEntries = bulkEntries.filter((e) => e.score !== '' && !isNaN(Number(e.score)))
    if (validEntries.length === 0) {
      toast.error('يرجى إدخال درجة طالب واحد على الأقل')
      return
    }

    const maxNum = Number(bulkMaxScore) || 100
    const invalidEntries = validEntries.filter(
      (e) => Number(e.score) < 0 || Number(e.score) > maxNum
    )
    if (invalidEntries.length > 0) {
      toast.error('بعض الدرجات خارج النطاق المسموح')
      return
    }

    setBulkSaving(true)
    try {
      let successCount = 0
      let errorCount = 0

      for (const entry of validEntries) {
        try {
          const res = await fetch('/api/grades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: entry.studentId,
              subjectId: bulkSubjectId,
              examType: bulkExamType,
              score: Number(entry.score),
              maxScore: maxNum,
              term: bulkTerm,
              note: entry.note.trim() || null,
            }),
          })
          if (res.ok) {
            successCount++
          } else {
            errorCount++
          }
        } catch {
          errorCount++
        }
      }

      if (successCount > 0) {
        toast.success(`تم حفظ ${successCount} درجة بنجاح${errorCount > 0 ? ` (${errorCount} أخطاء)` : ''}`)
      } else {
        toast.error('فشل في حفظ الدرجات')
      }

      setBulkDialogOpen(false)
      fetchGrades()
    } catch {
      toast.error('حدث خطأ في الحفظ')
    } finally {
      setBulkSaving(false)
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الدرجات</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">إضافة وتعديل ومتابعة درجات الطلاب</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={openBulkDialog}
            variant="outline"
            className="gap-2 border-[#2A374E]/30 text-[#2A374E] dark:text-blue-300 dark:border-blue-300/30"
          >
            <Users className="w-4 h-4" />
            إدراج جماعي
          </Button>
          <Button
            onClick={openAddDialog}
            className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة درجة
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

            {/* Term Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">الفصل الدراسي</Label>
              <Select value={filterTerm} onValueChange={setFilterTerm}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {TERM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exam Type Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">نوع الامتحان</Label>
              <Select value={filterExamType} onValueChange={setFilterExamType}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {EXAM_TYPE_OPTIONS.map((opt) => (
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
                onClick={() => fetchGrades()}
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

      {/* Class Grade Summary Card */}
      {classSummary && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#2A374E]" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">ملخص درجات الفصل</h3>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {classSummary.avg.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">متوسط الدرجات</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {classSummary.highest.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">أعلى درجة</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {classSummary.lowest.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">أقل درجة</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <Minus className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {classSummary.passRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">نسبة النجاح</p>
              </div>
            </div>

            {/* Grade Distribution Mini Bar Chart */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
                توزيع الدرجات ({classSummary.total} درجة)
              </p>
              <div className="space-y-2">
                {classSummary.distribution.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className={`text-xs font-medium min-w-[70px] text-left ${item.textClass}`}>
                      {item.label}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.barClass} rounded-full transition-all duration-500`}
                        style={{
                          width: `${classSummary.total > 0 ? (item.count / classSummary.total) * 100 : 0}%`,
                          minWidth: item.count > 0 ? '2rem' : '0',
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 min-w-[28px] text-center">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grades Table */}
      {grades.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد درجات</p>
            <p className="text-gray-400 text-sm mt-1">
              استخدم الفلاتر أعلاه لعرض الدرجات أو أضف درجة جديدة
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
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400">الطالب</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">المادة</TableHead>
                  <TableHead className="text-right font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">نوع الامتحان</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400">الدرجة</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">من</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">النسبة%</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">الفصل</TableHead>
                  <TableHead className="text-center font-medium text-gray-500 dark:text-gray-400">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGrades.map((grade, idx) => {
                  const pct = grade.maxScore > 0 ? (grade.score / grade.maxScore) * 100 : 0
                  const level = getGradeLevel(pct)

                  return (
                    <TableRow
                      key={grade.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                        {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {grade.student?.name || 'غير معروف'}
                          </p>
                          {grade.student?.classRoom && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {grade.student.classRoom.name} - {grade.student.classRoom.section}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary" className="bg-[#2A374E]/10 text-[#2A374E] dark:bg-[#2A374E]/20 dark:text-blue-300">
                          {grade.subject?.name || 'غير محدد'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-600 dark:text-gray-300">
                        {grade.examType}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-bold ${level.textClass}`}>
                            {grade.score}
                          </span>
                          {getScoreBadge(grade.score, grade.maxScore)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell text-sm text-gray-600 dark:text-gray-300">
                        {grade.maxScore}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${level.barClass} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[35px] text-center">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-center text-sm text-gray-600 dark:text-gray-300">
                        {grade.term}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(grade)}
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setDeletingGrade(grade)
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
                عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, grades.length)} من {grades.length}
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

      {/* ===== Add/Edit Grade Dialog ===== */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#2A374E]" />
              {editingGrade ? 'تعديل الدرجة' : 'إضافة درجة جديدة'}
            </DialogTitle>
            <DialogDescription>
              {editingGrade ? 'قم بتعديل بيانات الدرجة' : 'أدخل بيانات الدرجة الجديدة'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Student Selection */}
            <div className="space-y-2">
              <Label>
                اختيار الطالب <span className="text-red-500">*</span>
              </Label>
              {!editingGrade && (
                <div className="mb-2">
                  <Select
                    value={formData.studentId ? 'selected' : 'none'}
                    onValueChange={() => {}}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الطالب" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {classrooms.map((cls) => {
                        const classStudents = studentsForDialog.filter(
                          (s) => s.classRoomId === cls.id
                        )
                        if (classStudents.length === 0) return null
                        return (
                          <div key={cls.id}>
                            <div className="px-2 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 sticky top-0">
                              {cls.name} - {cls.section}
                            </div>
                            {classStudents.map((student) => (
                              <SelectItem
                                key={student.id}
                                value={student.id}
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, studentId: student.id }))
                                }
                              >
                                {student.name}
                              </SelectItem>
                            ))}
                          </div>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {editingGrade && (
                <Input
                  value={editingGrade.student?.name || ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              )}
              {formData.studentId && !editingGrade && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ تم اختيار: {studentsForDialog.find((s) => s.id === formData.studentId)?.name}
                </p>
              )}
            </div>

            {/* Subject & Exam Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  المادة <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, subjectId: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  نوع الامتحان <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.examType}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, examType: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر نوع الامتحان" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Score & Max Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  الدرجة <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.score}
                  onChange={(e) => setFormData((prev) => ({ ...prev, score: e.target.value }))}
                  placeholder="أدخل الدرجة"
                />
              </div>

              <div className="space-y-2">
                <Label>من (الدرجة العظمى)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxScore}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxScore: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>

            {/* Score Preview */}
            {formData.score && formData.maxScore && !isNaN(Number(formData.score)) && Number(formData.maxScore) > 0 && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">النسبة المئوية</span>
                  <span className="text-sm font-bold">
                    {((Number(formData.score) / Number(formData.maxScore)) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={(Number(formData.score) / Number(formData.maxScore)) * 100}
                  className="h-2"
                />
              </div>
            )}

            {/* Term */}
            <div className="space-y-2">
              <Label>الفصل الدراسي</Label>
              <Select
                value={formData.term}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, term: val }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الفصل الدراسي" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label>ملاحظة (اختياري)</Label>
              <Textarea
                value={formData.note}
                onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                placeholder="أدخل ملاحظة إن وجدت"
                rows={3}
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
              {editingGrade ? 'تحديث' : 'إضافة'}
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
              هل أنت متأكد من حذف درجة الطالب &quot;{deletingGrade?.student?.name}&quot; في مادة &quot;{deletingGrade?.subject?.name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
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

      {/* ===== Bulk Grade Entry Dialog ===== */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2A374E]" />
              إدراج درجات جماعي
            </DialogTitle>
            <DialogDescription>
              اختر الفصل والمادة ونوع الامتحان ثم أدخل درجات جميع الطلاب دفعة واحدة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Selection Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  الفصل <span className="text-red-500">*</span>
                </Label>
                <Select value={bulkClassId} onValueChange={setBulkClassId}>
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
                <Label>
                  المادة <span className="text-red-500">*</span>
                </Label>
                <Select value={bulkSubjectId} onValueChange={setBulkSubjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  نوع الامتحان <span className="text-red-500">*</span>
                </Label>
                <Select value={bulkExamType} onValueChange={setBulkExamType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر نوع الامتحان" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الفصل الدراسي</Label>
                <Select value={bulkTerm} onValueChange={setBulkTerm}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر الفصل الدراسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>من (الدرجة العظمى)</Label>
                <Input
                  type="number"
                  min="1"
                  value={bulkMaxScore}
                  onChange={(e) => setBulkMaxScore(e.target.value)}
                  placeholder="100"
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={loadBulkStudents}
                  disabled={!bulkClassId || bulkStudentsLoading}
                  className="w-full bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2"
                >
                  {bulkStudentsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  تحميل الطلاب
                </Button>
              </div>
            </div>

            {/* Students List for Bulk Entry */}
            {bulkEntries.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    طلاب الفصل ({bulkEntries.length} طالب)
                  </p>
                  <p className="text-xs text-gray-400">
                    اترك درجة الطالب فارغة لتجاهله
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead className="text-right w-8">#</TableHead>
                        <TableHead className="text-right">الطالب</TableHead>
                        <TableHead className="text-center w-32">الدرجة</TableHead>
                        <TableHead className="text-right w-40 hidden sm:table-cell">ملاحظة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkEntries.map((entry, idx) => {
                        const maxNum = Number(bulkMaxScore) || 100
                        const scoreNum = Number(entry.score)
                        const pct = entry.score && !isNaN(scoreNum) && maxNum > 0
                          ? (scoreNum / maxNum) * 100
                          : -1
                        const level = pct >= 0 ? getGradeLevel(pct) : null

                        return (
                          <TableRow key={entry.studentId}>
                            <TableCell className="text-sm text-gray-400">{idx + 1}</TableCell>
                            <TableCell className="font-medium text-gray-800 dark:text-white text-sm">
                              {entry.studentName}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col items-center gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  max={bulkMaxScore || 100}
                                  value={entry.score}
                                  onChange={(e) => updateBulkScore(entry.studentId, e.target.value)}
                                  placeholder="—"
                                  className="h-9 w-24 text-center text-sm"
                                />
                                {level && (
                                  <Badge className={`${level.bgClass} ${level.textClass} border-0 text-[10px] px-1.5 py-0`}>
                                    {level.label}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Input
                                value={entry.note}
                                onChange={(e) => updateBulkNote(entry.studentId, e.target.value)}
                                placeholder="ملاحظة..."
                                className="h-9 text-sm"
                              />
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleBulkSave}
              disabled={bulkSaving || bulkEntries.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {bulkSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ الكل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
