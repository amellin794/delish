import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if list exists and belongs to user
    const existingList = await db.list.findFirst({
      where: {
        id: params.id,
        ownerId: userId
      }
    })

    if (!existingList) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // Check if user has Stripe account connected
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user?.stripeAccount) {
      return NextResponse.json(
        { error: 'Stripe account not connected. Please connect your Stripe account first.' },
        { status: 400 }
      )
    }

    const list = await db.list.update({
      where: { id: params.id },
      data: { published: true }
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error publishing list:', error)
    return NextResponse.json(
      { error: 'Failed to publish list' },
      { status: 500 }
    )
  }
}
