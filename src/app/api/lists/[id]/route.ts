import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { updateListSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const list = await db.list.findFirst({
      where: {
        id: params.id,
        ownerId: userId
      },
      include: {
        orders: {
          where: { status: 'PAID' },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateListSchema.parse(body)

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

    const list = await db.list.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await db.list.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting list:', error)
    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 }
    )
  }
}
