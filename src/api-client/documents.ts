import { get, post } from './fetch'
import type { Document } from '../types/finance'

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
  generatePdf: (payload: GeneratePdfPayload): Promise<{ url: string; encrypted: boolean }> =>
    post('/documents/pdf', payload),

  getById: (id: string): Promise<Document> =>
    get(`/documents/${id}`),

  batchPrint: (deliveryIds: string[]): Promise<BatchPrintResult> =>
    post('/documents/batch-print', { delivery_ids: deliveryIds }),
}
