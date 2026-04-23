import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, category, order, active } = body;

    const existing = await db.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الخبر غير موجود' },
        { status: 404 }
      );
    }

    const newsItem = await db.newsItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Update news error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الخبر' },
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

    const existing = await db.newsItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الخبر غير موجود' },
        { status: 404 }
      );
    }

    await db.newsItem.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف الخبر بنجاح' });
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الخبر' },
      { status: 500 }
    );
  }
}
