import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PUT /api/homework/[id] - Update homework
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.homework.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'الواجب غير موجود' },
        { status: 404 }
      )
    }

    // Verify subject exists if being changed
    if (body.subjectId && body.subjectId !== existing.subjectId) {
      const subject = await db.subject.findUnique({
        where: { id: body.subjectId },
      })
      if (!subject) {
        return NextResponse.json(
          { error: 'المادة غير موجودة' },
          { status: 404 }
        )
      }
    }

    // Verify classroom exists if being changed
    if (body.classRoomId && body.classRoomId !== existing.classRoomId) {
      const classroom = await db.classRoom.findUnique({
        where: { id: body.classRoomId },
      })
      if (!classroom) {
        return NextResponse.json(
          { error: 'الفصل غير موجود' },
          { status: 404 }
        )
      }
    }

    const homework = await db.homework.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.classRoomId !== undefined && { classRoomId: body.classRoomId }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
        ...(body.subjectId !== undefined && { subjectId: body.subjectId || null }),
        ...(body.attachments !== undefined && { attachments: body.attachments }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.status !== undefined && { status: body.status }),
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

    return NextResponse.json(homework)
  } catch (error) {
    console.error('Error updating homework:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث الواجب' },
      { status: 500 }
    )
  }
}

// DELETE /api/homework/[id] - Delete homework
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.homework.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'الواجب غير موجود' },
        { status: 404 }
      )
    }

    await db.homework.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'تم حذف الواجب بنجاح' })
  } catch (error) {
    console.error('Error deleting homework:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الواجب' },
      { status: 500 }
    )
  }
}
