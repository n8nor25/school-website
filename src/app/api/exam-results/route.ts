import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Increase body size limit for large result uploads
export const runtime = 'nodejs'

// ===== Arabic-to-English column mapping (backend safety net) =====
// Comprehensive mapping including all common Arabic column name variants
// Handles both ي and ى (ya and alef maqsura) variations
const ARABIC_TO_ENGLISH: Record<string, string> = {
  // seatNumber
  'رقم الجلوس': 'seatNumber', 'الرقم': 'seatNumber', 'رقم': 'seatNumber',
  'رقم المقعد': 'seatNumber', 'المقعد': 'seatNumber',
  'رقم الجلوس/الرقم القومي': 'seatNumber', 'رقم الجلوس/الرقم القومى': 'seatNumber',

  // studentName
  'اسم الطالب': 'studentName', 'الاسم': 'studentName', 'اسم': 'studentName',
  'إسم الطالب': 'studentName', 'الإسم': 'studentName', 'إسم': 'studentName',

  // arabic (handles both ي and ى)
  'عربي': 'arabic', 'عربى': 'arabic', 'العربي': 'arabic', 'العربى': 'arabic',
  'لغة عربية': 'arabic', 'لغه عربيه': 'arabic', 'اللغة العربية': 'arabic',
  'اللغه العربيه': 'arabic', 'العربية': 'arabic', 'العربيه': 'arabic',

  // english (handles E abbreviation and both ي/ى)
  'انجليزي': 'english', 'انجليزى': 'english', 'الانجليزي': 'english',
  'الإنجليزي': 'english', 'لغة انجليزية': 'english', 'اللغة الإنجليزية': 'english',
  'انجليزية': 'english', 'E': 'english',

  // social
  'دراسات': 'social', 'الدراسات': 'social', 'دراسات اجتماعية': 'social',
  'الدراسات الاجتماعية': 'social', 'اجتماعيات': 'social',

  // math components (will be combined later)
  'جبر': '_algebra', 'الجبر': '_algebra',
  'هندسة': '_geometry', 'الهندسة': '_geometry', 'هندسه': '_geometry',

  // math (combined)
  'رياضيات': 'math', 'الرياضيات': 'math', 'رياضه': 'math', 'حساب': 'math',

  // science
  'علوم': 'science', 'العلوم': 'science',

  // total
  'المجموع': 'total', 'مجموع': 'total', 'المجموع الكلي': 'total',
  'المجموع الكلى': 'total', 'الاجمالي': 'total', 'الإجمالي': 'total',
  'الإجمالى': 'total', 'مجموع المواد': 'total',

  // religion
  'دين': 'religion', 'الدين': 'religion', 'تربية دينية': 'religion',
  'التربية الدينية': 'religion', 'تربيه دينيه': 'religion',

  // art (includes رسم)
  'فنية': 'art', 'الفنية': 'art', 'تربية فنية': 'art',
  'التربية الفنية': 'art', 'فنون': 'art', 'رسم': 'art', 'الرسم': 'art',

  // computer
  'كمبيوتر': 'computer', 'الكمبيوتر': 'computer', 'حاسب': 'computer',
  'الحاسب': 'computer', 'حاسب آلي': 'computer', 'الحاسب الآلي': 'computer',
  'الحاسوب': 'computer', 'تكنولوجيا': 'computer', 'معلومات': 'computer',
}

const IGNORE_FIELDS = new Set([
  'المدرسة', 'مدرسة', 'الادارة', 'ادارة', 'الإدارة', 'المديرية',
  'الشعبة', 'شعبة', 'الرقم الوطني', 'رقم قومي', 'الرقم القومي',
  'الرقم القومى', 'رقم قومى', 'الهاتف', 'العمر', 'النسبة', 'نسبة',
  'الدرجة', 'التقدير', 'الحالة', 'حالة', 'ملاحظات', 'السلوك', 'المواظبة',
  'التربية الوطنية', 'التربيه الوطنيه',
])

const ENGLISH_FIELDS = new Set([
  'seatNumber', 'studentName', 'arabic', 'english', 'social',
  'math', 'science', 'total', 'religion', 'art', 'computer',
])

function normalizeResult(raw: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {}
  let algebra = 0
  let geometry = 0
  let hasAlgebra = false
  let hasGeometry = false

  for (const [key, value] of Object.entries(raw)) {
    const trimmedKey = key.trim()
    if (ENGLISH_FIELDS.has(trimmedKey)) {
      normalized[trimmedKey] = value
    } else if (IGNORE_FIELDS.has(trimmedKey)) {
      // Skip ignored fields
    } else if (ARABIC_TO_ENGLISH[trimmedKey]) {
      const mapped = ARABIC_TO_ENGLISH[trimmedKey]
      if (mapped === '_algebra') {
        algebra = Number(value) || 0
        hasAlgebra = true
      } else if (mapped === '_geometry') {
        geometry = Number(value) || 0
        hasGeometry = true
      } else {
        normalized[mapped] = value
      }
    } else {
      // Try case-insensitive
      const lowerKey = trimmedKey.toLowerCase()
      const match = Object.keys(ARABIC_TO_ENGLISH).find(k => k.toLowerCase() === lowerKey)
      if (match) {
        const mapped = ARABIC_TO_ENGLISH[match]
        if (mapped === '_algebra') {
          algebra = Number(value) || 0
          hasAlgebra = true
        } else if (mapped === '_geometry') {
          geometry = Number(value) || 0
          hasGeometry = true
        } else {
          normalized[mapped] = value
        }
      }
    }
  }

  // Combine جبر + هندسة into math
  if (hasAlgebra || hasGeometry) {
    const existingMath = Number(normalized.math) || 0
    if (hasAlgebra && hasGeometry) {
      normalized.math = algebra + geometry
    } else if (hasAlgebra) {
      normalized.math = existingMath + algebra
    } else {
      normalized.math = existingMath + geometry
    }
  }

  // Auto-calculate total if missing or zero
  const addedSubjects = ['arabic', 'english', 'social', 'math', 'science'] as const
  const currentTotal = Number(normalized.total) || 0
  if (currentTotal === 0) {
    const calculatedTotal = addedSubjects.reduce((sum, subject) => {
      return sum + (Number(normalized[subject]) || 0)
    }, 0)
    if (calculatedTotal > 0) {
      normalized.total = calculatedTotal
    }
  }

  return normalized
}

// GET /api/exam-results - List all ExamResultGrade entries with student counts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showArchived = searchParams.get('archived') === 'true'

    const grades = await db.examResultGrade.findMany({
      where: showArchived ? {} : { archived: false },
      include: {
        _count: {
          select: { results: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const formatted = grades.map((grade) => ({
      id: grade.id,
      gradeName: grade.gradeName,
      term: grade.term,
      archived: grade.archived,
      studentCount: grade._count.results,
      updatedAt: grade.updatedAt,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching exam result grades:', error)
    return NextResponse.json(
      { error: 'فشل في تحميل نتائج الامتحانات' },
      { status: 500 }
    )
  }
}

// POST /api/exam-results - Upload exam results
export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { gradeName, results } = body
    const term = body.term || 'الترم الأول'

    if (!gradeName || !results || !Array.isArray(results)) {
      return NextResponse.json(
        { error: 'اسم الصف وبيانات النتائج مطلوبان' },
        { status: 400 }
      )
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد نتائج للرفع' },
        { status: 400 }
      )
    }

    // Normalize Arabic columns to English (backend safety net)
    const normalizedResults = results.map((result: Record<string, unknown>) => normalizeResult(result))

    // Validate each result has required fields
    for (let i = 0; i < normalizedResults.length; i++) {
      const result = normalizedResults[i]
      if (!result.seatNumber || !result.studentName) {
        return NextResponse.json(
          { error: `السطر ${i + 1}: رقم الجلوس واسم الطالب مطلوبان` },
          { status: 400 }
        )
      }
    }

    // Find or create the ExamResultGrade
    let examGrade = await db.examResultGrade.findFirst({
      where: { gradeName, term },
    })

    if (examGrade) {
      // Delete old results first
      await db.examResult.deleteMany({
        where: { gradeId: examGrade.id },
      })

      // Update the grade's updatedAt
      examGrade = await db.examResultGrade.update({
        where: { id: examGrade.id },
        data: { updatedAt: new Date() },
      })
    } else {
      examGrade = await db.examResultGrade.create({
        data: { gradeName, term },
      })
    }

    // Create all results
    const createdResults = await db.examResult.createMany({
      data: normalizedResults.map((result: Record<string, unknown>) => ({
        gradeId: examGrade!.id,
        seatNumber: String(result.seatNumber),
        studentName: String(result.studentName),
        arabic: Number(result.arabic) || 0,
        english: Number(result.english) || 0,
        social: Number(result.social) || 0,
        math: Number(result.math) || 0,
        science: Number(result.science) || 0,
        total: Number(result.total) || 0,
        religion: Number(result.religion) || 0,
        art: Number(result.art) || 0,
        computer: Number(result.computer) || 0,
      })),
    })

    return NextResponse.json({
      id: examGrade.id,
      gradeName: examGrade.gradeName,
      term: examGrade.term,
      resultsCount: createdResults.count,
      updatedAt: examGrade.updatedAt,
      message: 'تم رفع النتائج بنجاح',
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading exam results:', error)
    return NextResponse.json(
      { error: 'فشل في رفع نتائج الامتحانات' },
      { status: 500 }
    )
  }
}
