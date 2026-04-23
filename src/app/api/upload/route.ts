import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST /api/upload - Upload a file and return its URL
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم اختيار ملف' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'حجم الملف يتجاوز الحد المسموح (50 ميجابايت)' },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(file.name) || ''
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    const safeName = `${baseName}_${timestamp}_${randomStr}${ext}`

    // Determine subfolder based on file type
    const subfolder = formData.get('subfolder') as string || 'materials'
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder)

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const filePath = path.join(uploadDir, safeName)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Return the public URL
    const fileUrl = `/uploads/${subfolder}/${safeName}`

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'فشل في رفع الملف' },
      { status: 500 }
    )
  }
}
