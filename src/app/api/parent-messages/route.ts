import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/parent-messages - Get messages with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const type = searchParams.get('type')
    const isRead = searchParams.get('isRead')

    const where: Record<string, unknown> = {}

    if (parentId) {
      where.parentId = parentId
    }

    if (type) {
      where.type = type
    }

    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === 'true'
    }

    const messages = await db.parentMessage.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching parent messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parent messages' },
      { status: 500 }
    )
  }
}

// POST /api/parent-messages - Create a new message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { parentId, studentId, subject, message, type } = body

    if (!parentId || !subject || !message) {
      return NextResponse.json(
        { error: 'parentId, subject, and message are required' },
        { status: 400 }
      )
    }

    // Verify parent exists
    const parent = await db.parent.findUnique({
      where: { id: parentId },
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    // Verify student exists if provided
    if (studentId) {
      const student = await db.student.findUnique({
        where: { id: studentId },
      })
      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        )
      }
    }

    const parentMessage = await db.parentMessage.create({
      data: {
        parentId,
        studentId: studentId || null,
        subject,
        message,
        type: type || 'إشعار',
      },
      include: {
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
      },
    })

    return NextResponse.json(parentMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating parent message:', error)
    return NextResponse.json(
      { error: 'Failed to create parent message' },
      { status: 500 }
    )
  }
}
