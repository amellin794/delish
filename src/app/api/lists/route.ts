import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { createListSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/helpers'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createListSchema.parse(body)

    // Generate unique slug
    let slug = generateSlug(validatedData.title)
    let counter = 1
    while (await db.list.findUnique({ where: { slug } })) {
      slug = `${generateSlug(validatedData.title)}-${counter}`
      counter++
    }

    const list = await db.list.create({
      data: {
        ...validatedData,
        slug,
        ownerId: userId,
      },
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error creating list:', error)
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const whereClause: Prisma.ListWhereInput = { ownerId: userId }
    if (status === 'published') {
      whereClause.published = true
    } else if (status === 'draft') {
      whereClause.published = false
    }

    const lists = await db.list.findMany({
      where: whereClause,
      include: {
        orders: {
          where: { status: 'PAID' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    )
  }
}
