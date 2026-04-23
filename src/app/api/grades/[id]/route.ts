import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PUT /api/grades/[id] - Update a grade
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingGrade = await db.grade.findUnique({
      where: { id },
    })

    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      )
    }

    const grade = await db.grade.update({
      where: { id },
      data: {
        ...(body.examType !== undefined && { examType: body.examType }),
        ...(body.score !== undefined && { score: parseFloat(String(body.score)) }),
        ...(body.maxScore !== undefined && { maxScore: parseFloat(String(body.maxScore)) }),
        ...(body.term !== undefined && { term: body.term }),
        ...(body.note !== undefined && { note: body.note }),
        ...(body.subjectId !== undefined && { subjectId: body.subjectId }),
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

    return NextResponse.json(grade)
  } catch (error) {
    console.error('Error updating grade:', error)
    return NextResponse.json(
      { error: 'Failed to update grade' },
      { status: 500 }
    )
  }
}

// DELETE /api/grades/[id] - Delete a grade
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingGrade = await db.grade.findUnique({
      where: { id },
    })

    if (!existingGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      )
    }

    await db.grade.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Grade deleted successfully' })
  } catch (error) {
    console.error('Error deleting grade:', error)
    return NextResponse.json(
      { error: 'Failed to delete grade' },
      { status: 500 }
    )
  }
}
