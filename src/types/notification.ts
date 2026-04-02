export type NotificationChannel = 'push' | 'email' | 'in_app'

export type NotificationType =
  | 'order_update'
  | 'delivery_update'
  | 'payment_reminder'
  | 'subscription_reminder'
  | 'route_plan_ready'
  | 'system'

export type Notification = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  data: Record<string, unknown> | null
  is_read: boolean
  created_at: string
}

export type SendNotificationPayload = {
  user_id: string
  type: NotificationType
  title: string
  body: string
  channels?: NotificationChannel[]
  data?: Record<string, unknown>
}

export type MarkReadPayload = {
  notification_id: string
}

export type PushSubscriptionPayload = {
  endpoint: string
  keys: { p256dh: string; auth: string }
}
