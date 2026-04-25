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

    const schedules = await db.schedule.findMany({ where });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Fetch schedules error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الجداول' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, grade, fileUrl, type, uploadDate, active } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'العنوان ورابط الملف مطلوبان' },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
      data: {
        title,
        grade: grade || 'عام',
        fileUrl,
        type: type || 'حالي',
        uploadDate: uploadDate || new Date().toISOString().split('T')[0],
        active: active ?? true,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الجدول' },
      { status: 500 }
    );
  }
}
