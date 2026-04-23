import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/exam-results/query - Query a student result by seat number and grade
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const seat = searchParams.get('seat')

    if (!grade || !seat) {
      return NextResponse.json(
        { error: 'اسم الصف ورقم الجلوس مطلوبان' },
        { status: 400 }
      )
    }

    // Find the ExamResultGrade by gradeName
    const examGrade = await db.examResultGrade.findFirst({
      where: { gradeName: grade },
      include: {
        results: true,
      },
    })

    if (!examGrade) {
      return NextResponse.json(
        { error: 'صف النتائج غير موجود' },
        { status: 404 }
      )
    }

    // Find the student by seatNumber
    const student = examGrade.results.find(
      (r) => r.seatNumber === seat
    )

    if (!student) {
      return NextResponse.json(
        { error: 'لم يتم العثور على طالب بهذا الرقم في هذا الصف' },
        { status: 404 }
      )
    }

    // Compute max scores for each subject across all students in the grade
    const allResults = examGrade.results
    const maxScores = {
      arabic: Math.max(...allResults.map((r) => r.arabic)),
      english: Math.max(...allResults.map((r) => r.english)),
      social: Math.max(...allResults.map((r) => r.social)),
      math: Math.max(...allResults.map((r) => r.math)),
      science: Math.max(...allResults.map((r) => r.science)),
      religion: Math.max(...allResults.map((r) => r.religion)),
      art: Math.max(...allResults.map((r) => r.art)),
      computer: Math.max(...allResults.map((r) => r.computer)),
      total: Math.max(...allResults.map((r) => r.total)),
    }

    // Subjects added to total
    const addedSubjects = ['arabic', 'english', 'social', 'math', 'science'] as const
    // Subjects not added to total
    const notAddedSubjects = ['religion', 'art', 'computer'] as const

    // Min passing: 50% of max for each subject
    const minPassingPercent = 0.5

    // Compute passing thresholds
    const addedSubjectPass = addedSubjects.every(
      (subject) => {
        const maxScore = maxScores[subject]
        return maxScore === 0 || student[subject] >= maxScore * minPassingPercent
      }
    )

    const notAddedSubjectPass = notAddedSubjects.every(
      (subject) => {
        const maxScore = maxScores[subject]
        return maxScore === 0 || student[subject] >= maxScore * minPassingPercent
      }
    )

    // Total pass: student total >= 50% of max total
    const totalPass = maxScores.total === 0 || student.total >= maxScores.total * minPassingPercent

    const passed = totalPass && addedSubjectPass && notAddedSubjectPass

    return NextResponse.json({
      student: {
        seatNumber: student.seatNumber,
        studentName: student.studentName,
        arabic: student.arabic,
        english: student.english,
        social: student.social,
        math: student.math,
        science: student.science,
        total: student.total,
        religion: student.religion,
        art: student.art,
        computer: student.computer,
      },
      maxScores,
      passStatus: {
        passed,
        totalPass,
        addedSubjectPass,
        notAddedSubjectPass,
        minPassingPercent: minPassingPercent * 100,
        subjectDetails: {
          added: addedSubjects.map((subject) => ({
            subject,
            score: student[subject],
            max: maxScores[subject],
            minPass: maxScores[subject] * minPassingPercent,
            passed: maxScores[subject] === 0 || student[subject] >= maxScores[subject] * minPassingPercent,
          })),
          notAdded: notAddedSubjects.map((subject) => ({
            subject,
            score: student[subject],
            max: maxScores[subject],
            minPass: maxScores[subject] * minPassingPercent,
            passed: maxScores[subject] === 0 || student[subject] >= maxScores[subject] * minPassingPercent,
          })),
        },
      },
      gradeName: examGrade.gradeName,
    })
  } catch (error) {
    console.error('Error querying exam result:', error)
    return NextResponse.json(
      { error: 'فشل في البحث عن النتيجة' },
      { status: 500 }
    )
  }
}
