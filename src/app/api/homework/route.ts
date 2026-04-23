import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/homework - List homework with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classRoomId = searchParams.get('classRoomId')
    const subjectId = searchParams.get('subjectId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}

    if (classRoomId) {
      where.classRoomId = classRoomId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (status) {
      where.status = status
    }

    const homeworks = await db.homework.findMany({
      where,
      include: {
        subject: {
          select: { id: true, name: true },
        },
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
      },
      orderBy: { dueDate: 'desc' },
    })

    return NextResponse.json(homeworks)
  } catch (error) {
    console.error('Error fetching homework:', error)
    return NextResponse.json(
      { error: 'فشل في تحميل الواجبات' },
      { status: 500 }
    )
  }
}

// POST /api/homework - Create new homework
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      classRoomId,
      dueDate,
      subjectId,
      attachments,
      notes,
      status,
    } = body

    if (!title || !description || !classRoomId || !dueDate) {
      return NextResponse.json(
        { error: 'العنوان والوصف والفصل وتاريخ التسليم مطلوبون' },
        { status: 400 }
      )
    }

    // Verify classroom exists
    const classroom = await db.classRoom.findUnique({
      where: { id: classRoomId },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'الفصل غير موجود' },
        { status: 404 }
      )
    }

    // Verify subject exists if provided
    if (subjectId) {
      const subject = await db.subject.findUnique({
        where: { id: subjectId },
      })
      if (!subject) {
        return NextResponse.json(
          { error: 'المادة غير موجودة' },
          { status: 404 }
        )
      }
    }

    const homework = await db.homework.create({
      data: {
        title,
        description,
        classRoomId,
        dueDate,
        subjectId: subjectId || null,
        attachments: attachments || null,
        notes: notes || null,
        status: status || 'نشط',
      },
      include: {
        subject: {
          select: { id: true, name: true },
        },
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
      },
    })

    return NextResponse.json(homework, { status: 201 })
  } catch (error) {
    console.error('Error creating homework:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء الواجب' },
      { status: 500 }
    )
  }
}
