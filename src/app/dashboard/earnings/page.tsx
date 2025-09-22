import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, CreditCard, AlertCircle, ExternalLink } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/helpers'

async function getEarningsData(userId: string) {
  const [user, orders, totalRevenue, recentOrders] = await Promise.all([
    db.user.findUnique({
      where: { id: userId }
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
    }),
    db.order.findMany({
      where: { 
        list: { ownerId: userId },
        status: 'PAID'
      },
      include: { list: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ])

  const totalSales = orders.length
  const revenue = totalRevenue._sum.amountCents || 0
  const platformFee = Math.round(revenue * 0.10) + (totalSales * 30) // 10% + $0.30 per sale
  const netRevenue = revenue - platformFee

  return {
    user,
    totalSales,
    revenue,
    platformFee,
    netRevenue,
    recentOrders
  }
}

export default async function EarningsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  const { user, totalSales, revenue, platformFee, netRevenue, recentOrders } = await getEarningsData(userId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600">Track your revenue and manage payouts</p>
      </div>

      {/* Stripe Connect Status */}
      {!user?.stripeAccount ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Connect Your Stripe Account
                </h3>
                <p className="text-orange-800 mb-4">
                  You need to connect your Stripe account to receive payouts. 
                  This process takes just a few minutes and is required to publish your lists.
                </p>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Stripe Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Stripe Account Connected</h3>
                <p className="text-green-800 text-sm">{"You're all set to receive payouts"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(revenue, 'usd')}
            </div>
            <p className="text-xs text-muted-foreground">
              Before fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatPrice(platformFee, 'usd')}
            </div>
            <p className="text-xs text-muted-foreground">
              10% + $0.30 per sale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(netRevenue, 'usd')}
            </div>
            <p className="text-xs text-muted-foreground">
              After fees
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest sales and earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600">Sales will appear here once customers start buying your lists</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{order.list.title}</h4>
                    <p className="text-sm text-gray-600">
                      {order.buyerEmail} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.amountCents, order.currency)}</p>
                    <Badge variant="default">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Information */}
      {user?.stripeAccount && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
            <CardDescription>Manage your Stripe account and payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Stripe Dashboard</h4>
                <p className="text-blue-800 text-sm mb-3">
                  View detailed payout information, tax documents, and account settings in your Stripe dashboard.
                </p>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Stripe Dashboard
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Payout Schedule:</strong> Payouts are processed automatically by Stripe</p>
                <p><strong>Minimum Payout:</strong> $1.00</p>
                <p><strong>Processing Time:</strong> 2-7 business days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
