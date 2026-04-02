export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export type PaymentMethod = 'cash' | 'qr_promptpay' | 'invoice_billing' | 'payroll_deduction'

export type DeliveryItem = {
  product_id: string
  product_name: string
  quantity: number
}

export type Delivery = {
  id: string
  order_id: string
  driver_id: string | null
  route_plan_stop_id: string | null
  status: DeliveryStatus
  items: DeliveryItem[]
  address: string
  lat: number | null
  lng: number | null
  note: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

/** GET /deliveries/:id — expanded response with order info + product flags (v1.20.0) */
export type DeliveryDetail = Delivery & {
  orders: {
    order_number: string
    payment_method: PaymentMethod
    order_type: string
    delivery_address: string
    delivery_recipient_name: string | null
    delivery_phone: string | null
    delivery_notes: string | null
    delivery_lat: number | null
    delivery_lng: number | null
  } | null
  delivery_items: Array<{
    quantity: number
    order_items: {
      products: { name: string; is_returnable: boolean }
    } | null
  }>
  payment_method: PaymentMethod | null
  has_returnable_items: boolean
}

export type AssignDeliveryPayload = {
  driver_id: string
  route_plan_stop_id?: string
}

export type CompleteDeliveryPayload = {
  bottles_collected: number
  note?: string
}

export type UpdateDeliveryStatusPayload = {
  status: DeliveryStatus
}
