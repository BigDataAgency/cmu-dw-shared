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
}
