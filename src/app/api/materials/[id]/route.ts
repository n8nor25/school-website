import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PUT /api/materials/[id] - Update a material
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.educationalMaterial.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'المادة التعليمية غير موجودة' },
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

    const material = await db.educationalMaterial.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.fileType !== undefined && { fileType: body.fileType }),
        ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
        ...(body.fileName !== undefined && { fileName: body.fileName }),
        ...(body.fileSize !== undefined && { fileSize: body.fileSize }),
        ...(body.subjectId !== undefined && { subjectId: body.subjectId || null }),
        ...(body.classRoomId !== undefined && { classRoomId: body.classRoomId || null }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.active !== undefined && { active: body.active }),
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

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث المادة التعليمية' },
      { status: 500 }
    )
  }
}

// DELETE /api/materials/[id] - Delete a material
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.educationalMaterial.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'المادة التعليمية غير موجودة' },
        { status: 404 }
      )
    }

    await db.educationalMaterial.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'تم حذف المادة التعليمية بنجاح' })
  } catch (error) {
    console.error('Error deleting material:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المادة التعليمية' },
      { status: 500 }
    )
  }
}
