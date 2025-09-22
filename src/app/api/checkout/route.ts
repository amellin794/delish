import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stripe, calculatePlatformFee } from '@/lib/stripe'
import { checkoutSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listId, buyerEmail } = checkoutSchema.parse(body)

    // Get the list and verify it's published
    const list = await db.list.findFirst({
      where: {
        id: listId,
        published: true
      },
      include: {
        owner: true
      }
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found or not published' }, { status: 404 })
    }

    if (!list.owner.stripeAccount) {
      return NextResponse.json({ error: 'Creator has not connected Stripe account' }, { status: 400 })
    }

    // Create or get Stripe product and price
    const product = await stripe.products.create({
      name: list.title,
      description: list.description || undefined,
      images: list.coverImageUrl ? [list.coverImageUrl] : undefined,
    })

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: list.priceCents,
      currency: list.currency,
    })

    // Calculate platform fee
    const platformFee = calculatePlatformFee(list.priceCents)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: buyerEmail,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/post-checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/l/${list.slug}`,
      metadata: {
        listId: list.id,
        ownerId: list.ownerId,
      },
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: list.owner.stripeAccount,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

