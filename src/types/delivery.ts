export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

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
