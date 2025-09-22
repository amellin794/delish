import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Plus, Eye, Edit, MoreHorizontal, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, formatRelativeTime } from '@/lib/helpers'

async function getLists(userId: string) {
  return db.list.findMany({
    where: { ownerId: userId },
    include: {
      orders: {
        where: { status: 'PAID' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function ListsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const lists = await getLists(userId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Lists</h1>
          <p className="text-gray-600">Manage and track your published lists</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lists/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New List
          </Link>
        </Button>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lists yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first list to start monetizing your curated Google Maps collections.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard/lists/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First List
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {lists.map((list) => (
            <Card key={list.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{list.title}</h3>
                      <Badge variant={list.published ? 'default' : 'secondary'}>
                        {list.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    
                    {list.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{list.description}</p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatPrice(list.priceCents, list.currency)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{list.orders.length} sales</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Created {formatRelativeTime(list.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {list.published && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/l/${list.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/lists/${list.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
