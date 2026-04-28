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
  sku: string | null
  category: string | null
  description: string | null
  image_url: string | null
  is_active: boolean
  stock_qty: number
  low_stock_threshold: number | null
  price: number | null
  deposit_price: number | null
  pos_stock_exempt?: boolean
  prices: ProductPrice[]
  created_at: string
  updated_at: string
}

export type CreateProductPayload = {
  name: string
  description?: string
  image_url?: string
  is_active?: boolean
  prices?: Omit<ProductPrice, 'id'>[]
}

export type UpdateProductPayload = Partial<CreateProductPayload>
