import { z } from 'zod'

export const createListSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  mapsListUrl: z.string().url('Must be a valid URL'),
  priceCents: z.number().min(200, 'Minimum price is $2.00').max(19900, 'Maximum price is $199.00'),
  currency: z.string().default('usd'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  hostedMirror: z.boolean().default(false),
})

export type CreateListData = z.infer<typeof createListSchema>

export const updateListSchema = createListSchema.partial()

export type UpdateListData = z.infer<typeof updateListSchema>

export const checkoutSchema = z.object({
  listId: z.string().cuid(),
  buyerEmail: z.string().email('Invalid email address'),
})

export const resendAccessSchema = z.object({
  email: z.string().email('Invalid email address'),
  listSlug: z.string().min(1, 'List slug is required'),
})

export const googleMapsListUrlSchema = z.string().url().refine(
  (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes('google.com') && urlObj.pathname.includes('/maps/')
    } catch {
      return false
    }
  },
  'Must be a valid Google Maps list URL'
)
