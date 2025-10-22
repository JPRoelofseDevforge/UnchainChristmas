import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name, age, partyId, wishlist } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create child
    const child = await prisma.child.create({
      data: {
        name,
        age: parseInt(age),
        partyId: parseInt(partyId),
      },
    })

    // Create wishlist items
    if (wishlist && Array.isArray(wishlist)) {
      await prisma.wishlistItem.createMany({
        data: wishlist.map((item: string) => ({
          childId: child.id,
          text: item,
        })),
      })
    }

    return NextResponse.json({ success: true, child })
  } catch (error) {
    console.error('Error creating child:', error)
    return NextResponse.json({ error: 'Failed to create child' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const children = await prisma.child.findMany({
      include: {
        party: true,
        wishlist: true,
        pledges: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(children)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { email, password, id, name, age, partyId, pledged, wishlist } = await request.json()

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Update child
    const child = await prisma.child.update({
      where: { id: parseInt(id) },
      data: {
        name,
        age: parseInt(age),
        partyId: parseInt(partyId),
        pledged: pledged || false,
      },
    })

    // Update wishlist items - delete existing and create new ones
    if (wishlist && Array.isArray(wishlist)) {
      // Delete existing wishlist items
      await prisma.wishlistItem.deleteMany({
        where: { childId: parseInt(id) },
      })

      // Create new wishlist items (filter out empty strings)
      const validWishlist = wishlist.filter((item: string) => item.trim() !== '')
      if (validWishlist.length > 0) {
        await prisma.wishlistItem.createMany({
          data: validWishlist.map((item: string) => ({
            childId: parseInt(id),
            text: item,
          })),
        })
      }
    }

    return NextResponse.json({ success: true, child })
  } catch (error) {
    console.error('Error updating child:', error)
    return NextResponse.json({ error: 'Failed to update child' }, { status: 500 })
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

    // Delete child (cascade will handle wishlist and pledges)
    await prisma.child.delete({
      where: { id: parseInt(id!) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting child:', error)
    return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 })
  }
}