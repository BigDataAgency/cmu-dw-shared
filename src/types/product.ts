export type CustomerGroup = 'general' | 'university' | 'wholesale' | 'vip'

export type ProductPrice = {
  id: string
  customer_group: CustomerGroup
  price: number
  unit: string
}

export type Product = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  is_active: boolean
  prices: ProductPrice[]
  created_at: string
  updated_at: string
}

export type CreateProductPayload = {
  name: string
  description?: string
  image_url?: string
  prices: Omit<ProductPrice, 'id'>[]
}

export type UpdateProductPayload = Partial<CreateProductPayload>
