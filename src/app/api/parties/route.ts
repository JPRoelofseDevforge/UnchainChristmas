import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      select: {
        id: true,
        name: true,
        date: true,
        location: true,
        description: true,
        _count: {
          select: { children: true }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(parties)
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json({ error: 'Failed to fetch parties' }, { status: 500 })
  }
}