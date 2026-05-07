// v1.40.0 — Admin Disbursement Menu — types

export type AgencyKind = 'faculty' | 'office' | 'external'

export type DisbursementKind = 'faculty' | 'office'

export type DisbursementStatus =
  | 'draft'
  | 'submitted'
  | 'faculty_approved'
  | 'office_head_approved'
  | 'office_director_approved'
  | 'treasury_review'
  | 'exported'
  | 'treasury_approved'
  | 'rejected_to_preparer'
  | 'treasury_rejected'

export type DisbursementEventType =
  | 'created'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'exported'
  | 'treasury_approved'
  | 'treasury_rejected'
  | 'debtor_cleared'
  | 'unlocked_to_draft'
  | 'creditor_code_changed'

/** Backend `app_role` enum (DB-side) — distinct from frontend AppRole in `./user` */
export type DbAppRole =
  | 'guest'
  | 'member_email'
  | 'member_cmu'
  | 'org_cmu'
  | 'staff_property'
  | 'admin_property'
  | 'executive'
  | 'admin_vendor'
  | 'delivery'
  | 'super_admin'

/** 7-segment 3D accounting code per office disbursement item */
export type AccountingCode7Seg = {
  fund_code?: string | null
  organization_code?: string | null
  work_plan_code?: string | null
  account_code?: string | null
  curriculum_code?: string | null
  budget_code?: string | null
  funding_source_code?: string | null
}

export type EligibleReceivable = {
  document_id: string
  document_number: string
  document_type: 'invoice' | 'receipt' | 'voucher'
  document_status: 'draft' | 'issued' | 'void'
  amount: number
  issued_at: string
  order_id: string
  order_number: string
  agency_id: string
  agency_name: string
  agency_kind: AgencyKind
}

export type DisbursementItem = AccountingCode7Seg & {
  id: string
  group_id: string
  order_id: string
  document_id: string | null
  amount: number
  accounting_code_combined: string | null
  description: string | null
  position: number
  created_at: string
  order?: { id: string; order_number: string; total_amount: number } | null
}

export type DisbursementGroup = {
  id: string
  group_number: string
  kind: DisbursementKind
  status: DisbursementStatus
  agency_id: string
  prepared_by: string
  prepared_at: string
  faculty_creditor_account_id: string | null
  faculty_creditor_snapshot: string | null
  treasury_export_batch_id: string | null
  cleared_at: string | null
  external_edoc_id: string | null
  total_amount: number
  item_count: number
  current_assignee_role: DbAppRole | null
  last_reject_reason: string | null
  rejected_from_group_id: string | null
  created_at: string
  updated_at: string
  agency?: { id: string; name: string; kind: AgencyKind } | null
  creditor?: { id: string; creditor_code: string; label: string | null } | null
  items?: DisbursementItem[]
}

export type DisbursementTimelineEvent = {
  id: string
  event_type: DisbursementEventType
  actor_user_id: string | null
  actor_name: string | null
  actor_role: DbAppRole | null
  from_status: DisbursementStatus | null
  to_status: DisbursementStatus | null
  item_count: number | null
  comment: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export type DisbursementExportBatch = {
  id: string
  batch_number: string
  exported_by: string
  exported_at: string
  kind: DisbursementKind
  group_count: number
  total_amount: number
  file_path: string | null
  filter_snapshot: Record<string, unknown> | null
  created_at: string
  exported_by_profile?: { id: string; full_name: string } | null
}

export type FacultyCreditorAccount = {
  id: string
  agency_id: string
  creditor_code: string
  label: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  agency?: { id: string; name: string; kind: AgencyKind } | null
}

// ─── Request payloads ─────────────────────────────────────────────────────

export type CreateDisbursementGroupItem = AccountingCode7Seg & {
  order_id: string
  document_id?: string | null
  amount: number
  description?: string | null
}

export type CreateDisbursementGroupPayload = {
  kind: DisbursementKind
  agency_id: string
  external_edoc_id?: string | null
  items: CreateDisbursementGroupItem[]
}

export type ApproveDisbursementPayload = {
  comment?: string | null
}

export type RejectDisbursementPayload = {
  reason: string
}

export type TreasuryExportPayload = {
  group_ids: string[]
  filter?: Record<string, unknown> | null
}

export type TreasuryExportResult = {
  batch: DisbursementExportBatch
  file_base64: string | null
}

export type FacultyCreditorUpsertPayload = {
  id?: string | null
  agency_id: string
  creditor_code: string
  label?: string | null
  is_active?: boolean
}

export type DisbursementGroupListFilters = {
  status?: DisbursementStatus
  kind?: DisbursementKind
  agency_id?: string
}

export type EligibleReceivablesFilters = {
  kind?: DisbursementKind
  agency_id?: string
  date_from?: string
  date_to?: string
}
