import { get, post, patch } from './fetch'

export type ContainerScanType =
  | 'load_truck'
  | 'deliver'
  | 'collect_return'
  | 'pos_return'
  | 'receive_depot'
  | 'audit'

export type BatchScanPayload = {
  qr_codes: string[]
  scan_type: ContainerScanType
  vehicle_id?: string | null
  delivery_id?: string | null
}

export type UpdateContainerStatusPayload = {
  new_status: string
  notes?: string | null
}

export const containersApi = {
  list: (): Promise<unknown[]> =>
    get('/containers'),

  getSummary: (): Promise<unknown[]> =>
    get('/containers/summary'),

  getScanHistory: (id: string): Promise<unknown[]> =>
    get(`/containers/${id}/scan-history`),

  scan: (payload: BatchScanPayload): Promise<unknown[]> =>
    post('/containers/scan', payload),

  updateStatus: (id: string, payload: UpdateContainerStatusPayload): Promise<void> =>
    patch(`/containers/${id}/status`, payload),
}
