import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, DollarSign, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const [lists, orders, totalRevenue] = await Promise.all([
    db.list.findMany({
      where: { ownerId: userId },
      include: {
        orders: {
          where: { status: 'PAID' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    db.order.findMany({
      where: { 
        list: { ownerId: userId },
        status: 'PAID'
      },
      include: { list: true }
    }),
    db.order.aggregate({
      where: { 
        list: { ownerId: userId },
        status: 'PAID'
      },
      _sum: { amountCents: true }
    })
  ])

  const totalSales = orders.length
  const revenue = totalRevenue._sum.amountCents || 0

  return {
    lists,
    totalSales,
    revenue,
    recentOrders: orders.slice(0, 5)
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const { lists, totalSales, revenue, recentOrders } = await getDashboardData(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {"Welcome back! Here's what's happening with your lists."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lists.length}</div>
            <p className="text-xs text-muted-foreground">
              {lists.filter(l => l.published).length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(revenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lists.length > 0 ? ((totalSales / lists.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average per list
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lists</CardTitle>
            <CardDescription>Your latest created lists</CardDescription>
          </CardHeader>
          <CardContent>
            {lists.length === 0 ? (
              <div className="text-center py-6">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lists yet</h3>
                <p className="text-gray-600 mb-4">Create your first list to start earning</p>
                <Button asChild>
                  <Link href="/dashboard/lists/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create List
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {lists.map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{list.title}</h4>
                      <p className="text-sm text-gray-600">
                        {list.orders.length} sales • ${(list.priceCents / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={list.published ? 'default' : 'secondary'}>
                        {list.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/lists/${list.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest purchases of your lists</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-6">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
                <p className="text-gray-600">Sales will appear here once customers start buying</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{order.list.title}</h4>
                      <p className="text-sm text-gray-600">
                        {order.buyerEmail} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(order.amountCents / 100).toFixed(2)}</p>
                      <Badge variant="default">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
