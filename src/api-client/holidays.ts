import { get, post, patch, del } from './fetch'

export type Holiday = {
  id: string
  date: string
  end_date: string | null
  name: string
  is_recurring: boolean
  is_active: boolean
  source: string
  created_by: string | null
  created_at: string
}

export type CreateHolidayPayload = {
  date: string
  end_date?: string | null
  name: string
  is_recurring?: boolean
  is_active?: boolean
}

export type UpdateHolidayPayload = Partial<CreateHolidayPayload>

export type SyncGoogleResult = {
  imported: number
  skipped: number
  total: number
}

export type AddSundaysResult = {
  inserted: number
  skipped: number
  total: number
}

export type HolidaySettings = {
  delivery_sunday_off?: boolean
}

export const holidaysApi = {
  // Settings
  getSettings: (): Promise<HolidaySettings> =>
    get('/admin/holidays/settings'),

  updateSettings: (settings: HolidaySettings): Promise<{ updated: boolean }> =>
    patch('/admin/holidays/settings', settings),

  // CRUD
  list: (params?: { year?: number }): Promise<Holiday[]> =>
    get('/admin/holidays', params as Record<string, unknown>),

  create: (payload: CreateHolidayPayload): Promise<Holiday> =>
    post('/admin/holidays', payload),

  update: (id: string, payload: UpdateHolidayPayload): Promise<Holiday> =>
    patch(`/admin/holidays/${id}`, payload),

  toggleActive: (id: string, is_active: boolean): Promise<Holiday> =>
    patch(`/admin/holidays/${id}/toggle`, { is_active }),

  remove: (id: string): Promise<void> =>
    del(`/admin/holidays/${id}`),

  addSundays: (year: number): Promise<AddSundaysResult> =>
    post('/admin/holidays/add-sundays', { year }),

  syncGoogle: (year: number): Promise<SyncGoogleResult> =>
    post('/holidays-sync', { year }),
}
