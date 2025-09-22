import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { issueUnlockJWT } from '@/lib/jwt'
import { sendUnlockEmail } from '@/lib/email'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get the list from metadata
        const listId = session.metadata?.listId
        const ownerId = session.metadata?.ownerId
        
        if (!listId || !ownerId) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get the list
        const list = await db.list.findUnique({
          where: { id: listId }
        })

        if (!list) {
          console.error('List not found:', listId)
          break
        }

        // Create order
        const order = await db.order.create({
          data: {
            buyerEmail: session.customer_details?.email || '',
            listId: list.id,
            amountCents: session.amount_total || 0,
            currency: session.currency || 'usd',
            stripeSessionId: session.id,
            stripePaymentId: session.payment_intent as string,
            status: 'PAID'
          }
        })

        // Create access grant
        await db.accessGrant.create({
          data: {
            orderId: order.id,
            listId: list.id,
            buyerEmail: order.buyerEmail
          }
        })

        // Issue unlock JWT token
        const { token, jti, exp } = await issueUnlockJWT({
          orderId: order.id,
          listId: list.id,
          email: order.buyerEmail
        })

        // Store session token for validation
        await db.sessionToken.create({
          data: {
            id: jti,
            orderId: order.id,
            expiresAt: new Date(exp * 1000)
          }
        })

        // Send unlock email
        await sendUnlockEmail(
          order.buyerEmail,
          `${process.env.NEXT_PUBLIC_APP_URL}/unlock/${token}`,
          list.title
        )

        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Find the order by payment intent ID
        const order = await db.order.findFirst({
          where: { stripePaymentId: charge.payment_intent as string }
        })

        if (order) {
          // Update order status
          await db.order.update({
            where: { id: order.id },
            data: { status: 'REFUNDED' }
          })

          // Revoke access grants
          await db.accessGrant.updateMany({
            where: { orderId: order.id },
            data: { revoked: true }
          })
        }

        break
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        
        // Update user's Stripe account status if needed
        await db.user.updateMany({
          where: { stripeAccount: account.id },
          data: { 
            // You might want to store additional account status info here
          }
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

