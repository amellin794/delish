import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { verifyUnlockJWT } from '@/lib/jwt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink, Copy, CheckCircle, Users, Clock } from 'lucide-react'
import { formatPrice, formatRelativeTime } from '@/lib/helpers'
import { UnlockActions } from '@/components/unlock-actions'

interface UnlockPageProps {
  params: Promise<{
    token: string
  }>
}

async function getUnlockData(token: string) {
  // Verify the JWT token
  const payload = await verifyUnlockJWT(token)
  
  if (!payload) {
    return null
  }

  // Check if token is still valid in database
  const sessionToken = await db.sessionToken.findUnique({
    where: { id: payload.jti }
  })

  if (!sessionToken || new Date() > sessionToken.expiresAt) {
    return null
  }

  // Get the order and list
  const order = await db.order.findUnique({
    where: { id: payload.orderId },
    include: {
      list: {
        include: {
          owner: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  if (!order || order.status !== 'PAID') {
    return null
  }

  // Check if access is revoked
  const accessGrant = await db.accessGrant.findFirst({
    where: {
      orderId: order.id,
      buyerEmail: payload.email,
      revoked: false
    }
  })

  if (!accessGrant) {
    return null
  }

  // Update last access time
  await db.accessGrant.update({
    where: { id: accessGrant.id },
    data: { lastAccessAt: new Date() }
  })

  // Invalidate the JWT token (single use)
  await db.sessionToken.delete({
    where: { id: payload.jti }
  })

  return {
    order,
    list: order.list,
    accessGrant
  }
}

export async function generateMetadata({ params }: UnlockPageProps) {
  return {
    title: 'Unlock Your Map - Delish',
    description: 'Access your purchased curated map',
  }
}

export default async function UnlockPage({ params }: UnlockPageProps) {
  const { token } = await params
  const unlockData = await getUnlockData(token)

  if (!unlockData) {
    notFound()
  }

  const { order, list, accessGrant } = unlockData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Delish</span>
          </div>
          <Badge variant="secondary">
            Purchased {formatRelativeTime(order.createdAt)}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to {list.title}!
            </h1>
            <p className="text-lg text-gray-600">
              Your curated map is ready to explore
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Map Access */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Your Map</span>
                  </CardTitle>
                  <CardDescription>
                    Access your curated Google Maps list
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">{list.title}</h3>
                    <p className="text-blue-800 text-sm mb-3">
                      {list.description || 'Curated by a local expert'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-blue-700">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>By {list.owner.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {formatRelativeTime(list.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <UnlockActions list={list} />
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Open in Google Maps</p>
                      <p className="text-sm text-gray-600">Click the button above to open your list in Google Maps</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Follow the List</p>
                      <p className="text-sm text-gray-600">
                        {"Click \"Follow\" in Google Maps to save it to your account"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Start Exploring</p>
                      <p className="text-sm text-gray-600">Navigate to each location and enjoy your curated experience</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Purchase Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item</span>
                    <span className="font-medium">{list.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium">{formatPrice(list.priceCents, list.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchased</span>
                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{order.buyerEmail}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Hosted Mirror */}
              {list.hostedMirror && (
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Map</CardTitle>
                    <CardDescription>
                      Explore all locations in an embedded map
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">Interactive map coming soon</p>
                        <p className="text-gray-500 text-xs">This feature will show all locations in one view</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">
                    If you have any questions about this list or need assistance, 
                    please contact the creator or our support team.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact Creator
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
