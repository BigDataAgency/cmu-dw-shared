import { get, post } from './fetch'
import type { Document, Transaction, VoidRequest, ApproveVoidPayload, RejectVoidPayload, SettleDebtPayload } from '../types/finance'

export type DocumentFilters = {
  customer_id?: string
  type?: string
  status?: string
  from?: string
  to?: string
}

export const financeApi = {
  listInvoices: (filters?: DocumentFilters): Promise<Document[]> =>
    get('/finance/invoices', filters as Record<string, unknown>),

  listReceipts: (filters?: DocumentFilters): Promise<Document[]> =>
    get('/finance/receipts', filters as Record<string, unknown>),

  approveVoidReissue: (payload: ApproveVoidPayload): Promise<{ new_document?: Document }> =>
    post('/finance/void-reissue/approve', payload),

  rejectVoidReissue: (payload: RejectVoidPayload): Promise<void> =>
    post('/finance/void-reissue/reject', payload),

  settleDebt: (payload: SettleDebtPayload): Promise<Transaction> =>
    post('/finance/settle-debt', payload),
}
