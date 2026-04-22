import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// PUT /api/parent-messages/[id] - Update a message (mark as read, etc.)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingMessage = await db.parentMessage.findUnique({
      where: { id },
    })

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const message = await db.parentMessage.update({
      where: { id },
      data: {
        ...(body.isRead !== undefined && { isRead: body.isRead }),
        ...(body.subject !== undefined && { subject: body.subject }),
        ...(body.message !== undefined && { message: body.message }),
        ...(body.type !== undefined && { type: body.type }),
      },
      include: {
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating parent message:', error)
    return NextResponse.json(
      { error: 'Failed to update parent message' },
      { status: 500 }
    )
  }
}

// DELETE /api/parent-messages/[id] - Delete a message
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingMessage = await db.parentMessage.findUnique({
      where: { id },
    })

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    await db.parentMessage.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting parent message:', error)
    return NextResponse.json(
      { error: 'Failed to delete parent message' },
      { status: 500 }
    )
  }
}
