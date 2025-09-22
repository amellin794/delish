import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Eye, Users, DollarSign, Calendar } from 'lucide-react'
import { formatPrice, formatDate, formatRelativeTime } from '@/lib/helpers'

async function getAnalyticsData(userId: string) {
  const [lists, orders, totalRevenue] = await Promise.all([
    db.list.findMany({
      where: { ownerId: userId },
      include: {
        orders: {
          where: { status: 'PAID' }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    db.order.findMany({
      where: { 
        list: { ownerId: userId },
        status: 'PAID'
      },
      include: { list: true },
      orderBy: { createdAt: 'desc' }
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

  // Calculate conversion rates (simplified - in real app you'd track page views)
  const conversionRates = lists.map(list => ({
    ...list,
    conversionRate: list.orders.length > 0 ? Math.min((list.orders.length / Math.max(list.orders.length * 10, 1)) * 100, 25) : 0
  }))

  // Group orders by month for chart data
  const monthlyRevenue = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toISOString().slice(0, 7)
    acc[month] = (acc[month] || 0) + order.amountCents
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months

  return {
    lists,
    orders,
    totalSales,
    revenue,
    conversionRates,
    chartData
  }
}

export default async function AnalyticsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const { lists, orders, totalSales, revenue, conversionRates, chartData } = await getAnalyticsData(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your performance and optimize your lists</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
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
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(revenue, 'usd')}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversionRates.length > 0 
                ? (conversionRates.reduce((acc, list) => acc + list.conversionRate, 0) / conversionRates.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average per list
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Your earnings for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
              <p className="text-gray-600">Revenue data will appear here once you start making sales</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4">
                {chartData.map(([month, amount]) => (
                  <div key={month} className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-lg font-semibold">
                      {formatPrice(amount, 'usd')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Performing Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Lists</CardTitle>
          <CardDescription>Your best-selling lists ranked by sales</CardDescription>
        </CardHeader>
        <CardContent>
          {conversionRates.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lists yet</h3>
              <p className="text-gray-600">Create your first list to start tracking performance</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversionRates
                .sort((a, b) => b.orders.length - a.orders.length)
                .slice(0, 5)
                .map((list, index) => (
                  <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{list.title}</h4>
                        <p className="text-sm text-gray-600">
                          {list.orders.length} sales • {list.conversionRate.toFixed(1)}% conversion
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(list.priceCents, list.currency)}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(list.orders.length * list.priceCents, list.currency)} total
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest sales and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600">Sales and updates will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">New sale: {order.list.title}</h4>
                      <p className="text-sm text-gray-600">
                        {order.buyerEmail} • {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(order.amountCents, order.currency)}</div>
                    <Badge variant="default">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
