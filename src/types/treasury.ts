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
  // L3 — ความกว้างช่วงอายุหนี้ (setting receivable_overdue_threshold_days, default 30);
  // bucket แบ่งเป็น [0,T] / [T+1,2T] / [2T+1,3T] / >3T — UI ทำ label ตามค่านี้
  threshold_days: number
}

export type ReceivableDetailRow = {
  document_id: string
  document_number: string
  issued_at: string | null
  amount: number
  order_number: string | null
  payment_status: string
  age_days: number | null
  agency_name: string | null // L7 — มาจาก RPC แล้ว (เลิกให้หน้าพิมพ์ดึง list ทั้งก้อนหาชื่อ)
}

// ─── v1.58 — RPT-01,02,03,04,05,07,08,10 (real data, replacing hardcoded mock) ──
export type ReportDateRangeFilters = {
  date_from?: string
  date_to?: string
}

// RPT-01 รายงานการจัดส่งน้ำดื่ม
export type DeliveryReportSummary = {
  total_deliveries: number
  delivered_count: number
  failed_count: number
  rejected_count: number
  pending_count: number
  success_rate: number
}

export type DeliveryByDriverRow = {
  driver_id: string | null
  driver_name: string
  total_count: number
  delivered_count: number
  failed_count: number
  rejected_count: number
  success_rate: number
}

// RPT-02 รายงานสต็อกสินค้า
export type StockLevelRow = {
  product_id: string
  sku: string
  name: string
  category: string | null
  stock_qty: number
  low_stock_threshold: number | null
  is_low_stock: boolean
}

export type StockMovementRow = {
  product_id: string
  sku: string
  name: string
  stock_in: number
  stock_out: number
  adjust_qty: number
  return_qty: number
  internal_use_qty: number
  net_change: number
}

// RPT-03 รายงานใบสั่งซื้อและใบจัดส่งของ
export type OrdersReportSummary = {
  total_orders: number
  approved_count: number
  in_transit_count: number
  completed_count: number
  cancelled_count: number
  rejected_count: number
  total_amount: number
}

export type OrdersReportRow = {
  order_id: string
  order_number: string
  order_type: string
  status: string
  total_amount: number
  created_at: string
  delivery_note_number: string | null
  delivery_status: string | null
}

// RPT-04 รายงานชำระเงินและใบเสร็จ
export type PaymentsReportSummary = {
  collected_amount: number
  pending_amount: number
  invoiced_amount: number
  overdue_amount: number
  refunded_amount: number
  receipt_count: number
}

export type PaymentsByMethodRow = {
  payment_method: string
  order_count: number
  total_amount: number
}

// RPT-05 รายงานใบแจ้งหนี้และวางบิล
export type InvoiceReportRow = {
  document_id: string
  document_number: string
  status: 'draft' | 'issued' | 'void'
  issued_at: string | null
  issued_to_name: string
  agency_id: string | null
  agency_name: string | null
  amount: number
  order_number: string | null
  order_payment_status: string | null
}

export type InvoiceReportSummary = {
  invoice_count: number
  void_count: number
  total_amount: number
  paid_amount: number
  outstanding_amount: number
}

// RPT-07 รายงานหลักฐานการส่งน้ำดื่ม
export type DeliveryEvidenceRow = {
  delivery_id: string
  delivery_note_number: string
  order_number: string
  driver_name: string
  completed_at: string | null
  photo_count: number
  has_signature: boolean
  recipient_name: string | null
}

// RPT-08 รายงานสถานะการส่งน้ำสำเร็จ
export type DeliveryStatusSummaryRow = {
  status: string
  delivery_count: number
}

export type DeliveryStatusRow = {
  delivery_id: string
  delivery_note_number: string
  order_number: string
  status: string
  scheduled_date: string | null
  completed_at: string | null
  driver_name: string
  rejection_reason: string | null
}

// RPT-10 รายงานยอดขาย+คำนวณกำไร
export type SalesReportSummary = {
  order_count: number
  units_sold: number
  revenue: number
  cost: number
  profit: number
}

export type SalesByProductRow = {
  product_id: string
  sku: string
  name: string
  units_sold: number
  revenue: number
  cost: number
  profit: number
}

export type SalesDailyRow = {
  sale_date: string
  units_sold: number
  revenue: number
}

// ─── v1.58 bonus — Usage / Customers / Monthly (not TOR, requested explicitly) ──
export type UsageReportSummary = {
  login_count: number
  login_failed_count: number
  active_user_count: number
  action_count: number
}

export type UsageByUserRow = {
  profile_id: string
  full_name: string
  role: string | null
  last_login_at: string | null
  action_count: number
}

export type CustomersReportSummary = {
  total_customers: number
  new_customers: number
  repeat_customers: number
  avg_orders_per_customer: number
}

export type CustomersByAgencyRow = {
  agency_id: string
  agency_name: string
  order_count: number
  total_amount: number
  last_order_at: string | null
}

export type MonthlyOverview = {
  revenue: number
  order_count: number
  new_customers: number
  total_debt: number
}
