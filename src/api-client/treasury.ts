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
  ReportDateRangeFilters,
  DeliveryReportSummary,
  DeliveryByDriverRow,
  StockLevelRow,
  StockMovementRow,
  OrdersReportSummary,
  OrdersReportRow,
  PaymentsReportSummary,
  PaymentsByMethodRow,
  InvoiceReportRow,
  InvoiceReportSummary,
  DeliveryEvidenceRow,
  DeliveryStatusSummaryRow,
  DeliveryStatusRow,
  SalesReportSummary,
  SalesByProductRow,
  SalesDailyRow,
  UsageReportSummary,
  UsageByUserRow,
  CustomersReportSummary,
  CustomersByAgencyRow,
  MonthlyOverview,
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

  // ── v1.58 — RPT-01,02,03,04,05,07,08,10 (real data) ─────────────────────
  deliveryReportSummary: (filters?: ReportDateRangeFilters): Promise<DeliveryReportSummary> =>
    get('/finance/reports/delivery/summary', filters as Record<string, unknown>),
  deliveryReportByDriver: (filters?: ReportDateRangeFilters): Promise<DeliveryByDriverRow[]> =>
    get('/finance/reports/delivery/by-driver', filters as Record<string, unknown>),

  stockLevels: (): Promise<StockLevelRow[]> => get('/finance/reports/stock/levels'),
  stockMovements: (filters?: ReportDateRangeFilters): Promise<StockMovementRow[]> =>
    get('/finance/reports/stock/movements', filters as Record<string, unknown>),

  ordersReportSummary: (filters?: ReportDateRangeFilters): Promise<OrdersReportSummary> =>
    get('/finance/reports/orders/summary', filters as Record<string, unknown>),
  ordersReportList: (filters?: ReportDateRangeFilters): Promise<OrdersReportRow[]> =>
    get('/finance/reports/orders/list', filters as Record<string, unknown>),

  paymentsReportSummary: (filters?: ReportDateRangeFilters): Promise<PaymentsReportSummary> =>
    get('/finance/reports/payments/summary', filters as Record<string, unknown>),
  paymentsByMethod: (filters?: ReportDateRangeFilters): Promise<PaymentsByMethodRow[]> =>
    get('/finance/reports/payments/by-method', filters as Record<string, unknown>),

  invoicesReportList: (filters?: ReportDateRangeFilters): Promise<InvoiceReportRow[]> =>
    get('/finance/reports/invoices/list', filters as Record<string, unknown>),
  invoicesReportSummary: (filters?: ReportDateRangeFilters): Promise<InvoiceReportSummary> =>
    get('/finance/reports/invoices/summary', filters as Record<string, unknown>),

  deliveryEvidenceReport: (filters?: ReportDateRangeFilters): Promise<DeliveryEvidenceRow[]> =>
    get('/finance/reports/delivery-evidence', filters as Record<string, unknown>),

  deliveryStatusSummary: (filters?: ReportDateRangeFilters): Promise<DeliveryStatusSummaryRow[]> =>
    get('/finance/reports/delivery-status/summary', filters as Record<string, unknown>),
  deliveryStatusList: (filters?: ReportDateRangeFilters): Promise<DeliveryStatusRow[]> =>
    get('/finance/reports/delivery-status/list', filters as Record<string, unknown>),

  salesReportSummary: (filters?: ReportDateRangeFilters): Promise<SalesReportSummary> =>
    get('/finance/reports/sales/summary', filters as Record<string, unknown>),
  salesByProduct: (filters?: ReportDateRangeFilters): Promise<SalesByProductRow[]> =>
    get('/finance/reports/sales/by-product', filters as Record<string, unknown>),
  salesDaily: (filters?: ReportDateRangeFilters): Promise<SalesDailyRow[]> =>
    get('/finance/reports/sales/daily', filters as Record<string, unknown>),

  // ── v1.58 bonus — Usage / Customers / Monthly (not TOR) ─────────────────
  usageReportSummary: (filters?: ReportDateRangeFilters): Promise<UsageReportSummary> =>
    get('/finance/reports/usage/summary', filters as Record<string, unknown>),
  usageByUser: (filters?: ReportDateRangeFilters): Promise<UsageByUserRow[]> =>
    get('/finance/reports/usage/by-user', filters as Record<string, unknown>),

  customersReportSummary: (filters?: ReportDateRangeFilters): Promise<CustomersReportSummary> =>
    get('/finance/reports/customers/summary', filters as Record<string, unknown>),
  customersByAgency: (filters?: ReportDateRangeFilters): Promise<CustomersByAgencyRow[]> =>
    get('/finance/reports/customers/by-agency', filters as Record<string, unknown>),

  monthlyOverview: (filters?: ReportDateRangeFilters): Promise<MonthlyOverview> =>
    get('/finance/reports/monthly', filters as Record<string, unknown>),
}
