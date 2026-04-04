import { get, patch } from './fetch'
import type { NotificationChannel } from '../types/notification'

// ==================== Types ====================

export type RecipientStrategy = 'trigger_user' | 'role_based' | 'agency_members'

export interface NotificationConfig {
  id: string
  event_key: string
  notification_type: string
  enabled: boolean
  channels: NotificationChannel[]
  recipient_strategy: RecipientStrategy
  recipient_roles: string[]
  title_template: string
  body_template: string
  description: string | null
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface UpdateNotificationConfigPayload {
  enabled?: boolean
  channels?: NotificationChannel[]
  recipient_strategy?: RecipientStrategy
  recipient_roles?: string[]
  title_template?: string
  body_template?: string
}

// ==================== API ====================

export const notificationConfigsApi = {
  /** List all notification configs */
  list: () => get<NotificationConfig[]>('/notification-configs'),

  /** Get single notification config by ID */
  getById: (id: string) => get<NotificationConfig>(`/notification-configs/${id}`),

  /** Update notification config */
  update: (id: string, payload: UpdateNotificationConfigPayload) =>
    patch<NotificationConfig>(`/notification-configs/${id}`, payload),
}
