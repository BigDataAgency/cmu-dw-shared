import { get, post, patch } from './fetch'
import type { Order } from '../types/order'

export type OrderSource = 'pos_walkin' | 'pos_delivery' | 'online' | 'phone' | 'agent'
export type PaymentMethod = 'cash' | 'transfer' | 'credit' | 'qr'

export type CreateOrderPayload = {
  items: { product_id: string; quantity: number }[]
  address: {
    address_id?: string
    address?: string
    lat?: number
    lng?: number
  }
  payment: PaymentMethod
  source?: OrderSource
  purchase_right_id?: string
  scheduled_date?: string
  scheduled_time_slot?: string
  delivery_notes?: string
  discount_amount?: number
}

export type CancelOrderPayload = {
  reason: string
}

export type ReturnBottlesPayload = {
  return_items: { order_item_id: string; return_qty: number }[]
  customer_id?: string
}

export type OrderFilters = {
  status?: string
}

export const ordersApi = {
  list: (filters?: OrderFilters): Promise<Order[]> =>
    get('/orders', filters as Record<string, unknown>),

  getById: (id: string): Promise<Order> =>
    get(`/orders/${id}`),

  create: (payload: CreateOrderPayload): Promise<Order> =>
    post('/orders', payload),

  cancel: (id: string, payload: CancelOrderPayload): Promise<void> =>
    patch(`/orders/${id}/cancel`, payload),

  returnBottles: (id: string, payload: ReturnBottlesPayload): Promise<unknown> =>
    post(`/orders/${id}/return-bottles`, payload),
}
