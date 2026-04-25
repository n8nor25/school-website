'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  AlertCircle,
  CheckCircle,
  FileUp,
  ClipboardPaste,
  X,
  ArrowLeftRight,
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

// ===== Arabic-to-English column mapping =====
// Comprehensive mapping including all common Arabic column name variants
// Handles both ي and ى (ya and alef maqsura) variations
const ARABIC_TO_ENGLISH: Record<string, string> = {
  // seatNumber - رقم الجلوس / رقم المقعد
  'رقم الجلوس': 'seatNumber',
  'الرقم': 'seatNumber',
  'رقم': 'seatNumber',
  'جلسة': 'seatNumber',
  'رقم المقعد': 'seatNumber',
  'المقعد': 'seatNumber',
  'رقم الجلوس/الرقم القومي': 'seatNumber',
  'رقم الجلوس / الرقم القومي': 'seatNumber',
  'رقم الجلوس/الرقم القومى': 'seatNumber',
  'رقم الجلوس / الرقم القومى': 'seatNumber',

  // studentName - اسم الطالب
  'اسم الطالب': 'studentName',
  'الاسم': 'studentName',
  'اسم': 'studentName',
  'اسم الطالب بالكامل': 'studentName',
  'إسم الطالب': 'studentName',
  'الإسم': 'studentName',
  'إسم': 'studentName',
  'اسم الطالب': 'studentName',
  'اسم الطالب بالكامل': 'studentName',

  // arabic - اللغة العربية (handles both ي and ى)
  'عربي': 'arabic',
  'عربى': 'arabic',
  'العربي': 'arabic',
  'العربى': 'arabic',
  'لغة عربية': 'arabic',
  'لغه عربيه': 'arabic',
  'لغه عربية': 'arabic',
  'لغة عربيه': 'arabic',
  'اللغة العربية': 'arabic',
  'اللغه العربية': 'arabic',
  'اللغه العربيه': 'arabic',
  'اللغة العربيه': 'arabic',
  'العربية': 'arabic',
  'العربيه': 'arabic',

  // english - اللغة الإنجليزية (handles both ي and ى, plus "E" abbreviation)
  'انجليزي': 'english',
  'انجليزى': 'english',
  'الانجليزي': 'english',
  'الانجليزى': 'english',
  'الإنجليزي': 'english',
  'الإنجليزى': 'english',
  'لغة انجليزية': 'english',
  'لغه انجليزيه': 'english',
  'لغة انجليزيه': 'english',
  'لغه انجليزية': 'english',
  'اللغة الإنجليزية': 'english',
  'اللغه الإنجليزيه': 'english',
  'اللغه الانجليزيه': 'english',
  'اللغة الانجليزية': 'english',
  'انجليزية': 'english',
  'انجليزيه': 'english',
  'E': 'english',
  'e': 'english',
  'انجليش': 'english',

  // social - الدراسات الاجتماعية (handles both ي and ى)
  'دراسات': 'social',
  'الدراسات': 'social',
  'دراسات اجتماعية': 'social',
  'دراسات اجتماعيه': 'social',
  'الدراسات الاجتماعية': 'social',
  'الدراسات الاجتماعيه': 'social',
  'اجتماعيات': 'social',
  'الاجتماعيات': 'social',

  // math components - جبر and هندسة map separately
  // They will be COMBINED into math later
  'جبر': '_algebra',
  'الجبر': '_algebra',
  'هندسة': '_geometry',
  'الهندسة': '_geometry',
  'هندسه': '_geometry',
  'الهندسه': '_geometry',

  // math - الرياضيات (combined, if already combined in source)
  'رياضيات': 'math',
  'الرياضيات': 'math',
  'رياضه': 'math',
  'الرياضة': 'math',
  'حساب': 'math',
  'الحساب': 'math',
  'رياضيات وشكل': 'math',

  // science - العلوم
  'علوم': 'science',
  'العلوم': 'science',
  'العوم': 'science',

  // total - المجموع (handles both ي and ى)
  'المجموع': 'total',
  'مجموع': 'total',
  'المجموع الكلي': 'total',
  'المجموع الكلى': 'total',
  'الاجمالي': 'total',
  'الإجمالي': 'total',
  'الاجمالى': 'total',
  'الإجمالى': 'total',
  'مجموع المواد': 'total',

  // religion - التربية الدينية (handles both ي and ى)
  'دين': 'religion',
  'الدين': 'religion',
  'تربية دينية': 'religion',
  'تربيه دينيه': 'religion',
  'التربية الدينية': 'religion',
  'التربيه الدينيه': 'religion',
  'ديني': 'religion',
  'الدينية': 'religion',
  'الدينيه': 'religion',

  // art - التربية الفنية / رسم (handles both ي and ى)
  'فنية': 'art',
  'الفنية': 'art',
  'فنيه': 'art',
  'الفنيه': 'art',
  'تربية فنية': 'art',
  'تربيه فنيه': 'art',
  'التربية الفنية': 'art',
  'التربيه الفنيه': 'art',
  'فنون': 'art',
  'الفنون': 'art',
  'رسم': 'art',
  'الرسم': 'art',
  'تربية فنية وموسيقى': 'art',
  'التربية الفنية والموسيقى': 'art',

  // computer - الحاسب الآلي (handles both ي and ى)
  'كمبيوتر': 'computer',
  'الكمبيوتر': 'computer',
  'حاسب': 'computer',
  'الحاسب': 'computer',
  'حاسب آلي': 'computer',
  'الحاسب الآلي': 'computer',
  'الحاسب الالى': 'computer',
  'حاسب الى': 'computer',
  'الحاسوب': 'computer',
  'تكنولوجيا': 'computer',
  'تكنولوجيا المعلومات': 'computer',
  'كمبيوتر وتكنولوجيا': 'computer',
  'معلومات': 'computer',

  // gradeName - المرحلة/الصف
  'المرحلة': 'gradeName',
  'الصف': 'gradeName',
  'المرحله': 'gradeName',
  'الصف الدراسي': 'gradeName',

  // Fields that should be ignored
  'المدرسة': '_ignore',
  'مدرسة': '_ignore',
  'الادارة': '_ignore',
  'ادارة': '_ignore',
  'الإدارة': '_ignore',
  'المديرية': '_ignore',
  'الشعبة': '_ignore',
  'شعبة': '_ignore',
  'الشعبه': '_ignore',
  'الرقم الوطني': '_ignore',
  'رقم قومي': '_ignore',
  'الرقم القومي': '_ignore',
  'الرقم القومى': '_ignore',
  'رقم قومى': '_ignore',
  'رقم الوطني': '_ignore',
  'الهاتف': '_ignore',
  'العمر': '_ignore',
  'النسبة': '_ignore',
  'نسبة': '_ignore',
  'الدرجة': '_ignore',
  'درجة': '_ignore',
  'التقدير': '_ignore',
  'الحالة': '_ignore',
  'حالة': '_ignore',
  'ملاحظات': '_ignore',
  'ملاحظه': '_ignore',
  'الحاله': '_ignore',
  'النسبه': '_ignore',
  'التربية الوطنية': '_ignore',
  'التربيه الوطنيه': '_ignore',
  'السلوك': '_ignore',
  'المواظبة': '_ignore',
}

/**
 * Worksheet name to grade name mapping
 * Handles Arabic worksheet names like "الصف الاول", "الصف الثانى", etc.
 */
const WORKSHEET_GRADE_MAP: Record<string, string> = {
  'الصف الاول': 'الأول الإعدادي',
  'الصف الأول': 'الأول الإعدادي',
  'الصف الاول الاعدادي': 'الأول الإعدادي',
  'الصف الأول الإعدادي': 'الأول الإعدادي',
  'الأول الإعدادي': 'الأول الإعدادي',
  'الاول الاعدادي': 'الأول الإعدادي',
  'الصف الثانى': 'الثاني الإعدادي',
  'الصف الثاني': 'الثاني الإعدادي',
  'الصف الثانى الاعدادي': 'الثاني الإعدادي',
  'الصف الثاني الإعدادي': 'الثاني الإعدادي',
  'الثاني الإعدادي': 'الثاني الإعدادي',
  'الثانى الاعدادي': 'الثاني الإعدادي',
  'الصف الثالث': 'الثالث الإعدادي',
  'الصف الثالث الاعدادي': 'الثالث الإعدادي',
  'الصف الثالث الإعدادي': 'الثالث الإعدادي',
  'الثالث الإعدادي': 'الثالث الإعدادي',
  'الثالث الاعدادي': 'الثالث الإعدادي',
}

/**
 * Normalize a worksheet key to a grade name
 */
function normalizeWorksheetKey(key: string): string {
  const trimmed = key.trim()
  // Check direct match first
  if (WORKSHEET_GRADE_MAP[trimmed]) {
    return WORKSHEET_GRADE_MAP[trimmed]
  }
  // Check case-insensitive
  const lowerKey = trimmed.toLowerCase()
  for (const [k, v] of Object.entries(WORKSHEET_GRADE_MAP)) {
    if (k.toLowerCase() === lowerKey) return v
  }
  // Return as-is if no match (user can edit it)
  return trimmed
}

/**
 * Normalize a single result object: convert Arabic keys to English
 * Handles combining جبر + هندسة into math
 */
function normalizeResult(raw: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}
  let algebra = 0
  let geometry = 0
  let hasAlgebra = false
  let hasGeometry = false

  for (const [key, value] of Object.entries(raw)) {
    const trimmedKey = key.trim()
    // Check if key is already an English field name
    if (['seatNumber', 'studentName', 'arabic', 'english', 'social', 'math', 'science', 'total', 'religion', 'art', 'computer', 'gradeName'].includes(trimmedKey)) {
      normalized[trimmedKey] = value
    } else if (ARABIC_TO_ENGLISH[trimmedKey]) {
      const mapped = ARABIC_TO_ENGLISH[trimmedKey]
      if (mapped === '_ignore') {
        // Skip this field
      } else if (mapped === '_algebra') {
        algebra = Number(value) || 0
        hasAlgebra = true
      } else if (mapped === '_geometry') {
        geometry = Number(value) || 0
        hasGeometry = true
      } else {
        normalized[mapped] = value
      }
    } else {
      // Try case-insensitive match
      const lowerKey = trimmedKey.toLowerCase()
      const match = Object.keys(ARABIC_TO_ENGLISH).find(k => k.toLowerCase() === lowerKey)
      if (match) {
        const mapped = ARABIC_TO_ENGLISH[match]
        if (mapped === '_ignore') {
          // Skip
        } else if (mapped === '_algebra') {
          algebra = Number(value) || 0
          hasAlgebra = true
        } else if (mapped === '_geometry') {
          geometry = Number(value) || 0
          hasGeometry = true
        } else {
          normalized[mapped] = value
        }
      }
      // If no match, skip the field (don't keep unrecognized keys)
    }
  }

  // Combine جبر + هندسة into math if either exists
  if (hasAlgebra || hasGeometry) {
    // If math already exists, add algebra + geometry to it
    const existingMath = Number(normalized.math) || 0
    if (hasAlgebra && hasGeometry) {
      normalized.math = algebra + geometry
    } else if (hasAlgebra) {
      normalized.math = existingMath + algebra
    } else {
      normalized.math = existingMath + geometry
    }
  }

  return normalized
}

/**
 * Detect worksheet-based JSON structure: { "الصف الاول": [...], "الصف الثانى": [...] }
 * Returns array of { gradeName, results } or null if not worksheet format
 */
function detectWorksheetStructure(data: unknown): { gradeName: string; results: Record<string, unknown>[] }[] | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null
  }

  const obj = data as Record<string, unknown>
  const entries = Object.entries(obj)

  // If it has gradeName and results fields, it's standard format
  if (obj.gradeName || obj.results) {
    return null
  }

  // Check if all values are arrays (worksheet format)
  const worksheetEntries: { gradeName: string; results: Record<string, unknown>[] }[] = []
  for (const [key, value] of entries) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const gradeName = normalizeWorksheetKey(key)
      worksheetEntries.push({ gradeName, results: value as Record<string, unknown>[] })
    }
  }

  return worksheetEntries.length > 0 ? worksheetEntries : null
}

/**
 * Normalize an entire upload payload (array or object with results)
 * Converts Arabic column names to English automatically
 * Handles worksheet-based JSON structure
 */
function normalizePayload(data: unknown): { grades: { gradeName: string; results: Record<string, unknown>[] }[]; convertedCount: number } {
  let grades: { gradeName: string; results: Record<string, unknown>[] }[] = []
  let convertedCount = 0

  // Check for worksheet structure first
  const worksheets = detectWorksheetStructure(data)
  if (worksheets) {
    for (const ws of worksheets) {
      const normalizedResults = ws.results.map((item) => {
        const normalized = normalizeResult(item)
        const hasArabicKeys = Object.keys(item).some(k => {
          const trimmed = k.trim()
          return ARABIC_TO_ENGLISH[trimmed] && ARABIC_TO_ENGLISH[trimmed] !== '_ignore'
        })
        if (hasArabicKeys) convertedCount++
        return normalized
      })
      grades.push({
        gradeName: ws.gradeName,
        results: normalizedResults,
      })
    }
  } else if (Array.isArray(data)) {
    // Simple array of results
    const normalizedResults = (data as Record<string, unknown>[]).map((item) => {
      const normalized = normalizeResult(item)
      const hasArabicKeys = Object.keys(item).some(k => {
        const trimmed = k.trim()
        return ARABIC_TO_ENGLISH[trimmed] && ARABIC_TO_ENGLISH[trimmed] !== '_ignore'
      })
      if (hasArabicKeys) convertedCount++
      return normalized
    })
    grades.push({ gradeName: '', results: normalizedResults })
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (obj.results && Array.isArray(obj.results)) {
      // Standard { gradeName, results } format
      const normalizedResults = (obj.results as Record<string, unknown>[]).map((item) => {
        const normalized = normalizeResult(item)
        const hasArabicKeys = Object.keys(item).some(k => {
          const trimmed = k.trim()
          return ARABIC_TO_ENGLISH[trimmed] && ARABIC_TO_ENGLISH[trimmed] !== '_ignore'
        })
        if (hasArabicKeys) convertedCount++
        return normalized
      })
      grades.push({
        gradeName: String(obj.gradeName || ''),
        results: normalizedResults,
      })
    } else {
      // Single result object
      const normalized = normalizeResult(obj)
      const hasArabicKeys = Object.keys(obj).some(k => {
        const trimmed = k.trim()
        return ARABIC_TO_ENGLISH[trimmed] && ARABIC_TO_ENGLISH[trimmed] !== '_ignore'
      })
      if (hasArabicKeys) convertedCount++
      grades.push({ gradeName: '', results: [normalized] })
    }
  }

  // Auto-calculate totals for all results
  for (const grade of grades) {
    grade.results = grade.results.map(autoCalculateTotal)
  }

  // Remove gradeName from individual results
  for (const grade of grades) {
    grade.results = grade.results.map(({ gradeName: _gn, ...rest }) => rest)
  }

  return { grades, convertedCount }
}

/**
 * Auto-calculate total if missing or zero
 * Total = sum of added subjects (arabic, english, social, math, science)
 */
function autoCalculateTotal(result: Record<string, unknown>): Record<string, unknown> {
  const addedSubjects = ['arabic', 'english', 'social', 'math', 'science'] as const
  const currentTotal = Number(result.total) || 0

  if (currentTotal === 0) {
    const calculatedTotal = addedSubjects.reduce((sum, subject) => {
      return sum + (Number(result[subject]) || 0)
    }, 0)
    if (calculatedTotal > 0) {
      return { ...result, total: calculatedTotal }
    }
  }

  return result
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
  const [inputMode, setInputMode] = useState<'json' | 'file'>('file')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [fileReadSuccess, setFileReadSuccess] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [conversionInfo, setConversionInfo] = useState<string | null>(null)
  const [multiGradeInfo, setMultiGradeInfo] = useState<string | null>(null)

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
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    document.addEventListener('dragover', preventDefaults)
    document.addEventListener('drop', preventDefaults)
    return () => {
      document.removeEventListener('dragover', preventDefaults)
      document.removeEventListener('drop', preventDefaults)
    }
  }, [])

  useEffect(() => {
    fetchGrades()
  }, [])

  const resetUploadForm = useCallback(() => {
    setGradeName('')
    setJsonData('')
    setInputMode('file')
    setSelectedFileName('')
    setFileReadSuccess(false)
    setJsonError(null)
    setConversionInfo(null)
    setMultiGradeInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const openUploadDialog = () => {
    resetUploadForm()
    setUploadDialogOpen(true)
  }

  const processParsedData = (parsed: unknown) => {
    // Normalize Arabic columns to English
    const { grades: parsedGrades, convertedCount } = normalizePayload(parsed)

    if (parsedGrades.length === 0 || parsedGrades.every(g => g.results.length === 0)) {
      setJsonError('لم يتم العثور على بيانات صالحة في الملف')
      toast.error('لم يتم العثور على بيانات صالحة في الملف')
      return
    }

    if (parsedGrades.length === 1) {
      // Single grade
      const grade = parsedGrades[0]
      if (grade.gradeName && !gradeName) {
        setGradeName(grade.gradeName)
      }

      const payload = {
        gradeName: grade.gradeName || gradeName,
        results: grade.results,
      }

      setJsonData(JSON.stringify(payload, null, 2))
      setFileReadSuccess(true)
      setMultiGradeInfo(null)

      if (convertedCount > 0) {
        setConversionInfo(`تم تحويل ${convertedCount} سجل من الأعمدة العربية إلى الإنجليزية تلقائياً`)
        toast.success(`تم قراءة الملف وتحويل الأعمدة تلقائياً - ${grade.results.length} طالب`, {
          description: 'تم تحويل أسماء الأعمدة العربية إلى الإنجليزية',
          duration: 5000,
        })
      } else {
        toast.success(`تم قراءة الملف بنجاح - ${grade.results.length} طالب`)
      }
    } else {
      // Multiple grades (worksheet format) - upload all at once
      const totalStudents = parsedGrades.reduce((sum, g) => sum + g.results.length, 0)
      const gradeNames = parsedGrades.map(g => g.gradeName).filter(Boolean).join('، ')

      setMultiGradeInfo(`تم اكتشاف ${parsedGrades.length} أوراق عمل: ${gradeNames}`)

      // Store all grades data for batch upload
      const batchData = parsedGrades.map(g => ({
        gradeName: g.gradeName,
        results: g.results,
      }))

      setJsonData(JSON.stringify(batchData, null, 2))
      setFileReadSuccess(true)

      // Set first grade name as default
      if (parsedGrades[0].gradeName) {
        setGradeName(parsedGrades[0].gradeName)
      }

      if (convertedCount > 0) {
        setConversionInfo(`تم تحويل ${convertedCount} سجل من الأعمدة العربية إلى الإنجليزية تلقائياً`)
      }

      toast.success(`تم قراءة ${parsedGrades.length} أوراق عمل - ${totalStudents} طالب إجمالاً`, {
        description: gradeNames,
        duration: 6000,
      })
    }

    setInputMode('json')
  }

  const processFile = async (file: File) => {
    setSelectedFileName(file.name)
    setFileReadSuccess(false)
    setJsonError(null)
    setConversionInfo(null)
    setMultiGradeInfo(null)

    try {
      const text = await file.text()
      let parsed: unknown

      try {
        parsed = JSON.parse(text)
      } catch {
        setJsonError('فشل في تحليل الملف. تأكد من أنه ملف JSON صالح')
        toast.error('فشل في تحليل الملف. تأكد من أنه ملف JSON صالح')
        return
      }

      processParsedData(parsed)
    } catch {
      setJsonError('فشل في قراءة الملف. تأكد من أنه ملف JSON صالح')
      toast.error('فشل في قراءة الملف. تأكد من أنه ملف JSON صالح')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const validateJsonData = (data: string): { valid: boolean; error: string | null; resultCount: number; isMultiGrade: boolean } => {
    if (!data.trim()) {
      return { valid: false, error: null, resultCount: 0, isMultiGrade: false }
    }
    try {
      const parsed = JSON.parse(data)

      // Check for multi-grade format (array of grade objects)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].gradeName && Array.isArray(parsed[0].results)) {
        const totalResults = parsed.reduce((sum: number, g: { results: unknown[] }) => sum + g.results.length, 0)
        // Check that results have English fields
        if (parsed[0].results.length > 0) {
          const first = parsed[0].results[0] as Record<string, unknown>
          if (!first.seatNumber && !first.studentName) {
            return { valid: false, error: 'الأعمدة باللغة العربية. يرجى رفع الملف مرة أخرى ليتم التحويل تلقائياً', resultCount: 0, isMultiGrade: false }
          }
        }
        return { valid: true, error: null, resultCount: totalResults, isMultiGrade: true }
      }

      if (parsed.results && Array.isArray(parsed.results)) {
        if (parsed.results.length > 0) {
          const first = parsed.results[0]
          if (!first.seatNumber && !first.studentName) {
            return { valid: false, error: 'الأعمدة باللغة العربية. يرجى رفع الملف مرة أخرى ليتم التحويل تلقائياً', resultCount: 0, isMultiGrade: false }
          }
        }
        return { valid: true, error: null, resultCount: parsed.results.length, isMultiGrade: false }
      } else if (Array.isArray(parsed)) {
        return { valid: true, error: null, resultCount: parsed.length, isMultiGrade: false }
      } else {
        return { valid: false, error: 'صيغة البيانات غير صحيحة. يجب أن تحتوي على مصفوفة results', resultCount: 0, isMultiGrade: false }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'خطأ في صيغة JSON'
      const posMatch = errorMsg.match(/position (\d+)/i)
      if (posMatch) {
        return { valid: false, error: `خطأ في صيغة JSON عند الموضع ${posMatch[1]}`, resultCount: 0, isMultiGrade: false }
      }
      return { valid: false, error: 'بيانات JSON غير صالحة', resultCount: 0, isMultiGrade: false }
    }
  }

  const handleUpload = async () => {
    if (!jsonData.trim()) {
      toast.error('يرجى إدخال بيانات النتائج أو رفع ملف JSON')
      return
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonData)
      // Re-normalize in case user pasted Arabic JSON directly
      const { grades: parsedGrades } = normalizePayload(parsed)

      if (parsedGrades.length === 0) {
        toast.error('صيغة البيانات غير صحيحة')
        return
      }

      if (parsedGrades.length > 1 || (parsedGrades.length === 1 && parsedGrades[0].gradeName && !gradeName.trim())) {
        // Multi-grade upload - upload each grade separately
        setUploading(true)
        let totalUploaded = 0
        let errorCount = 0

        for (const grade of parsedGrades) {
          if (grade.results.length === 0) continue

          // Validate required fields
          let hasError = false
          for (let i = 0; i < grade.results.length; i++) {
            if (!grade.results[i].seatNumber || !grade.results[i].studentName) {
              toast.error(`${grade.gradeName}: السطر ${i + 1} - رقم الجلوس واسم الطالب مطلوبان`)
              hasError = true
              break
            }
          }
          if (hasError) {
            errorCount++
            continue
          }

          try {
            const res = await fetch('/api/exam-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                gradeName: grade.gradeName,
                results: grade.results,
              }),
            })

            if (res.ok) {
              const data = await res.json()
              totalUploaded += data.resultsCount
            } else {
              errorCount++
              const data = await res.json()
              console.error(`Error uploading ${grade.gradeName}:`, data.error)
            }
          } catch {
            errorCount++
          }
        }

        if (totalUploaded > 0) {
          toast.success(`تم رفع النتائج بنجاح - ${totalUploaded} طالب في ${parsedGrades.length} صفوف`, {
            icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
          })
          setUploadDialogOpen(false)
          resetUploadForm()
          fetchGrades()
        }

        if (errorCount > 0) {
          toast.warning(`فشل رفع ${errorCount} صفوف`)
        }

        setUploading(false)
        return
      }

      // Single grade upload
      const grade = parsedGrades[0]
      const uploadPayload: UploadPayload = {
        gradeName: gradeName.trim() || grade.gradeName,
        results: grade.results as ExamResultEntry[],
      }

      if (uploadPayload.results.length === 0) {
        toast.error('لا توجد نتائج للرفع')
        return
      }

      // Validate required fields
      for (let i = 0; i < uploadPayload.results.length; i++) {
        if (!uploadPayload.results[i].seatNumber || !uploadPayload.results[i].studentName) {
          toast.error(`السطر ${i + 1}: رقم الجلوس واسم الطالب مطلوبان`)
          return
        }
      }

      setUploading(true)
      try {
        const res = await fetch('/api/exam-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadPayload),
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
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('حدث خطأ في الاتصال بالخادم')
      } finally {
        setUploading(false)
      }
    } catch {
      toast.error('بيانات JSON غير صالحة. تأكد من الصيغة الصحيحة')
      return
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

  const jsonValidation = validateJsonData(jsonData)
  const canUpload = jsonData.trim() && jsonValidation.valid && (jsonValidation.isMultiGrade || gradeName.trim())

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
              ارفع ملف JSON بأسماء أعمدة عربية أو إنجليزية - التحويل تلقائي
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
              {multiGradeInfo && (
                <p className="text-xs text-blue-600 dark:text-blue-400">{multiGradeInfo}</p>
              )}
            </div>

            {/* Input Mode Switch */}
            <div className="space-y-2">
              <Label className="font-medium">طريقة الإدخال</Label>
              <div className="flex gap-2">
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
                  <FileUp className="w-4 h-4 ml-1" />
                  رفع ملف
                </Button>
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
                  <ClipboardPaste className="w-4 h-4 ml-1" />
                  لصق JSON
                </Button>
              </div>
            </div>

            {/* File Upload Mode */}
            {inputMode === 'file' ? (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  id="results-file-input"
                  type="file"
                  accept=".json,application/json,text/plain,.txt"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="results-file-input"
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer hover:border-[#2A374E]/50 dark:hover:border-blue-400/50 hover:bg-[#2A374E]/5 dark:hover:bg-[#2A374E]/10 active:scale-[0.98]"
                >
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                    ارفع ملف JSON من جهازك
                  </p>
                  <p className="text-gray-400 text-sm mb-2">
                    اضغط هنا لاختيار ملف النتائج
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 mb-4">
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>يدعم الأعمدة العربية والإنجليزية تلقائياً</span>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A374E] text-white text-sm font-medium hover:bg-[#1e2a3d] transition-colors">
                    <Upload className="w-4 h-4" />
                    اختيار ملف
                  </span>
                </label>

                {conversionInfo && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 flex items-center gap-2 border border-blue-200 dark:border-blue-800">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {conversionInfo}
                    </span>
                  </div>
                )}

                {multiGradeInfo && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 flex items-center gap-2 border border-purple-200 dark:border-purple-800">
                    <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      {multiGradeInfo}
                    </span>
                  </div>
                )}

                {fileReadSuccess && !conversionInfo && !multiGradeInfo && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      تم قراءة الملف بنجاح {selectedFileName && `- ${selectedFileName}`}
                    </span>
                  </div>
                )}
                {jsonData && inputMode === 'file' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-500">معاينة البيانات:</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setInputMode('json')}
                      >
                        تعديل البيانات
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700">
                      <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words font-mono" dir="ltr">
                        {jsonData.length > 2000 ? jsonData.substring(0, 2000) + '\n... (تم اقتطاع المعاينة)' : jsonData}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* JSON Paste Mode */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="json-data" className="font-medium">
                    بيانات JSON <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1">
                      <ArrowLeftRight className="w-3 h-3" />
                      تحويل تلقائي
                    </span>
                    {jsonData && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-red-500 hover:text-red-700"
                        onClick={() => {
                          setJsonData('')
                          setJsonError(null)
                          setFileReadSuccess(false)
                          setSelectedFileName('')
                          setConversionInfo(null)
                          setMultiGradeInfo(null)
                        }}
                      >
                        <X className="w-3 h-3 ml-1" />
                        مسح
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
                  id="json-data"
                  value={jsonData}
                  onChange={(e) => {
                    setJsonData(e.target.value)
                    setJsonError(null)
                    setFileReadSuccess(false)
                  }}
                  placeholder={`يمكنك لصق JSON بأسماء أعمدة عربية أو إنجليزية:

أمثلة أسماء الأعمدة العربية:
"رقم الجلوس" أو "الرقم" → seatNumber
"اسم الطالب" أو "الاسم" → studentName
"عربي" أو "عربى" أو "اللغة العربية" → arabic
"E" أو "انجليزي" أو "اللغة الإنجليزية" → english
"دراسات" أو "الدراسات الاجتماعية" → social
"جبر" + "هندسة" → math (يتم جمعهما تلقائياً)
"رياضيات" → math
"علوم" أو "العلوم" → science
"المجموع" → total
"دين" أو "التربية الدينية" → religion
"رسم" أو "فنية" أو "التربية الفنية" → art
"حاسب" أو "الحاسب الآلي" → computer

يدعم أوراق العمل المتعددة:
{ "الصف الاول": [...], "الصف الثانى": [...] }`}
                  rows={12}
                  className="font-mono text-sm text-left direction-ltr"
                  dir="ltr"
                />
                {/* Real-time validation feedback */}
                {jsonData.trim() && (
                  <div className="mt-1">
                    {jsonValidation.valid ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">
                          صيغة JSON صالحة - {jsonValidation.resultCount} طالب
                          {jsonValidation.isMultiGrade && ' (أوراق عمل متعددة)'}
                        </span>
                      </div>
                    ) : jsonValidation.error ? (
                      <div className="flex items-center gap-1.5 text-red-500">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{jsonValidation.error}</span>
                      </div>
                    ) : null}
                  </div>
                )}
                {!jsonData.trim() && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    يدعم أسماء الأعمدة العربية والإنجليزية - التحويل تلقائي
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
              إلغاء
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !canUpload}
              className="bg-[#2A374E] hover:bg-[#1e2a3d] text-white gap-2 min-w-[140px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جارٍ الرفع...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  رفع النتائج
                </>
              )}
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
