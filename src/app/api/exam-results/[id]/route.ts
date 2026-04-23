import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

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
