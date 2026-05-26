import { get, patch, del } from './fetch'
import type { PaymentMethod } from '../types/order'

export type { PaymentMethod } from '../types/order'

export interface PaymentMethodConfig {
  payment_method: PaymentMethod
  is_enabled: boolean
}

export interface UserPaymentMethodsResponse {
  methods: PaymentMethod[]
}

export interface AdminUserPaymentResponse {
  user_id: string
  agency_id: string | null
  cmu_employee_id: string | null
  config: PaymentMethodConfig[]
  resolved: PaymentMethod[]
}

export interface AgencyPaymentResponse {
  agency_id: string
  config: PaymentMethodConfig[]
}

export const paymentMethodsApi = {
  /** Customer: ดูว่าตัวเองใช้วิธีชำระอะไรได้ (v1.48: ตาม context/customer_group ที่เลือก) */
  getMyMethods: (customerGroupId?: string): Promise<UserPaymentMethodsResponse> =>
    get('/users/me/payment-methods', customerGroupId ? { customer_group_id: customerGroupId } : undefined),

  /** Admin: ดู config + resolved methods ของ user */
  getForUser: (userId: string): Promise<AdminUserPaymentResponse> =>
    get(`/admin/users/${userId}/payment-methods`),

  /** Admin: set user payment method overrides */
  setForUser: (userId: string, methods: PaymentMethodConfig[]): Promise<{ updated: boolean }> =>
    patch(`/admin/users/${userId}/payment-methods`, { methods }),

  /** Admin: clear user overrides (fallback to agency/default) */
  clearForUser: (userId: string): Promise<{ cleared: boolean }> =>
    del(`/admin/users/${userId}/payment-methods`),

  /** Admin: ดู agency payment config */
  getForAgency: (agencyId: string): Promise<AgencyPaymentResponse> =>
    get(`/admin/agencies/${agencyId}/payment-methods`),

  /** Admin: set agency payment method config */
  setForAgency: (agencyId: string, methods: PaymentMethodConfig[]): Promise<{ updated: boolean }> =>
    patch(`/admin/agencies/${agencyId}/payment-methods`, { methods }),

  /** v1.48 Admin: ดู payment config ของ customer_group (context-bound) */
  getForCustomerGroup: (groupId: string): Promise<{ customer_group_id: string; config: PaymentMethodConfig[] }> =>
    get(`/admin/customer-groups/${groupId}/payment-methods`),

  /** v1.48 Admin: set payment config ของ customer_group (e.g. คณะ → invoice_billing only) */
  setForCustomerGroup: (groupId: string, methods: PaymentMethodConfig[]): Promise<{ updated: boolean }> =>
    patch(`/admin/customer-groups/${groupId}/payment-methods`, { methods }),
}
