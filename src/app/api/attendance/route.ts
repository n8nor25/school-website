import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/attendance - Get attendance records with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const studentId = searchParams.get('studentId')
    const classRoomId = searchParams.get('classRoomId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Record<string, unknown> = {}

    if (date) {
      where.date = date
    } else if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate }
    } else if (startDate) {
      where.date = { gte: startDate }
    } else if (endDate) {
      where.date = { lte: endDate }
    }

    if (studentId) {
      where.studentId = studentId
    }

    if (classRoomId) {
      where.student = { classRoomId }
    }

    if (status) {
      where.status = status
    }

    const attendance = await db.attendance.findMany({
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
      },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

// POST /api/attendance - Create a single attendance record or batch
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Batch attendance creation
    if (Array.isArray(body)) {
      const records = body as Array<{
        studentId: string
        date: string
        status: string
        note?: string
      }>

      if (records.length === 0) {
        return NextResponse.json(
          { error: 'No attendance records provided' },
          { status: 400 }
        )
      }

      // Validate all records
      for (const record of records) {
        if (!record.studentId || !record.date || !record.status) {
          return NextResponse.json(
            { error: 'Each record must have studentId, date, and status' },
            { status: 400 }
          )
        }
      }

      // Delete existing attendance for the same date and students (upsert behavior)
      const studentIds = records.map((r) => r.studentId)
      const date = records[0].date

      await db.attendance.deleteMany({
        where: {
          date,
          studentId: { in: studentIds },
        },
      })

      const attendance = await db.attendance.createMany({
        data: records.map((record) => ({
          studentId: record.studentId,
          date: record.date,
          status: record.status,
          note: record.note || null,
        })),
      })

      return NextResponse.json(
        { message: `Created ${attendance.count} attendance records`, count: attendance.count },
        { status: 201 }
      )
    }

    // Single attendance creation
    const { studentId, date, status, note } = body

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: 'studentId, date, and status are required' },
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

    // Check if attendance already exists for this student on this date
    const existing = await db.attendance.findFirst({
      where: { studentId, date },
    })

    let attendance
    if (existing) {
      attendance = await db.attendance.update({
        where: { id: existing.id },
        data: { status, note: note || null },
        include: {
          student: {
            select: { id: true, name: true },
          },
        },
      })
    } else {
      attendance = await db.attendance.create({
        data: {
          studentId,
          date,
          status,
          note: note || null,
        },
        include: {
          student: {
            select: { id: true, name: true },
          },
        },
      })
    }

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    )
  }
}
