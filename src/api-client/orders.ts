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
  /** Admin proxy: when set, order is created on behalf of this user. Caller must have staff_property/admin_property/super_admin role. */
  target_user_id?: string
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

  // v1.46 — Credit notes (manual ใบลดหนี้ after billing)
  listCreditNotes: (id: string): Promise<OrderCreditNote[]> =>
    get(`/orders/${id}/credit-notes`),

  createCreditNote: (id: string, payload: CreateCreditNotePayload): Promise<OrderCreditNote> =>
    post(`/orders/${id}/credit-notes`, payload),
}

// v1.46 — types kept inline; promote to types/order.ts if reused elsewhere
export type CreateCreditNotePayload = {
  reason: string
  external_ref?: string | null
  amount: number
}

export type OrderCreditNote = {
  id: string
  order_id: string
  disbursement_group_id: string | null
  reason: string
  external_ref: string | null
  amount: number
  created_by: string
  created_at: string
}
