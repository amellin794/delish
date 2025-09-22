import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Get the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Invalid or unpaid session' }, { status: 400 })
    }

    // Get the order from our database
    const order = await db.order.findFirst({
      where: { stripeSessionId: sessionId },
      include: {
        list: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate unlock URL (this would normally be done in the webhook)
    // For now, we'll create a simple unlock URL
    const unlockUrl = `${process.env.NEXT_PUBLIC_APP_URL}/unlock/${order.id}`

    return NextResponse.json({
      sessionId,
      unlockUrl,
      listTitle: order.list.title,
      buyerEmail: order.buyerEmail
    })
  } catch (error) {
    console.error('Error fetching checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checkout session' },
      { status: 500 }
    )
  }
}

