export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app'

export type NotificationType =
  | 'order_confirmed'
  | 'order_delivering'
  | 'order_delivered'
  | 'order_cancelled'
  | 'payment_due'
  | 'route_assigned'

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
  channels?: NotificationChannel[]
  data?: Record<string, unknown>
}

export type MarkReadPayload = {
  notification_id: string
}
