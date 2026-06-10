import { get, post, patch, del } from './fetch'
import type { DbAppRole } from '../types/disbursement'

// Re-export under a non-colliding name to keep the public shared surface clean
// (types/user.ts already exports a different (legacy) `AppRole`).
export type AdminAppRole = DbAppRole

export type AccountStatus = 'pending_approval' | 'active' | 'suspended'

export interface UpdateStatusPayload {
  status: AccountStatus
  reason?: string
}

export interface AssignPurchaseRightPayload {
  customer_group_id: string
  billing_name?: string
  billing_address?: string
  billing_tax_id?: string
  is_default?: boolean
}

export interface UserPurchaseRightRow {
  right_id: string
  group_id: string
  group_name: string
  group_code: string
  billing_name: string | null
  billing_address: string | null
  billing_tax_id: string | null
  document_preference: string | null
  is_default: boolean
}

export interface MapUserPayload {
  approve?: boolean
  roles?: AdminAppRole[]
  rights?: AssignPurchaseRightPayload[]
  /**
   * v1.43.0 Option G — pick a customer_group whose agency_id will be copied to
   * profiles.agency_id (disbursement scope). Pass `null` to clear. Omit to leave
   * the existing primary employer untouched.
   */
  primary_employer_group_id?: string | null
  /**
   * v1.50 — "เปิดการใช้งานสั่ง order ส่วนบุคคล". true → create/keep a per-user personal
   * customer_group (standalone, parent_id NULL) + assign right. false → revoke + deactivate.
   * Omit to leave personal ordering untouched. Faculty/agency rights are managed
   * separately via the `rights[]` cascade — personal vs agency are independent.
   */
  personal_order_enabled?: boolean
}

export interface MapUserResult {
  user_id: string
  approved: boolean
  roles: AdminAppRole[]
  rights: string[]
  agency_id?: string | null
  personal_group_id?: string | null
}

export interface AdminUpdateProfilePayload {
  full_name?: string
  phone_number?: string
  email?: string
  avatar_url?: string
  billing_name?: string
  billing_address?: string
  billing_tax_id?: string
}

export interface CreateExternalUserPayload {
  email: string
  full_name?: string
  /** Defaults to 'audit' in the UI flow; any non-super_admin role accepted. */
  role: AdminAppRole
  /** Optional explicit password; omitted → server generates a temp password. */
  password?: string
}

export interface CreateExternalUserResult {
  user_id: string
  email: string
  /** Temporary password — shown ONCE to the admin, never stored client-side. */
  password: string
}

export const usersAdminApi = {
  /**
   * v1.54 — manual user creation for accounts without CMU OAuth
   * (e.g. external auditors / สตง.). Server forces a password change on
   * first login via user_metadata.force_password_change.
   */
  createExternalUser: (payload: CreateExternalUserPayload) =>
    post<CreateExternalUserResult>('/admin/users', payload),

  // v1.43 — admin edits another user's profile fields
  updateProfile: (userId: string, payload: AdminUpdateProfilePayload) =>
    patch<{ user_id: string } & AdminUpdateProfilePayload>(
      `/users/admin/${userId}/profile`,
      payload,
    ),

  updateStatus: (userId: string, payload: UpdateStatusPayload) =>
    patch<{ user_id: string; account_status: AccountStatus }>(
      `/users/admin/${userId}/status`,
      payload,
    ),

  listRoles: (userId: string) =>
    get<{ role: AdminAppRole; created_at: string }[]>(`/users/admin/${userId}/roles`),

  assignRole: (userId: string, role: AdminAppRole) =>
    post<{ user_id: string; role: AdminAppRole }>(`/users/admin/${userId}/roles`, { role }),

  revokeRole: (userId: string, role: AdminAppRole) =>
    del<void>(`/users/admin/${userId}/roles/${role}`),

  listPurchaseRights: (userId: string) =>
    get<UserPurchaseRightRow[]>(`/users/admin/${userId}/purchase-rights`),

  assignPurchaseRight: (userId: string, payload: AssignPurchaseRightPayload) =>
    post<{ id: string }>(`/users/admin/${userId}/purchase-rights`, payload),

  revokePurchaseRight: (userId: string, customerGroupId: string) =>
    del<void>(`/users/admin/${userId}/purchase-rights/${customerGroupId}`),

  mapUser: (userId: string, payload: MapUserPayload) =>
    post<MapUserResult>(`/users/admin/${userId}/map`, payload),
}
