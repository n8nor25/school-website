import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/subjects - Get all subjects
export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        _count: {
          select: { grades: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Subject name is required' },
        { status: 400 }
      )
    }

    const subject = await db.subject.create({
      data: { name },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}
