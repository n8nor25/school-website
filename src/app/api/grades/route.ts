import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/grades - Get grades with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const subjectId = searchParams.get('subjectId')
    const classRoomId = searchParams.get('classRoomId')
    const term = searchParams.get('term')
    const examType = searchParams.get('examType')

    const where: Record<string, unknown> = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (classRoomId) {
      where.student = { classRoomId }
    }

    if (term) {
      where.term = term
    }

    if (examType) {
      where.examType = examType
    }

    const grades = await db.grade.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            classRoom: {
              select: { id: true, name: true, grade: true, section: true },
            },
          },
        },
        subject: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(grades)
  } catch (error) {
    console.error('Error fetching grades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    )
  }
}

// POST /api/grades - Create a new grade
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, subjectId, examType, score, maxScore, term, note } = body

    if (!studentId || !subjectId || !examType || score === undefined) {
      return NextResponse.json(
        { error: 'studentId, subjectId, examType, and score are required' },
        { status: 400 }
      )
    }

    // Verify student exists
    const student = await db.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Verify subject exists
    const subject = await db.subject.findUnique({
      where: { id: subjectId },
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    const grade = await db.grade.create({
      data: {
        studentId,
        subjectId,
        examType,
        score: parseFloat(String(score)),
        maxScore: maxScore ? parseFloat(String(maxScore)) : 100,
        term: term || 'الفصل الأول',
        note: note || null,
      },
      include: {
        student: {
          select: { id: true, name: true },
        },
        subject: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(grade, { status: 201 })
  } catch (error) {
    console.error('Error creating grade:', error)
    return NextResponse.json(
      { error: 'Failed to create grade' },
      { status: 500 }
    )
  }
}
