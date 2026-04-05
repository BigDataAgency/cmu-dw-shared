import { get, post } from './fetch'
import type { Document } from '../types/finance'

export type GeneratePdfPayload = {
  document_id: string
  type: 'invoice' | 'receipt'
}

export const documentsApi = {
  generatePdf: (payload: GeneratePdfPayload): Promise<{ url: string; encrypted: boolean }> =>
    post('/documents/pdf', payload),

  getById: (id: string): Promise<Document> =>
    get(`/documents/${id}`),
}
