'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, ExternalLink, Copy, Mail } from 'lucide-react'
import { MapPin } from 'lucide-react'

interface CheckoutData {
  sessionId: string
  unlockUrl: string
  listTitle: string
  buyerEmail: string
}

export default function PostCheckoutPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchCheckoutData(sessionId)
    } else {
      setError('No session ID provided')
      setIsLoading(false)
    }
  }, [sessionId])

  const fetchCheckoutData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)
      
      if (response.ok) {
        const data = await response.json()
        setCheckoutData(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load checkout data')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your purchase...</h2>
            <p className="text-gray-600">Please wait while we set up your access.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-600 text-xl">❓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No checkout data found</h2>
            <p className="text-gray-600 mb-4">
              {"We couldn't find your purchase information."}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Purchase Successful!</CardTitle>
              <CardDescription className="text-lg">
                You now have access to <strong>{checkoutData.listTitle}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{"What's next?"}</h3>
                <p className="text-blue-800 text-sm">
                  {"We've sent your unlock link to "}
                  <strong>{checkoutData.buyerEmail}</strong>
                  {'. Check your email and click the link to access your map.'}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Access Your Map</h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => window.open(checkoutData.unlockUrl, '_blank')}
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Your Map
                  </Button>

                  <div className="flex space-x-2">
                    <input
                      value={checkoutData.unlockUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(checkoutData.unlockUrl)}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Need help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Check your email for the unlock link</p>
                  <p>• The link will work on any device</p>
                  <p>• Contact the creator if you have questions</p>
                  <p>• Save this page for future reference</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
