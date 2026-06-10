import { get } from "./fetch";

/** A single audit_logs row (append-only history — meeting item 6). */
export interface AuditLogRow {
  id: string;
  table_name: string;
  record_id: string;
  action: string;
  /** Before snapshot (JSON). null for inserts/system events. */
  old_data: unknown | null;
  /** After snapshot (JSON). */
  new_data: unknown | null;
  changed_by: string | null;
  ip_address: string | null;
  created_at: string;
  /** Server-enriched actor display name (changed_by → profiles.full_name). */
  actor_name: string | null;
  actor_email: string | null;
}

export interface AuditLogListParams {
  page?: number;
  pageSize?: number;
  /** Exact table_name match (e.g. "settings", "orders", "disbursement_groups"). */
  table_name?: string;
  /** table_name prefix match (e.g. "auth" for login/logout events). */
  table_prefix?: string;
  /** audit_action value (e.g. "UPDATE", "DISBURSEMENT_CANCEL", "LOGIN"). */
  action?: string;
  /** Filter by actor profile id. */
  changed_by?: string;
  /** YYYY-MM-DD inclusive. */
  date_from?: string;
  /** YYYY-MM-DD inclusive. */
  date_to?: string;
}

export interface AuditLogEnvelope {
  data: AuditLogRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const auditApi = {
  /**
   * Admin: list audit_logs (paginated, filterable, actor-enriched).
   * Requires admin_property / executive / super_admin (audit role added v1.54).
   */
  list: (params?: AuditLogListParams): Promise<AuditLogEnvelope> =>
    get("/admin/audit-logs", params as Record<string, unknown> | undefined),
};
