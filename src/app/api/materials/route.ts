import { db } from '@/lib/db'
import { NextResponse } from 'next/server'


// GET /api/materials - List educational materials with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classRoomId = searchParams.get('classRoomId')
    const subjectId = searchParams.get('subjectId')
    const fileType = searchParams.get('fileType')

    const where: Record<string, unknown> = {}

    if (classRoomId) {
      where.classRoomId = classRoomId
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    if (fileType) {
      where.fileType = fileType
    }

    const materials = await db.educationalMaterial.findMany({
      where,
      include: {
        subject: {
          select: { id: true, name: true },
        },
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching materials:', error)
    return NextResponse.json(
      { error: 'فشل في تحميل المواد التعليمية' },
      { status: 500 }
    )
  }
}

// POST /api/materials - Create a new educational material
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      fileType,
      fileUrl,
      fileName,
      description,
      fileSize,
      subjectId,
      classRoomId,
      notes,
    } = body

    if (!title || !fileType || !fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'العنوان ونوع الملف ورابط الملف واسم الملف مطلوبون' },
        { status: 400 }
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

    // Verify classroom exists if provided
    if (classRoomId) {
      const classroom = await db.classRoom.findUnique({
        where: { id: classRoomId },
      })
      if (!classroom) {
        return NextResponse.json(
          { error: 'الفصل غير موجود' },
          { status: 404 }
        )
      }
    }

    const material = await db.educationalMaterial.create({
      data: {
        title,
        fileType,
        fileUrl,
        fileName,
        description: description || null,
        fileSize: fileSize || 0,
        subjectId: subjectId || null,
        classRoomId: classRoomId || null,
        notes: notes || null,
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

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المادة التعليمية' },
      { status: 500 }
    )
  }
}
