import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, childId, text } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create wishlist item
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        childId: parseInt(childId),
        text,
      },
    })

    return NextResponse.json({ success: true, wishlistItem })
  } catch (error) {
    console.error('Error creating wishlist item:', error)
    return NextResponse.json({ error: 'Failed to create wishlist item' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      include: {
        child: {
          include: {
            party: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(wishlistItems)
  } catch (error) {
    console.error('Error fetching wishlist items:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist items' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { email, password, id, childId, text } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update wishlist item
    const wishlistItem = await prisma.wishlistItem.update({
      where: { id: parseInt(id) },
      data: {
        childId: parseInt(childId),
        text,
      },
    })

    return NextResponse.json({ success: true, wishlistItem })
  } catch (error) {
    console.error('Error updating wishlist item:', error)
    return NextResponse.json({ error: 'Failed to update wishlist item' }, { status: 500 })
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

    // Delete wishlist item
    await prisma.wishlistItem.delete({
      where: { id: parseInt(id!) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wishlist item:', error)
    return NextResponse.json({ error: 'Failed to delete wishlist item' }, { status: 500 })
  }
}