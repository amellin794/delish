import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Users, Clock, Shield, ExternalLink } from 'lucide-react'
import { formatPrice } from '@/lib/helpers'
import { CheckoutButton } from '@/components/checkout-button'

interface ListPageProps {
  params: {
    slug: string
  }
}

async function getList(slug: string) {
  const list = await db.list.findUnique({
    where: { 
      slug,
      published: true 
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      },
      orders: {
        where: { status: 'PAID' }
      }
    }
  })

  return list
}

export async function generateMetadata({ params }: ListPageProps) {
  const list = await getList(params.slug)
  
  if (!list) {
    return {
      title: 'List Not Found',
    }
  }

  return {
    title: `${list.title} - Delish`,
    description: list.description || `Curated map by ${list.owner.name}`,
    openGraph: {
      title: list.title,
      description: list.description || `Curated map by ${list.owner.name}`,
      images: list.coverImageUrl ? [list.coverImageUrl] : [],
    },
  }
}

export default async function ListPage({ params }: ListPageProps) {
  const list = await getList(params.slug)

  if (!list) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Delish</span>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {list.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{list.orders.length} purchases</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {new Date(list.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {list.description && (
                  <p className="text-lg text-gray-700 mb-6">
                    {list.description}
                  </p>
                )}
              </div>

              {/* Creator Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {list.owner.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {list.owner.name || 'Anonymous Creator'}
                      </h3>
                      <p className="text-sm text-gray-600">Curated by local expert</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {"What you'll get:"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Instant access to the curated Google Maps list</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>One-click follow button to save in your Google Maps</span>
                  </div>
                  {list.hostedMirror && (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span>Embedded map with all locations visible</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Lifetime access to updates</span>
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              {list.orders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>What buyers are saying</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-700">
                          {"\"Exactly what I was looking for! Saved me hours of research.\""}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">- Recent buyer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Purchase */}
            <div className="lg:sticky lg:top-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {formatPrice(list.priceCents, list.currency)}
                    </div>
                    <CardDescription>
                      One-time payment • Lifetime access
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Map Preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Preview</h4>
                    <div className="relative bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">
                          {list.hostedMirror ? 'Interactive map preview' : 'Google Maps list preview'}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Full access after purchase
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Shield className="h-4 w-4 text-blue-600 inline mr-2" />
                          <span className="text-sm font-medium text-gray-900">Protected Content</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <CheckoutButton listId={list.id} />

                  {/* Security Badges */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Instant Access</span>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="space-y-3 text-sm">
                    <h4 className="font-medium text-gray-900">Frequently Asked Questions</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-gray-700">How do I access the list after purchase?</p>
                        <p className="text-gray-600">
                          {"You'll receive an email with a secure unlock link that gives you instant access."}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Can I get a refund?</p>
                        <p className="text-gray-600">Yes, contact the creator directly for refund requests within 7 days.</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Will I get updates?</p>
                        <p className="text-gray-600">
                          {"Yes, you'll receive notifications when the creator updates the list."}
                        </p>
                      </div>
                    </div>
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
