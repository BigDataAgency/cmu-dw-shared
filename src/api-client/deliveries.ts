import { get, post, patch } from './fetch'
import type { Delivery, AssignDeliveryPayload, CompleteDeliveryPayload, UpdateDeliveryStatusPayload } from '../types/delivery'

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

  assign: (payload: AssignDeliveryPayload): Promise<Delivery> =>
    post('/deliveries', payload),

  updateStatus: (id: string, payload: UpdateDeliveryStatusPayload): Promise<void> =>
    patch(`/deliveries/${id}/status`, payload),

  complete: (id: string, payload: CompleteDeliveryPayload): Promise<void> =>
    patch(`/deliveries/${id}/complete`, payload),

  cancel: (id: string): Promise<void> =>
    patch(`/deliveries/${id}/cancel`),
}
