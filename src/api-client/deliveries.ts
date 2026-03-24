import { get, post, patch } from './fetch'
import type { Delivery } from '../types/delivery'

export type AssignDeliveryPayload = {
  order_id: string
  driver_id?: string | null
  vehicle_id?: string | null
  items?: { order_item_id: string; quantity: number }[]
  scheduled_date?: string
}

export type AssignDriverPayload = {
  driver_id: string | null
  vehicle_id: string | null
}

export type UpdateDeliveredQtyPayload = {
  delivered_qty: number
}

export type CompleteDeliveryPayload = {
  photos?: string[]
  signature?: string
  qr_data?: Record<string, unknown>
}

export type CancelDeliveryPayload = {
  reason: string
}

export type UpdateDeliveryStatusPayload = {
  status: 'pending_assign' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'rejected' | 'force_delivered' | 'cancelled'
  metadata?: Record<string, unknown>
}

export type DeliveryFilters = {
  driver_id?: string
  status?: string
  date?: string
}

export const deliveriesApi = {
  list: (filters?: DeliveryFilters): Promise<Delivery[]> =>
    get('/deliveries', filters as Record<string, unknown>),

  getById: (id: string): Promise<Delivery> =>
    get(`/deliveries/${id}`),

  assign: (payload: AssignDeliveryPayload): Promise<string> =>
    post('/deliveries', payload),

  updateStatus: (id: string, payload: UpdateDeliveryStatusPayload): Promise<void> =>
    patch(`/deliveries/${id}/status`, payload),

  complete: (id: string, payload?: CompleteDeliveryPayload): Promise<void> =>
    patch(`/deliveries/${id}/complete`, payload ?? {}),

  cancel: (id: string, payload: CancelDeliveryPayload): Promise<void> =>
    patch(`/deliveries/${id}/cancel`, payload),

  updateItemQty: (itemId: string, payload: UpdateDeliveredQtyPayload): Promise<void> =>
    patch(`/deliveries/items/${itemId}/qty`, payload),

  assignDriver: (id: string, payload: AssignDriverPayload): Promise<void> =>
    patch(`/deliveries/${id}/assign`, payload),
}
