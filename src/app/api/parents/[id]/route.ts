import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/parents/[id] - Get a single parent with full details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const parent = await db.parent.findUnique({
      where: { id },
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!parent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(parent)
  } catch (error) {
    console.error('Error fetching parent:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parent' },
      { status: 500 }
    )
  }
}

// PUT /api/parents/[id] - Update a parent
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingParent = await db.parent.findUnique({
      where: { id },
    })

    if (!existingParent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    const parent = await db.parent.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.relation !== undefined && { relation: body.relation }),
      },
      include: {
        students: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(parent)
  } catch (error) {
    console.error('Error updating parent:', error)
    return NextResponse.json(
      { error: 'Failed to update parent' },
      { status: 500 }
    )
  }
}

// DELETE /api/parents/[id] - Delete a parent
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingParent = await db.parent.findUnique({
      where: { id },
    })

    if (!existingParent) {
      return NextResponse.json(
        { error: 'Parent not found' },
        { status: 404 }
      )
    }

    // Unlink students from this parent
    await db.student.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    })

    // Delete messages
    await db.parentMessage.deleteMany({
      where: { parentId: id },
    })

    await db.parent.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Parent deleted successfully' })
  } catch (error) {
    console.error('Error deleting parent:', error)
    return NextResponse.json(
      { error: 'Failed to delete parent' },
      { status: 500 }
    )
  }
}
