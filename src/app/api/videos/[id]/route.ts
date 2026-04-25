import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, videoUrl, duration, thumbnail, order, active, archived } = body;

    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الفيديو غير موجود' },
        { status: 404 }
      );
    }

    const video = await db.video.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
        ...(archived !== undefined && { archived }),
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Update video error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث الفيديو' },
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

    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'الفيديو غير موجود' },
        { status: 404 }
      );
    }

    await db.video.delete({ where: { id } });

    return NextResponse.json({ message: 'تم حذف الفيديو بنجاح' });
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الفيديو' },
      { status: 500 }
    );
  }
}
