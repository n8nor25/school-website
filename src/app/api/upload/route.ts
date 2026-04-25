import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز الحد المسموح (50 ميجابايت)' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Data}`;

    // Determine folder based on file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const folder = isImage ? 'school/images' : isVideo ? 'school/videos' : 'school/files';

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: isVideo ? 'video' : 'auto',
      // Generate a unique public_id
      public_id: `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9\u0600-\u06FF._-]/g, '_')}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في رفع الملف' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove file from Cloudinary
export async function DELETE(request: Request) {
  try {
    const { publicId, resourceType = 'image' } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'لم يتم تحديد الملف' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return NextResponse.json({ result: result.result });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف الملف' },
      { status: 500 }
    );
  }
}
