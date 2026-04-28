export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled'
  | 'overdue'

export type PaymentMethod = 'cash' | 'qr_promptpay' | 'payroll_deduction' | 'invoice_billing'
export type DeliveryType = 'delivery' | 'pickup'

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
  delivery_type: DeliveryType
  created_at: string
  updated_at: string
}

export type CreateOrderPayload = {
  items: { product_id: string; quantity: number }[]
  address: { address_id?: string; address?: string; lat?: number; lng?: number }
  payment: PaymentMethod
  source?: 'online' | 'pos_walkin' | 'pos_delivery' | 'phone' | 'agent'
  purchase_right_id?: string
  scheduled_date?: string
  scheduled_time_slot?: string
  delivery_notes?: string
  discount_amount?: number
  delivery_type?: DeliveryType
}

export type CancelOrderPayload = {
  reason: string
}

export type ReturnBottlesPayload = {
  bottles_returned: number
}
