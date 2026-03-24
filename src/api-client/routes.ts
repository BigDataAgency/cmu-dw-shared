import { get, post, patch } from './fetch'
import type { RoutePlan, GenerateRoutePayload, ConfirmRoutePayload, ReorderStopsPayload, MoveStopPayload } from '../types/route'

export type RouteFilters = {
  driver_id?: string
  date?: string
  status?: string
}

export const routesApi = {
  list: (filters?: RouteFilters): Promise<RoutePlan[]> =>
    get('/routes', filters as Record<string, unknown>),

  getById: (id: string): Promise<RoutePlan> =>
    get(`/routes/${id}`),

  generate: (payload: GenerateRoutePayload): Promise<RoutePlan[]> =>
    post('/routes/generate', payload),

  confirm: (id: string, payload?: ConfirmRoutePayload): Promise<void> =>
    post(`/routes/${id}/confirm`, payload),

  reorderStops: (id: string, payload: ReorderStopsPayload): Promise<void> =>
    patch(`/routes/${id}/stops/reorder`, payload),

  moveStop: (id: string, payload: MoveStopPayload): Promise<void> =>
    post(`/routes/${id}/stops/move`, payload),
}
