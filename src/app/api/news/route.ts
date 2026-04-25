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

    const news = await db.newsItem.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Fetch news error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الأخبار' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, order, active } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'العنوان مطلوب' },
        { status: 400 }
      );
    }

    const newsItem = await db.newsItem.create({
      data: {
        title,
        content: content || null,
        category: category || 'عام',
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json(newsItem, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الخبر' },
      { status: 500 }
    );
  }
}
