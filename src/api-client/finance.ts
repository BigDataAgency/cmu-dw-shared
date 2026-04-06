import { get, post } from './fetch'
import type { Document } from '../types/finance'

export type DocumentFilters = {
  customer_id?: string
  status?: string
}

export type ApproveVoidPayload = {
  void_request_id: string
  corrections?: Record<string, unknown>
}

export type RejectVoidPayload = {
  void_request_id: string
  rejection_reason: string
}

export type SettleDebtPayload = {
  agency_id: string
  amount: number
  reference?: string
}

export type SupportFeeFilters = {
  start_date?: string
  end_date?: string
  user_id?: string
  customer_group_id?: string
}

export type SupportFeeRow = {
  user_id: string
  user_name: string
  customer_group_code: string
  customer_group_name: string
  month: string
  order_count: number
  total_support_fee: number
  gross_sales: number
  total_cost: number
}

export const financeApi = {
  listInvoices: (filters?: DocumentFilters): Promise<Document[]> =>
    get('/finance/invoices', filters as Record<string, unknown>),

  listReceipts: (filters?: DocumentFilters): Promise<Document[]> =>
    get('/finance/receipts', filters as Record<string, unknown>),

  approveVoidReissue: (payload: ApproveVoidPayload): Promise<unknown> =>
    post('/finance/void-reissue/approve', payload),

  rejectVoidReissue: (payload: RejectVoidPayload): Promise<void> =>
    post('/finance/void-reissue/reject', payload),

  settleDebt: (payload: SettleDebtPayload): Promise<unknown> =>
    post('/finance/settle-debt', payload),

  getSupportFees: (filters?: SupportFeeFilters): Promise<SupportFeeRow[]> =>
    get('/finance/support-fees', filters as Record<string, unknown>),
}
