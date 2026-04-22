import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/classrooms - Get all classrooms with student counts
export async function GET() {
  try {
    const classrooms = await db.classRoom.findMany({
      include: {
        students: {
          select: { id: true, name: true, status: true },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(classrooms)
  } catch (error) {
    console.error('Error fetching classrooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classrooms' },
      { status: 500 }
    )
  }
}

// POST /api/classrooms - Create a new classroom
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, grade, section, academicYear } = body

    if (!name || !grade) {
      return NextResponse.json(
        { error: 'Name and grade are required' },
        { status: 400 }
      )
    }

    const classroom = await db.classRoom.create({
      data: {
        name,
        grade,
        section: section || 'أ',
        academicYear: academicYear || '2024/2025',
      },
    })

    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    console.error('Error creating classroom:', error)
    return NextResponse.json(
      { error: 'Failed to create classroom' },
      { status: 500 }
    )
  }
}
