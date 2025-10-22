import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { childId, donorName, donorEmail, donorPhone, message } = await request.json()

    if (!childId) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 })
    }

    // Check if child exists and is not already pledged
    const child = await prisma.child.findUnique({
      where: { id: parseInt(childId) },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    if (child.pledged) {
      return NextResponse.json({ error: 'This child has already been pledged for' }, { status: 400 })
    }

    // Create pledge and update child status
    const pledge = await prisma.pledge.create({
      data: {
        childId: parseInt(childId),
        donorName,
        donorEmail,
        donorPhone,
        message,
      },
    })

    await prisma.child.update({
      where: { id: parseInt(childId) },
      data: { pledged: true },
    })

    return NextResponse.json({ success: true, pledge })
  } catch (error) {
    console.error('Error creating pledge:', error)
    return NextResponse.json({ error: 'Failed to create pledge' }, { status: 500 })
  }
}