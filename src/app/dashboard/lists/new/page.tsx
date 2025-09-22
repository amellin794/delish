'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createListSchema, type CreateListData } from '@/lib/validations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MapPin, ExternalLink, AlertCircle } from 'lucide-react'
import { generateSlug, isValidGoogleMapsListUrl } from '@/lib/helpers'

interface FormData {
  title: string
  description: string
  mapsListUrl: string
  priceCents: number
  currency: string
  hostedMirror: boolean
}

export default function NewListPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [urlError, setUrlError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      mapsListUrl: '',
      priceCents: 500, // $5.00 default
      currency: 'usd',
      hostedMirror: false
    }
  })

  const watchedTitle = watch('title')
  const watchedUrl = watch('mapsListUrl')
  const watchedPrice = watch('priceCents')

  const generateSlugFromTitle = () => {
    if (watchedTitle) {
      return generateSlug(watchedTitle)
    }
    return ''
  }

  const validateGoogleMapsUrl = (url: string) => {
    if (url && !isValidGoogleMapsListUrl(url)) {
      setUrlError('Please enter a valid Google Maps list URL')
      return false
    } else {
      setUrlError('')
      return true
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!validateGoogleMapsUrl(data.mapsListUrl)) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          slug: generateSlugFromTitle()
        }),
      })

      if (response.ok) {
        const list = await response.json()
        router.push(`/dashboard/lists/${list.id}`)
      } else {
        const error = await response.json()
        console.error('Error creating list:', error)
      }
    } catch (error) {
      console.error('Error creating list:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New List</h1>
        <p className="text-gray-600">Set up your first paywalled Google Maps list</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your curated list
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">List Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Best Coffee Shops in NYC"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe what makes this list special..."
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="mapsListUrl">Google Maps List URL *</Label>
              <div className="space-y-2">
                <Input
                  id="mapsListUrl"
                  {...register('mapsListUrl')}
                  placeholder="https://maps.google.com/..."
                  className={errors.mapsListUrl || urlError ? 'border-red-500' : ''}
                  onChange={(e) => {
                    register('mapsListUrl').onChange(e)
                    validateGoogleMapsUrl(e.target.value)
                  }}
                />
                {urlError && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{urlError}</span>
                  </div>
                )}
                {errors.mapsListUrl && (
                  <p className="text-sm text-red-600">{errors.mapsListUrl.message}</p>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ExternalLink className="h-4 w-4" />
                  <span>
                    {"Make sure to use the \"Share\" button in Google Maps to get the list URL"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label>Preview URL</Label>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  delish.app/l/{generateSlugFromTitle() || 'your-list-slug'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set your price and currency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceCents">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="priceCents"
                    type="number"
                    step="0.01"
                    min="2.00"
                    max="199.00"
                    {...register('priceCents', { valueAsNumber: true })}
                    className="pl-8"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) * 100
                      setValue('priceCents', Math.round(value))
                    }}
                    value={watchedPrice ? (watchedPrice / 100).toFixed(2) : ''}
                  />
                </div>
                {errors.priceCents && (
                  <p className="text-sm text-red-600 mt-1">{errors.priceCents.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={watch('currency')}
                  onValueChange={(value) => setValue('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="cad">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-md">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Platform fee: 10% + $0.30 per sale. {"You'll receive "}
                  <strong>${((watchedPrice || 0) * 0.9 - 30).toFixed(2)}</strong>
                  {' '}per sale.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Advanced Options</CardTitle>
            <CardDescription>
              Optional features for enhanced user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Hosted Mirror</h4>
                <p className="text-sm text-gray-600">
                  Create an embedded map so buyers get value even if Google changes your original URL
                </p>
              </div>
              <input
                type="checkbox"
                {...register('hostedMirror')}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create List'}
          </Button>
        </div>
      </form>
    </div>
  )
}
