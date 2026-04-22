import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, imageUrl, order, active } = body;

    const existing = await db.sliderImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الصورة غير موجودة' },
        { status: 404 }
      );
    }

    const slider = await db.sliderImage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Update slider error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الصورة' },
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

    const existing = await db.sliderImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الصورة غير موجودة' },
        { status: 404 }
      );
    }

    await db.sliderImage.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف الصورة بنجاح' });
  } catch (error) {
    console.error('Delete slider error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الصورة' },
      { status: 500 }
    );
  }
}
