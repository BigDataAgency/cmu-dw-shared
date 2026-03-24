export type RouteStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export type RoutePlanStop = {
  id: string
  route_plan_id: string
  sequence: number
  delivery_id: string
  address: string
  lat: number | null
  lng: number | null
  estimated_arrival: string | null
  completed_at: string | null
}

export type RoutePlan = {
  id: string
  driver_id: string
  date: string
  status: RouteStatus
  stops: RoutePlanStop[]
  created_at: string
  updated_at: string
}

export type GenerateRoutePayload = {
  date: string
  driver_ids?: string[]
}

export type ConfirmRoutePayload = {
  driver_id?: string
}

export type ReorderStopsPayload = {
  stop_ids: string[]
}

export type MoveStopPayload = {
  stop_id: string
  target_route_plan_id: string
}
