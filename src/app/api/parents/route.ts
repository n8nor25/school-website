import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/parents - Get all parents with their students
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const parents = await db.parent.findMany({
      where,
      include: {
        students: {
          select: {
            id: true,
            name: true,
            status: true,
            classRoom: {
              select: { id: true, name: true, grade: true, section: true },
            },
          },
        },
        _count: {
          select: { students: true, messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(parents)
  } catch (error) {
    console.error('Error fetching parents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parents' },
      { status: 500 }
    )
  }
}

// POST /api/parents - Create a new parent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, relation } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    const parent = await db.parent.create({
      data: {
        name,
        phone,
        email: email || null,
        relation: relation || 'أب',
      },
      include: {
        students: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(parent, { status: 201 })
  } catch (error) {
    console.error('Error creating parent:', error)
    return NextResponse.json(
      { error: 'Failed to create parent' },
      { status: 500 }
    )
  }
}
