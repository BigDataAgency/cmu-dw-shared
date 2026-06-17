// v1.56 Phase 2 — กองคลัง "การเงิน" api-client → finance Edge Function

import { get, post } from './fetch'
import type { PaginatedResponse } from '../types/pagination'
import type {
  QrPaymentRow,
  QrPaymentFilters,
  QrPaymentsSummary,
  QrMonthlySummary,
  QrSummaryStatus,
  BankStatement,
  BankStatementRow,
  CreateBankStatementPayload,
  ReceiptUsageRow,
  ReceiptUsageSummary,
  ReceiptUsageFilters,
  ReceivableRow,
  ReceivableDetailRow,
} from '../types/treasury'

type ExportResult = { file_base64: string | null; filename: string | null }

export const treasuryApi = {
  // ── P2-1/2 QR payments ─────────────────────────────────────────────────
  listQrPayments: (filters?: QrPaymentFilters): Promise<PaginatedResponse<QrPaymentRow>> =>
    get('/finance/qr/payments', filters as Record<string, unknown>),

  qrPaymentsSummary: (month: string): Promise<QrPaymentsSummary> =>
    get('/finance/qr/payments/summary', { month }),

  exportQrPayments: (filters?: QrPaymentFilters): Promise<ExportResult> =>
    post('/finance/qr/payments/export', filters ?? {}),

  // ── P2-4 QR monthly summary ────────────────────────────────────────────
  listQrSummaries: (
    filters?: { status?: QrSummaryStatus } & { page?: number; pageSize?: number },
  ): Promise<PaginatedResponse<QrMonthlySummary>> =>
    get('/finance/qr/summaries', filters as Record<string, unknown>),

  generateQrSummary: (month: string): Promise<QrMonthlySummary> =>
    post('/finance/qr/summaries', { month }),

  confirmQrSummary: (id: string): Promise<QrMonthlySummary> =>
    post(`/finance/qr/summaries/${id}/confirm`, {}),

  decideQrSummary: (id: string, payload: { approve: boolean; reason?: string }): Promise<QrMonthlySummary> =>
    post(`/finance/qr/summaries/${id}/decide`, payload),

  // ── P2-3 bank statements (schema/upload only — engine BLOCKED) ──────────
  listBankStatements: (
    filters?: { page?: number; pageSize?: number },
  ): Promise<PaginatedResponse<BankStatement>> =>
    get('/finance/qr/statements', filters as Record<string, unknown>),

  getBankStatement: (id: string): Promise<BankStatement & { rows: BankStatementRow[] }> =>
    get(`/finance/qr/statements/${id}`),

  createBankStatement: (payload: CreateBankStatementPayload): Promise<BankStatement> =>
    post('/finance/qr/statements', payload),

  // ── P2-6 receipt usage report ──────────────────────────────────────────
  receiptUsageReport: (filters?: ReceiptUsageFilters): Promise<ReceiptUsageRow[]> =>
    get('/finance/reports/receipt-usage', filters as Record<string, unknown>),

  receiptUsageSummary: (filters?: ReceiptUsageFilters): Promise<ReceiptUsageSummary> =>
    get('/finance/reports/receipt-usage/summary', filters as Record<string, unknown>),

  // ── P2-7 receivables ───────────────────────────────────────────────────
  receivablesReport: (asOf?: string): Promise<ReceivableRow[]> =>
    get('/finance/reports/receivables', asOf ? { as_of: asOf } : undefined),

  receivablesDetail: (agencyId: string): Promise<ReceivableDetailRow[]> =>
    get(`/finance/reports/receivables/${agencyId}/detail`),
}
