import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const videos = await db.video.findMany({
      where: { active: true },
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
