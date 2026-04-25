import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const archivedParam = searchParams.get('archived');

    const where: Record<string, unknown> = { active: true };
    if (archivedParam === 'true') {
      where.archived = true;
    } else if (archivedParam === 'false') {
      where.archived = false;
    } else {
      // Default: exclude archived items (for public-facing site)
      where.archived = false;
    }

    const videos = await db.video.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Fetch videos error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الفيديوهات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, duration, thumbnail, order, active } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'العنوان ورابط الفيديو مطلوبان' },
        { status: 400 }
      );
    }

    const video = await db.video.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        duration: duration || '00:00',
        thumbnail: thumbnail || null,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الفيديو' },
      { status: 500 }
    );
  }
}
