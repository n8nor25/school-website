import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sliders = await db.sliderImage.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Fetch sliders error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الصور' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, imageUrl, order, active } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'العنوان ورابط الصورة مطلوبان' },
        { status: 400 }
      );
    }

    const slider = await db.sliderImage.create({
      data: {
        title,
        category: category || 'تعليم',
        imageUrl,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error('Create slider error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الصورة' },
      { status: 500 }
    );
  }
}
