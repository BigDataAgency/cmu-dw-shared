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
}

export interface MapUserResult {
  user_id: string
  approved: boolean
  roles: AdminAppRole[]
  rights: string[]
}

export const usersAdminApi = {
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
