import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/students/[id] - Get a single student with full details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const student = await db.student.findUnique({
      where: { id },
      include: {
        classRoom: {
          select: { id: true, name: true, grade: true, section: true, academicYear: true },
        },
        parent: {
          select: { id: true, name: true, phone: true, email: true, relation: true },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        grades: {
          include: {
            subject: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    )
  }
}

// PUT /api/students/[id] - Update a student
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingStudent = await db.student.findUnique({
      where: { id },
    })

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // If classRoomId is being changed, verify it exists
    if (body.classRoomId && body.classRoomId !== existingStudent.classRoomId) {
      const classroom = await db.classRoom.findUnique({
        where: { id: body.classRoomId },
      })
      if (!classroom) {
        return NextResponse.json(
          { error: 'Classroom not found' },
          { status: 404 }
        )
      }
    }

    // If parentId is being changed, verify it exists
    if (body.parentId && body.parentId !== existingStudent.parentId) {
      const parent = await db.parent.findUnique({
        where: { id: body.parentId },
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent not found' },
          { status: 404 }
        )
      }
    }

    const student = await db.student.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.nationalId !== undefined && { nationalId: body.nationalId }),
        ...(body.classRoomId !== undefined && { classRoomId: body.classRoomId }),
        ...(body.parentId !== undefined && { parentId: body.parentId || null }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.address !== undefined && { address: body.address }),
        ...(body.birthDate !== undefined && { birthDate: body.birthDate }),
        ...(body.enrollDate !== undefined && { enrollDate: body.enrollDate }),
        ...(body.status !== undefined && { status: body.status }),
      },
      include: {
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE /api/students/[id] - Delete a student
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingStudent = await db.student.findUnique({
      where: { id },
    })

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    // Delete related attendance and grades first
    await db.attendance.deleteMany({ where: { studentId: id } })
    await db.grade.deleteMany({ where: { studentId: id } })

    await db.student.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
