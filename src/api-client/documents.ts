import { get, post } from './fetch'
import type { Document } from '../types/finance'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type DocumentFilters = PaginationParams & SearchParams & {
  type?: string         // accepts comma-list e.g. 'receipt,voucher'
  date_from?: string
  date_to?: string
}

export type GeneratePdfPayload = {
  document_id: string
  type: 'invoice' | 'receipt' | 'voucher' | 'delivery_note'
  delivery_id?: string
}

export type BatchPrintResult = {
  urls: string[]
  errors: Array<{ id: string; message: string }>
  total: number
}

export const documentsApi = {
  list: (filters?: DocumentFilters): Promise<PaginatedResponse<Document>> =>
    get('/documents', filters as Record<string, unknown>),

  generatePdf: (payload: GeneratePdfPayload): Promise<{ url: string; encrypted: boolean }> =>
    post('/documents/pdf', payload),

  getById: (id: string): Promise<Document> =>
    get(`/documents/${id}`),

  batchPrint: (deliveryIds: string[]): Promise<BatchPrintResult> =>
    post('/documents/batch-print', { delivery_ids: deliveryIds }),
}
