'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard } from 'lucide-react'

interface CheckoutButtonProps {
  listId: string
}

export function CheckoutButton({ listId }: CheckoutButtonProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId,
          buyerEmail: email,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to start checkout')
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Complete Purchase</span>
        </CardTitle>
        <CardDescription>
          Enter your email to start the secure checkout process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>

        <Button
          onClick={handleCheckout}
          disabled={isLoading || !email}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Checkout
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Powered by Stripe • Secure payment processing
        </p>
      </CardContent>
    </Card>
  )
}

