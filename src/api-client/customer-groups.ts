import { get, post, patch } from './fetch'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type DocumentPreference = 'receipt' | 'voucher'
export type ApprovalRule =
  | 'auto_approve'
  | 'require_admin'
  | 'require_agency_admin'

export interface CustomerGroupRow {
  id: string
  name: string
  code: string
  description: string | null
  is_default: boolean | null
  is_active: boolean | null
  sort_order: number | null
  billing_name: string | null
  billing_address: string | null
  billing_tax_id: string | null
  document_preference: DocumentPreference | null
  parent_id: string | null
  is_prepay: boolean | null
  is_discount: boolean | null
  qr_discount_mode: 'baht_per_pack' | 'percent' | null
  qr_discount_value: number | null
  sale_map_allowed: boolean | null
  is_personal: boolean | null
  owner_user_id: string | null
  agency_id: string | null
  approval_rule: ApprovalRule | null
  allowed_delivery_days: number[] | null
  created_at?: string
  updated_at?: string
}

export interface CustomerGroupWithStats extends CustomerGroupRow {
  memberCount?: number
  productCount?: number
  // v1.48 — main-unit name resolved server-side; sub-units with duplicate names
  // (e.g. "งานพัสดุ" exists under 31 different main-units) need this to disambiguate.
  parent_name?: string | null
}

export interface CustomerGroupLite {
  id: string
  name: string
  code: string
  parent_id: string | null
  is_active: boolean | null
  is_personal: boolean | null
  is_default: boolean | null
  agency_id: string | null
  sort_order: number | null
}

export type CustomerGroupListParams = PaginationParams &
  SearchParams & {
    parent_id?: string | 'null'
    only_mains?: boolean
    include_personal?: boolean
    active_only?: boolean
    with_stats?: boolean
  }

export type CustomerGroupLiteParams = {
  include_personal?: boolean
  active_only?: boolean
}

export type CreateCustomerGroupPayload = {
  name: string
  code: string
  description?: string | null
  is_default?: boolean
  is_active?: boolean
  sort_order?: number
  parent_id?: string | null
  is_prepay?: boolean
  is_discount?: boolean
  qr_discount_mode?: 'baht_per_pack' | 'percent' | null
  qr_discount_value?: number | null
  sale_map_allowed?: boolean
  is_personal?: boolean
  owner_user_id?: string | null
  agency_id?: string | null
  approval_rule?: ApprovalRule
  allowed_delivery_days?: number[] | null
  billing_name?: string | null
  billing_address?: string | null
  billing_tax_id?: string | null
  document_preference?: DocumentPreference
}

export type UpdateCustomerGroupPayload = Partial<CreateCustomerGroupPayload>

export interface CustomerGroupProductRow {
  product_id: string
  name: string
  price: number
  default_price: number
}

export const customerGroupsApi = {
  list: (
    params?: CustomerGroupListParams,
  ): Promise<PaginatedResponse<CustomerGroupWithStats>> =>
    get('/customer-groups', params as Record<string, unknown>),

  lite: (
    params?: CustomerGroupLiteParams,
  ): Promise<{ rows: CustomerGroupLite[]; total: number }> =>
    get('/customer-groups/lite', params as Record<string, unknown>),

  getById: (id: string): Promise<CustomerGroupRow> =>
    get(`/customer-groups/${id}`),

  getProducts: (
    id: string,
  ): Promise<{ rows: CustomerGroupProductRow[] }> =>
    get(`/customer-groups/${id}/products`),

  create: (payload: CreateCustomerGroupPayload): Promise<CustomerGroupRow> =>
    post('/customer-groups', payload),

  update: (
    id: string,
    payload: UpdateCustomerGroupPayload,
  ): Promise<CustomerGroupRow> => patch(`/customer-groups/${id}`, payload),
}

// Back-compat alias for callers that import `CustomerGroup` (entity).
// New code should use `CustomerGroupRow`.
export type { CustomerGroupRow as CustomerGroupEntity }
