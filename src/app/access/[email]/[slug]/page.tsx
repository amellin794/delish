import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ExternalLink } from 'lucide-react'
import { UnlockActions } from '@/components/unlock-actions'

interface AccessPageProps {
  params: Promise<{
    email: string
    slug: string
  }>
}

async function getAccessData(email: string, slug: string) {
  const list = await db.list.findUnique({
    where: { slug }
  })

  if (!list) {
    return null
  }

  // Find orders for this email and list
  const orders = await db.order.findMany({
    where: {
      buyerEmail: email,
      listId: list.id,
      status: 'PAID'
    },
    include: {
      accessGrants: {
        where: { revoked: false }
      }
    }
  })

  if (orders.length === 0) {
    return null
  }

  return { list, orders }
}

export default async function AccessPage({ params }: AccessPageProps) {
  const { email, slug } = await params
  const accessData = await getAccessData(email, slug)

  if (!accessData) {
    notFound()
  }

  const { list, orders } = accessData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Delish</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Welcome Back!</CardTitle>
              <CardDescription className="text-lg">
                Access your purchased map: <strong>{list.title}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Your Map</h3>
                <p className="text-blue-800 text-sm mb-3">
                  {list.description || 'Curated by a local expert'}
                </p>
                <div className="text-sm text-blue-700">
                  Purchased on {new Date(orders[0].createdAt).toLocaleDateString()}
                </div>
              </div>

              <UnlockActions list={list} />

              <div className="text-center">
                <Button variant="outline" asChild>
                  <Link href="/">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
