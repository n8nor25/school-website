import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'الملف مطلوب' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const ext = path.extname(originalName) || '';

    // Generate unique filename
    const uniqueName = `${uuidv4()}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    // Return the URL path
    const urlPath = `/uploads/${uniqueName}`;

    return NextResponse.json({
      url: urlPath,
      originalName,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في رفع الملف' },
      { status: 500 }
    );
  }
}
