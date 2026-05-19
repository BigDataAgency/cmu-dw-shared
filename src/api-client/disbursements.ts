// v1.40.0 — Admin Disbursement Menu — api-client

import { get, post, del } from './fetch'
import type {
  CreateDisbursementGroupPayload,
  ApproveDisbursementPayload,
  RejectDisbursementPayload,
  TreasuryExportPayload,
  TreasuryExportResult,
  FacultyCreditorUpsertPayload,
  DisbursementGroupListFilters,
  EligibleReceivablesFilters,
  EligibleReceivable,
  DisbursementGroup,
  DisbursementTimelineEvent,
  DisbursementExportBatch,
  FacultyCreditorAccount,
  DisbursementApprovalConfig,
  DisbursementApprovalConfigUpsertPayload,
  DisbursementEmailOutboxRow,
  EmailOutboxStatus,
} from '../types/disbursement'
import type { PaginatedResponse, PaginationParams } from '../types/pagination'

export const disbursementsApi = {
  // ── Eligible receivables ───────────────────────────────────────────────
  listEligible: (filters?: EligibleReceivablesFilters): Promise<EligibleReceivable[]> =>
    get('/finance/disbursement/eligible', filters as Record<string, unknown>),

  // ── Groups ─────────────────────────────────────────────────────────────
  listGroups: (
    filters?: DisbursementGroupListFilters & PaginationParams,
  ): Promise<PaginatedResponse<DisbursementGroup>> =>
    get('/finance/disbursement/groups', filters as Record<string, unknown>),

  getGroup: (id: string): Promise<DisbursementGroup> =>
    get(`/finance/disbursement/groups/${id}`),

  getTimeline: (id: string): Promise<DisbursementTimelineEvent[]> =>
    get(`/finance/disbursement/groups/${id}/timeline`),

  createGroup: (payload: CreateDisbursementGroupPayload): Promise<DisbursementGroup> =>
    post('/finance/disbursement/groups', payload),

  submit: (id: string): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/submit`, {}),

  approve: (id: string, payload?: ApproveDisbursementPayload): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/approve`, payload ?? {}),

  reject: (id: string, payload: RejectDisbursementPayload): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/reject`, payload),

  unlock: (id: string): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/unlock`, {}),

  // ── Treasury ───────────────────────────────────────────────────────────
  treasuryExport: (payload: TreasuryExportPayload): Promise<TreasuryExportResult> =>
    post('/finance/disbursement/treasury/export', payload),

  finalApprove: (id: string): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/final-approve`, {}),

  finalReject: (id: string, payload: RejectDisbursementPayload): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/final-reject`, payload),

  treasuryHistory: (
    filters?: { kind?: 'faculty' | 'office' } & PaginationParams,
  ): Promise<PaginatedResponse<DisbursementExportBatch>> =>
    get('/finance/disbursement/treasury/history', filters as Record<string, unknown>),

  // ── Faculty creditor master (super_admin) ──────────────────────────────
  listFacultyCreditors: (): Promise<FacultyCreditorAccount[]> =>
    get('/finance/disbursement/faculty-creditors'),

  upsertFacultyCreditor: (payload: FacultyCreditorUpsertPayload): Promise<FacultyCreditorAccount> =>
    post('/finance/disbursement/faculty-creditors', payload),

  deleteFacultyCreditor: (id: string): Promise<{ deleted: boolean }> =>
    del(`/finance/disbursement/faculty-creditors/${id}`),

  // ── v1.41 — Approval Config + Email Outbox ─────────────────────────────
  listApprovalConfig: (agencyId?: string): Promise<DisbursementApprovalConfig[]> =>
    get('/finance/disbursement/approval-config', agencyId ? { agency_id: agencyId } : undefined),

  upsertApprovalConfig: (
    payload: DisbursementApprovalConfigUpsertPayload,
  ): Promise<DisbursementApprovalConfig> =>
    post('/finance/disbursement/approval-config', payload),

  deleteApprovalConfig: (id: string): Promise<{ deleted: boolean }> =>
    del(`/finance/disbursement/approval-config/${id}`),

  listEmailOutbox: (
    filters?: { status?: EmailOutboxStatus; limit?: number },
  ): Promise<DisbursementEmailOutboxRow[]> =>
    get('/finance/disbursement/email-outbox', filters as Record<string, unknown>),

  // ── v1.45 — Dynamic Per-Document Approval Chain ────────────────────────
  listPendingDeliveries: (filters: {
    customer_group_id: string
    agency_id?: string | null
  }): Promise<PendingDelivery[]> =>
    get('/finance/disbursement/pending-deliveries', filters as Record<string, unknown>),

  createGroupV2: (payload: CreateDisbursementGroupV2Payload): Promise<DisbursementGroup> =>
    post('/finance/disbursement/groups/v2', payload),

  submitV2: (id: string): Promise<DisbursementGroup> =>
    post(`/finance/disbursement/groups/${id}/submit/v2`, {}),

  delegateApprover: (
    id: string,
    payload: DelegateApproverPayload,
  ): Promise<{ new_approver_id: string }> =>
    post(`/finance/disbursement/groups/${id}/delegate-approver`, payload),

  previewPdf: (id: string): Promise<{ pdf_url: string; encrypted: boolean }> =>
    get(`/finance/disbursement/groups/${id}/preview-pdf`),
}

// v1.45 types — kept inline for now; promote to types/disbursement.ts if reused elsewhere
export type PendingDelivery = {
  delivery_id: string
  delivery_note_number: string
  delivered_at: string | null
  order_id: string
  order_number: string
  order_total_amount: number
  delivery_item_count: number
}

export type ApproverInput = {
  name: string
  position: string
  email: string
}

export type CreateDisbursementGroupV2Payload = {
  kind: 'faculty' | 'office'
  customer_group_id: string
  agency_id: string
  delivery_ids: string[]
  approvers: ApproverInput[]
  external_edoc_id?: string | null
}

export type DelegateApproverPayload = {
  step_number: number
  new_name: string
  new_position: string
  new_email: string
}

export type DisbursementApproverRow = {
  id: string
  group_id: string
  step_number: number
  approver_name: string
  approver_position: string
  approver_email: string
  approver_user_id: string | null
  delegated_from_id: string | null
  status: 'pending' | 'sent' | 'opened' | 'approved' | 'rejected' | 'expired' | 'delegated'
  magic_token_expires_at: string | null
  sent_at: string | null
  opened_at: string | null
  decided_at: string | null
  decision_comment: string | null
  created_at: string
}
