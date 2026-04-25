import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/exam-results/query - Query a student result by seat number and grade
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const seat = searchParams.get('seat')
    const includeArchived = searchParams.get('archived') === 'true'

    if (!grade || !seat) {
      return NextResponse.json(
        { error: 'اسم الصف ورقم الجلوس مطلوبان' },
        { status: 400 }
      )
    }

    // Find the ExamResultGrade by gradeName
    const examGrade = await db.examResultGrade.findFirst({
      where: { gradeName: grade, archived: includeArchived ? undefined : false },
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

    // Subjects added to total (المواد المضافة للمجموع)
    const addedSubjects = ['arabic', 'english', 'social', 'math', 'science'] as const
    // Subjects not added to total (المواد غير المضافة للمجموع)
    const notAddedSubjects = ['religion', 'art', 'computer'] as const

    // Min passing: 50% of max for each subject
    const minPassingPercent = 0.5

    // === معايير النجاح ===
    // 1. النجاح في كل مادة مضافة: درجة الطالب ≥ 50% من الدرجة العظمى
    const addedSubjectPass = addedSubjects.every(
      (subject) => {
        const maxScore = maxScores[subject]
        return maxScore === 0 || student[subject] >= maxScore * minPassingPercent
      }
    )

    // 2. النجاح في المواد غير المضافة: درجة الطالب ≥ 50% من الدرجة العظمى
    const notAddedSubjectPass = notAddedSubjects.every(
      (subject) => {
        const maxScore = maxScores[subject]
        return maxScore === 0 || student[subject] >= maxScore * minPassingPercent
      }
    )

    // 3. نصف مجموع المواد المضافة: مجموع الطالب ≥ 50% من مجموع الدرجات العظمى للمواد المضافة
    const maxAddedTotal = addedSubjects.reduce((sum, subject) => sum + maxScores[subject], 0)
    const studentAddedTotal = addedSubjects.reduce((sum, subject) => sum + student[subject], 0)
    const totalPass = maxAddedTotal === 0 || studentAddedTotal >= maxAddedTotal * minPassingPercent

    // النجاح النهائي: تحقيق جميع الشروط
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
        studentAddedTotal,
        maxAddedTotal,
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
      term: examGrade.term,
    })
  } catch (error) {
    console.error('Error querying exam result:', error)
    return NextResponse.json(
      { error: 'فشل في البحث عن النتيجة' },
      { status: 500 }
    )
  }
}
