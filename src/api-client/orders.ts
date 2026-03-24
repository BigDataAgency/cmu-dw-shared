import { get, post, patch } from './fetch'
import type { Order, CreateOrderPayload, CancelOrderPayload, ReturnBottlesPayload } from '../types/order'

export type OrderFilters = {
  status?: string
  from?: string
  to?: string
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

  returnBottles: (id: string, payload: ReturnBottlesPayload): Promise<void> =>
    post(`/orders/${id}/return-bottles`, payload),
}
