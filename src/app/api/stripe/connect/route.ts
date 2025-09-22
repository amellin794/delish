import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a Stripe account
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (user?.stripeAccount) {
      return NextResponse.json({ error: 'Stripe account already connected' }, { status: 400 })
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // You might want to make this dynamic based on user location
      email: user?.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Update user with Stripe account ID
    await db.user.update({
      where: { id: userId },
      data: { stripeAccount: account.id }
    })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/earnings?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/earnings?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return NextResponse.json(
      { error: 'Failed to create Stripe account' },
      { status: 500 }
    )
  }
}
