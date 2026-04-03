import { get, patch } from './fetch'

export interface SettingsMap {
  [key: string]: unknown
  daily_order_limits?: Record<string, number>
  delivery_sunday_off?: boolean
  order_cutoff_time?: string
  min_order_quantity?: number
  route_plan_cutoff_time?: string
  route_plan_auto_generate?: boolean
  route_plan_target_days_ahead?: number
  office_contact?: Record<string, string>
  registration_contact?: Record<string, string>
  receipt_config?: Record<string, unknown>
  overdue_block_enabled?: boolean
  overdue_block_threshold_days?: number
  overdue_block_roles?: string[]
  overdue_block_customer_groups?: string[]
}

export interface UpdateSettingPayload {
  key: string
  value: unknown
}

export const settingsApi = {
  /** Admin: อ่าน settings ทั้งหมด (requires admin_property / executive / staff_property) */
  getAdmin: (): Promise<SettingsMap> =>
    get('/admin/settings'),

  /** Admin: อัปเดต setting key เดียว */
  patchAdmin: (key: string, value: unknown): Promise<{ updated: boolean }> =>
    patch('/admin/settings', { key, value }),

  /** Vendor: อ่าน settings เฉพาะ vendor keys */
  getVendor: (): Promise<SettingsMap> =>
    get('/routes/settings'),

  /** Vendor: อัปเดต vendor setting key เดียว */
  patchVendor: (key: string, value: unknown): Promise<{ updated: boolean }> =>
    patch('/routes/settings', { key, value }),
}
