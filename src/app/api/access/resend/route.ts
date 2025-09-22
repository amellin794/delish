import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resendAccessSchema } from '@/lib/validations'
import { sendMagicLinkEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, listSlug } = resendAccessSchema.parse(body)

    // Find the list
    const list = await db.list.findUnique({
      where: { slug: listSlug }
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // Find orders for this email and list
    const orders = await db.order.findMany({
      where: {
        buyerEmail: email,
        listId: list.id,
        status: 'PAID'
      },
      include: {
        accessGrants: {
          where: { revoked: false }
        }
      }
    })

    if (orders.length === 0) {
      return NextResponse.json({ error: 'No purchases found for this email' }, { status: 404 })
    }

    // Generate magic link (in a real implementation, this would be a proper magic link)
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/access/${email}/${listSlug}`

    // Send magic link email
    const emailSent = await sendMagicLinkEmail(email, magicLink)

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error resending access:', error)
    return NextResponse.json(
      { error: 'Failed to resend access' },
      { status: 500 }
    )
  }
}

