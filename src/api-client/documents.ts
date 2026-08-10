import { get, post, patch } from './fetch'
import type { Document, DocumentType } from '../types/finance'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type DocumentFilters = PaginationParams & SearchParams & {
  type?: string         // accepts comma-list e.g. 'receipt,voucher'
  status?: string       // accepts comma-list e.g. 'issued,void'
  date_from?: string
  date_to?: string
}

export type GeneratePdfPayload = {
  document_id: string
  type: DocumentType
  delivery_id?: string
}

export type BatchPrintResult = {
  urls: string[]
  errors: Array<{ id: string; message: string }>
  total: number
}

// v1.39.0: sticker pivoted to per-container — batch-print only supports delivery_note
export type BatchPrintDocType = 'delivery_note'

export const documentsApi = {
  list: (filters?: DocumentFilters): Promise<PaginatedResponse<Document>> =>
    get('/documents', filters as Record<string, unknown>),

  generatePdf: (payload: GeneratePdfPayload): Promise<{ url: string; encrypted: boolean }> =>
    post('/documents/pdf', payload),

  getById: (id: string): Promise<Document> =>
    get(`/documents/${id}`),

  batchPrint: (
    deliveryIds: string[],
    docType: BatchPrintDocType = 'delivery_note',
  ): Promise<BatchPrintResult> =>
    post('/documents/batch-print', { delivery_ids: deliveryIds, doc_type: docType }),

  // Voiding goes through the Edge Function so it gets a role check and an audit
  // row; admin used to UPDATE the table straight from the browser.
  void: (id: string, reason: string): Promise<{ success: boolean }> =>
    patch(`/documents/${id}/void`, { reason }),

  // v1.39.0: per-container TK label print (sticker pivot)
  printContainerLabels: (containerIds: string[]): Promise<BatchPrintResult> =>
    post('/documents/print-container-labels', { container_ids: containerIds }),
}
