import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

    if (!admin) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Support both bcrypt hashed and plaintext passwords
    let passwordMatch = false;
    if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$')) {
      passwordMatch = await bcrypt.compare(password, admin.password);
    } else {
      passwordMatch = admin.password === password;
    }

    if (!passwordMatch) {
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
