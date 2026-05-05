import { get, post, patch } from './fetch'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ContainerFilters = PaginationParams & SearchParams & {
  status?: string
  product_id?: string
}

export type ContainerScanType =
  | 'load_truck'
  | 'deliver'
  | 'collect_return'
  | 'pos_return'
  | 'receive_depot'
  | 'audit'
  | 'unload_truck'

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

// v1.15.0 req-03: Driver collect — customer with containers
export type DriverCollectCustomer = {
  customer_id: string
  customer_name: string
  agency_name: string | null
  container_count: number
}

// v1.15.0 req-04: Unload at depot
export type UnloadPayload = {
  qr_codes: string[]
  vehicle_id?: string | null
}

export type UnloadResult = {
  container_id: string
  qr_code: string
  status_before: string
  status_after: string
  scan_type_used: string
  result_flag: string // 'ok' | 'already_at_depot' | 'auto_registered' | 'unexpected_status'
}

// v1.15.0 req-02: Vendor Gen QR batch
export type CreateContainersBatchPayload = {
  count: number        // 1–100
  product_id?: string | null
  notes?: string | null
}

export type ContainerBatchResult = {
  container_id: string
  qr_code: string
  product_id: string | null
  status: string
  created_at: string
}

// v1.15.0: QR label data
export type ContainerQrData = {
  container_id: string
  qr_code: string
  product_name: string | null
  product_sku: string | null
  status: string
  registered_at: string
}

// v1.39.0 REQ-04: Outstanding containers (status=with_customer)
export type OutstandingContainer = {
  container_id: string
  qr_code: string
  product_name: string | null
  current_customer_id: string | null
  customer_name: string | null
  agency_name: string | null
  current_driver_id: string | null
  driver_name: string | null
  last_scanned_at: string | null
  days_outstanding: number
}

// ── QR Validation (BL-01) ─────────────────────────────────────────────────────

export const CONTAINER_QR_PATTERN = /^TK-\d{5}$/
export const isValidContainerQR = (qr: string): boolean =>
  CONTAINER_QR_PATTERN.test(qr)

// ── API Client ────────────────────────────────────────────────────────────────

export const containersApi = {
  list: (filters?: ContainerFilters): Promise<PaginatedResponse<unknown>> =>
    get('/containers', filters as Record<string, unknown>),

  getSummary: (): Promise<unknown[]> =>
    get('/containers/summary'),

  getScanHistory: (id: string): Promise<unknown[]> =>
    get(`/containers/${id}/scan-history`),

  scan: (payload: BatchScanPayload): Promise<unknown[]> =>
    post('/containers/scan', payload),

  updateStatus: (id: string, payload: UpdateContainerStatusPayload): Promise<void> =>
    patch(`/containers/${id}/status`, payload),

  // v1.15.0 req-02: Vendor Gen QR batch
  genQr: (payload: CreateContainersBatchPayload): Promise<ContainerBatchResult[]> =>
    post('/containers/gen-qr', payload),

  // v1.15.0 req-03: Driver collect — รายชื่อลูกค้าที่มีถัง with_customer
  getCollectCustomers: (): Promise<DriverCollectCustomer[]> =>
    get('/containers/collect-customers'),

  // v1.15.0 req-04: Unload at depot (auto-detect ON_TRUCK/RETURNED_EMPTY → AT_DEPOT)
  unload: (payload: UnloadPayload): Promise<UnloadResult[]> =>
    post('/containers/unload', payload),

  // v1.15.0: ดึงข้อมูล QR ต่อถัง (render QR label)
  getQrData: (id: string): Promise<ContainerQrData> =>
    get(`/containers/${id}/qr-data`),

  // v1.39.0 REQ-04: ถังค้างกับลูกค้า (status=with_customer)
  getOutstanding: (daysMin?: number): Promise<OutstandingContainer[]> =>
    get('/containers/outstanding', daysMin !== undefined ? { days_min: daysMin } : undefined),
}
