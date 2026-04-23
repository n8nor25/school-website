import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, grade, fileUrl, type, uploadDate, active } = body;

    const existing = await db.schedule.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الجدول غير موجود' },
        { status: 404 }
      );
    }

    const schedule = await db.schedule.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(grade !== undefined && { grade }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(type !== undefined && { type }),
        ...(uploadDate !== undefined && { uploadDate }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الجدول' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.schedule.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الجدول غير موجود' },
        { status: 404 }
      );
    }

    await db.schedule.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف الجدول بنجاح' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الجدول' },
      { status: 500 }
    );
  }
}
