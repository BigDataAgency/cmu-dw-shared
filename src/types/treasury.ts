// v1.56 Phase 2 — กองคลัง "การเงิน" types (QR / สรุปยอด / กระทบยอด / รายงาน)

import type { PaginationParams } from './pagination'

// ─── P2-1/2 QR payments (อ่านจาก orders) ─────────────────────────────────
export type QrPaymentStatusFilter = 'paid' | 'pending'

export type QrPaymentRow = {
  id: string
  order_number: string
  total_amount: number
  payment_status: string
  paid_at: string | null
  qr_ref1: string | null
  qr_ref2: string | null
  qr_expires_at: string | null
  source: string | null
  created_at: string
  updated_at: string
  customer_group_id: string | null
  agency_id: string | null
  agency?: { name: string } | null
}

export type QrPaymentFilters = {
  status?: QrPaymentStatusFilter
  date_from?: string
  date_to?: string
  source?: string
  q?: string
} & PaginationParams

export type QrPaymentsSummary = {
  month: string
  order_count: number
  total_amount: number
}

// ─── P2-4 QR monthly summary + cross-role forward ────────────────────────
export type QrSummaryStatus =
  | 'finance_review'
  | 'finance_confirmed'
  | 'accounting_approved'
  | 'accounting_rejected'

export type QrMonthlySummary = {
  id: string
  month: string
  order_count: number
  total_amount: number
  snapshot: Record<string, unknown> | null
  status: QrSummaryStatus
  finance_confirmed_by: string | null
  finance_confirmed_at: string | null
  accounting_decided_by: string | null
  accounting_decided_at: string | null
  reject_reason: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// ─── P2-3 bank statement reconcile (schema only — engine BLOCKED) ─────────
export type BankStatementStatus = 'uploaded' | 'parsed' | 'matched' | 'archived'
export type BankRowMatchStatus = 'unmatched' | 'auto_matched' | 'manual_matched' | 'ignored'

export type BankStatement = {
  id: string
  filename: string
  file_path: string
  uploaded_by: string | null
  uploaded_at: string
  period_from: string | null
  period_to: string | null
  row_count: number
  status: BankStatementStatus
  column_mapping: Record<string, unknown> | null
  notes: string | null
}

export type BankStatementRow = {
  id: string
  statement_id: string
  row_number: number
  raw: Record<string, unknown>
  txn_date: string | null
  amount: number | null
  ref1: string | null
  ref2: string | null
  matched_order_id: string | null
  match_status: BankRowMatchStatus
}

export type CreateBankStatementPayload = {
  filename: string
  file_path: string
  period_from?: string | null
  period_to?: string | null
  notes?: string | null
}

// ─── P2-6 receipt usage report ───────────────────────────────────────────
export type ReceiptUsageRow = {
  document_id: string
  document_number: string
  type: 'receipt' | 'voucher'
  status: 'draft' | 'issued' | 'void'
  issued_at: string | null
  issued_to_name: string
  agency_id: string | null
  agency_name: string | null
  amount: number
  void_reason: string | null
}

export type ReceiptUsageSummary = {
  issued_count: number
  void_count: number
  total_amount: number
}

export type ReceiptUsageFilters = {
  date_from?: string
  date_to?: string
  type?: 'receipt' | 'voucher'
}

// ─── P2-7 receivables (per-agency + detail) ──────────────────────────────
export type ReceivableRow = {
  agency_id: string
  agency_name: string
  current_debt: number
  open_doc_count: number
  oldest_issued_at: string | null
  bucket_0_30: number
  bucket_31_60: number
  bucket_61_90: number
  bucket_90_plus: number
}

export type ReceivableDetailRow = {
  document_id: string
  document_number: string
  issued_at: string | null
  amount: number
  order_number: string | null
  payment_status: string
  age_days: number | null
}
