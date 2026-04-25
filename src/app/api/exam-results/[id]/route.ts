import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PUT /api/exam-results/[id] - Update an ExamResultGrade (archive/restore, term)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { archived, term } = body

    const updateData: Record<string, unknown> = {}
    if (typeof archived === 'boolean') updateData.archived = archived
    if (term) updateData.term = term

    const updated = await db.examResultGrade.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      id: updated.id,
      gradeName: updated.gradeName,
      term: updated.term,
      archived: updated.archived,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error('Error updating exam result grade:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث صف النتائج' },
      { status: 500 }
    )
  }
}

// DELETE /api/exam-results/[id] - Delete an ExamResultGrade and all its results (cascade)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.examResultGrade.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'صف النتائج غير موجود' },
        { status: 404 }
      )
    }

    // Delete the grade (cascade will delete all results)
    await db.examResultGrade.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'تم حذف صف النتائج وجميع البيانات المرتبطة بنجاح' })
  } catch (error) {
    console.error('Error deleting exam result grade:', error)
    return NextResponse.json(
      { error: 'فشل في حذف صف النتائج' },
      { status: 500 }
    )
  }
}
