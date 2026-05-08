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
}
