import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/students - Get all students with classroom and parent info
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classRoomId = searchParams.get('classRoomId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (classRoomId) {
      where.classRoomId = classRoomId
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nationalId: { contains: search } },
        { phone: { contains: search } },
      ]
    }

    const students = await db.student.findMany({
      where,
      include: {
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
        _count: {
          select: { attendance: true, grades: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST /api/students - Create a new student
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      nationalId,
      classRoomId,
      parentId,
      phone,
      address,
      birthDate,
      enrollDate,
      status,
    } = body

    if (!name || !classRoomId) {
      return NextResponse.json(
        { error: 'Name and classRoomId are required' },
        { status: 400 }
      )
    }

    // Verify classroom exists
    const classroom = await db.classRoom.findUnique({
      where: { id: classRoomId },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    // Verify parent exists if provided
    if (parentId) {
      const parent = await db.parent.findUnique({
        where: { id: parentId },
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent not found' },
          { status: 404 }
        )
      }
    }

    const student = await db.student.create({
      data: {
        name,
        nationalId: nationalId || null,
        classRoomId,
        parentId: parentId || null,
        phone: phone || null,
        address: address || null,
        birthDate: birthDate || null,
        enrollDate: enrollDate || null,
        status: status || 'نشط',
      },
      include: {
        classRoom: {
          select: { id: true, name: true, grade: true, section: true },
        },
        parent: {
          select: { id: true, name: true, phone: true, relation: true },
        },
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
