import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import * as XLSX from 'xlsx'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const password = searchParams.get('password')

    // Verify admin credentials
    const admin = await prisma.adminUser.findUnique({
      where: { email: email! },
    })

    if (!admin || !(await bcrypt.compare(password!, admin.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Fetch all data with relationships
    const parties = await prisma.party.findMany({
      include: {
        children: {
          include: {
            wishlist: true,
            pledges: {
              orderBy: { createdAt: 'desc' }
            },
          },
        },
      },
      orderBy: { date: 'asc' }
    })

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()

    // Create a sheet for each party with their children and pledge details
    parties.forEach(party => {
      const partyData = party.children.map(child => ({
        'Child ID': child.id,
        'Child Name': child.name,
        'Age': child.age,
        'Has Received Pledge': child.pledged ? 'YES' : 'NO',
        'Wishlist Items': child.wishlist.map(w => w.text).join('; '),
        'Number of Wishes': child.wishlist.length,
        'Pledger Name': child.pledges.length > 0 ? child.pledges[0].donorName || 'Anonymous' : 'No pledge yet',
        'Pledger Email': child.pledges.length > 0 ? child.pledges[0].donorEmail || '' : '',
        'Pledger Phone': child.pledges.length > 0 ? child.pledges[0].donorPhone || '' : '',
        'Pledge Message': child.pledges.length > 0 ? child.pledges[0].message || '' : '',
        'Pledge Date': child.pledges.length > 0 ? new Date(child.pledges[0].createdAt).toLocaleDateString('en-ZA') : '',
        'Pledge Time': child.pledges.length > 0 ? new Date(child.pledges[0].createdAt).toLocaleTimeString('en-ZA') : '',
      }))

      // Add party summary at the top
      const partySummary = [{
        'Child ID': 'PARTY SUMMARY',
        'Child Name': party.name,
        'Age': '',
        'Has Received Pledge': '',
        'Wishlist Items': `Date: ${new Date(party.date).toLocaleDateString('en-ZA')}`,
        'Number of Wishes': `Location: ${party.location}`,
        'Pledger Name': `Total Children: ${party.children.length}`,
        'Pledger Email': `Pledged: ${party.children.filter(c => c.pledged).length}`,
        'Pledger Phone': `Waiting: ${party.children.filter(c => !c.pledged).length}`,
        'Pledge Message': party.description,
        'Pledge Date': '',
        'Pledge Time': '',
      }]

      const sheetData = [...partySummary, ...partyData]
      const sheet = XLSX.utils.json_to_sheet(sheetData)

      // Clean sheet name (remove special characters)
      const cleanSheetName = party.name.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 31)
      XLSX.utils.book_append_sheet(workbook, sheet, cleanSheetName)
    })

    // Also create a master summary sheet
    const masterData = parties.map(party => ({
      'Party Name': party.name,
      'Date': new Date(party.date).toLocaleDateString('en-ZA'),
      'Location': party.location,
      'Total Children': party.children.length,
      'Children with Pledges': party.children.filter(c => c.pledged).length,
      'Children Waiting': party.children.filter(c => !c.pledged).length,
      'Pledge Rate': party.children.length > 0 ? `${Math.round((party.children.filter(c => c.pledged).length / party.children.length) * 100)}%` : '0%',
    }))

    const masterSheet = XLSX.utils.json_to_sheet(masterData)
    XLSX.utils.book_append_sheet(workbook, masterSheet, 'Master Summary')

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="unchain-christmas-report-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })

  } catch (error) {
    console.error('Error generating Excel export:', error)
    return NextResponse.json({ error: 'Failed to generate export' }, { status: 500 })
  }
}