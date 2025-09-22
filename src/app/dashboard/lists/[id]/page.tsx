'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateListSchema, type UpdateListData } from '@/lib/validations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { MapPin, ExternalLink, AlertCircle, Save, Eye, Trash2 } from 'lucide-react'
import { formatPrice, isValidGoogleMapsListUrl } from '@/lib/helpers'

interface FormData {
  title?: string
  description?: string
  mapsListUrl?: string
  priceCents?: number
  currency?: string
  hostedMirror?: boolean
}

interface List {
  id: string
  title: string
  description?: string
  mapsListUrl: string
  priceCents: number
  currency: string
  published: boolean
  hostedMirror: boolean
  slug: string
  orders: Array<{ id: string }>
}

export default function ListEditPage() {
  const params = useParams()
  const router = useRouter()
  const [list, setList] = useState<List | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
      priceCents: 0,
      currency: 'usd',
      hostedMirror: false
    }
  })

  const watchedUrl = watch('mapsListUrl')
  const watchedPrice = watch('priceCents')

  useEffect(() => {
    fetchList()
  }, [params.id])

  const fetchList = async () => {
    if (!params.id) return
    
    try {
      const response = await fetch(`/api/lists/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setList(data)
        // Populate form with existing data
        setValue('title', data.title)
        setValue('description', data.description || '')
        setValue('mapsListUrl', data.mapsListUrl)
        setValue('priceCents', data.priceCents)
        setValue('currency', data.currency)
        setValue('hostedMirror', data.hostedMirror)
      } else {
        console.error('Failed to fetch list')
      }
    } catch (error) {
      console.error('Error fetching list:', error)
    } finally {
      setIsLoading(false)
    }
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
    if (!params.id) return
    
    if (data.mapsListUrl && !validateGoogleMapsUrl(data.mapsListUrl)) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/lists/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedList = await response.json()
        setList(updatedList)
      } else {
        const error = await response.json()
        console.error('Error updating list:', error)
      }
    } catch (error) {
      console.error('Error updating list:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!params.id) return
    
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/lists/${params.id}/publish`, {
        method: 'POST',
      })

      if (response.ok) {
        const updatedList = await response.json()
        setList(updatedList)
      } else {
        const error = await response.json()
        console.error('Error publishing list:', error)
      }
    } catch (error) {
      console.error('Error publishing list:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!params.id) return
    
    if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/lists/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/lists')
      } else {
        const error = await response.json()
        console.error('Error deleting list:', error)
      }
    } catch (error) {
      console.error('Error deleting list:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading list...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">List not found</h2>
        <p className="text-gray-600 mb-4">
          {"The list you're looking for doesn't exist or you don't have access to it."}
        </p>
        <Button onClick={() => router.push('/dashboard/lists')}>
          Back to Lists
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit List</h1>
          <p className="text-gray-600">Update your list details and settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={list.published ? 'default' : 'secondary'}>
            {list.published ? 'Published' : 'Draft'}
          </Badge>
          {list.published && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/l/${list.slug}`} target="_blank">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your list details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">List Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Additional features for your list
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
                  <Switch
                    checked={watch('hostedMirror')}
                    onCheckedChange={(checked) => setValue('hostedMirror', checked)}
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
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Status */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={list.published ? 'default' : 'secondary'}>
                  {list.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              
              {!list.published && (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="w-full"
                >
                  {isPublishing ? 'Publishing...' : 'Publish List'}
                </Button>
              )}

              {list.published && (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/l/${list.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Public Page
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sales</span>
                <span className="font-medium">{list.orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Price</span>
                <span className="font-medium">{formatPrice(list.priceCents, list.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-medium">
                  {formatPrice(list.orders.length * list.priceCents, list.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete List
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
