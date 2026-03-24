export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'overdue'

export type PaymentMethod = 'cash' | 'transfer' | 'credit'

export type OrderItem = {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export type Order = {
  id: string
  order_number: string
  customer_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  address_id: string
  items: OrderItem[]
  total_amount: number
  note: string | null
  created_at: string
  updated_at: string
}

export type CreateOrderPayload = {
  items: { product_id: string; quantity: number }[]
  payment_method: PaymentMethod
  address_id: string
  note?: string
}

export type CancelOrderPayload = {
  reason: string
}

export type ReturnBottlesPayload = {
  bottles_returned: number
}
