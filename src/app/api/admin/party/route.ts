import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name, date, location, description } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create party
    const party = await prisma.party.create({
      data: {
        name,
        date: new Date(date),
        location,
        description,
      },
    })

    return NextResponse.json({ success: true, party })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json({ error: 'Failed to create party' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      include: {
        children: {
          include: {
            wishlist: true,
            pledges: true,
          },
        },
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(parties)
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { email, password, id, name, date, location, description } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update party
    const party = await prisma.party.update({
      where: { id: parseInt(id) },
      data: {
        name,
        date: new Date(date),
        location,
        description,
      },
    })

    return NextResponse.json({ success: true, party })
  } catch (error) {
    console.error('Error updating party:', error)
    return NextResponse.json({ error: 'Failed to update party' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')
    const password = searchParams.get('password')

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email: email! },
    })

    if (!admin || !(await bcrypt.compare(password!, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Delete party (cascade will handle children and related data)
    await prisma.party.delete({
      where: { id: parseInt(id!) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting party:', error)
    return NextResponse.json({ error: 'Failed to delete party' }, { status: 500 })
  }
}