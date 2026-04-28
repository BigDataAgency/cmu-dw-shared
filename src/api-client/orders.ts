import { get, post, patch } from './fetch'
import type { Order } from '../types/order'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type OrderSource = 'pos_walkin' | 'pos_delivery' | 'online' | 'phone' | 'agent'
export type PaymentMethod = 'cash' | 'qr_promptpay' | 'payroll_deduction' | 'invoice_billing'
export type DeliveryType = 'delivery' | 'pickup'

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
  delivery_type?: DeliveryType
}

export type CancelOrderPayload = {
  reason: string
}

export type ReturnBottlesPayload = {
  return_items: { order_item_id: string; return_qty: number }[]
  customer_id?: string
}

export type OrderFilters = PaginationParams & SearchParams & {
  status?: string
  source?: string
  date_from?: string
  date_to?: string
}

export type UpdateOrderStatusPayload = {
  status: string
  note?: string
}

export const ordersApi = {
  list: (filters?: OrderFilters): Promise<PaginatedResponse<Order>> =>
    get('/orders', filters as Record<string, unknown>),

  getById: (id: string): Promise<Order> =>
    get(`/orders/${id}`),

  create: (payload: CreateOrderPayload): Promise<Order> =>
    post('/orders', payload),

  cancel: (id: string, payload: CancelOrderPayload): Promise<void> =>
    patch(`/orders/${id}/cancel`, payload),

  updateStatus: (id: string, payload: UpdateOrderStatusPayload): Promise<unknown> =>
    patch(`/orders/${id}/status`, payload),

  returnBottles: (id: string, payload: ReturnBottlesPayload): Promise<unknown> =>
    post(`/orders/${id}/return-bottles`, payload),
}
