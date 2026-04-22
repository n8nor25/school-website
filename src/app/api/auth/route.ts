import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const { password: _password, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
}
