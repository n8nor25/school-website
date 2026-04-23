import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Increase body size limit for large result uploads
export const runtime = 'nodejs'

// GET /api/exam-results - List all ExamResultGrade entries with student counts
export async function GET() {
  try {
    const grades = await db.examResultGrade.findMany({
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
    const { gradeName, results } = body

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

    // Validate each result has required fields
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (!result.seatNumber || !result.studentName) {
        return NextResponse.json(
          { error: `السطر ${i + 1}: رقم الجلوس واسم الطالب مطلوبان` },
          { status: 400 }
        )
      }
    }

    // Find or create the ExamResultGrade
    let examGrade = await db.examResultGrade.findFirst({
      where: { gradeName },
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
        data: { gradeName },
      })
    }

    // Create all results
    const createdResults = await db.examResult.createMany({
      data: results.map((result: Record<string, unknown>) => ({
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
