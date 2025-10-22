import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const partyId = parseInt(params.id)

    const party = await prisma.party.findUnique({
      where: { id: partyId },
      include: {
        children: {
          include: {
            wishlist: true,
            pledges: true,
          },
        },
      },
    })

    if (!party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    return NextResponse.json(party)
  } catch (error) {
    console.error('Error fetching party:', error)
    return NextResponse.json({ error: 'Failed to fetch party' }, { status: 500 })
  }
}