import { get, post, patch, del } from './fetch'
import type { Notification, SendNotificationPayload, PushSubscriptionPayload } from '../types/notification'

export const notificationsApi = {
  send: (payload: SendNotificationPayload): Promise<void> =>
    post('/notifications/send', payload),

  list: (): Promise<Notification[]> =>
    get('/notifications'),

  markRead: (id: string): Promise<void> =>
    patch(`/notifications/${id}/read`),

  subscribe: (payload: PushSubscriptionPayload): Promise<void> =>
    post('/notifications/subscribe', payload),

  unsubscribe: (endpoint: string): Promise<void> =>
    del(`/notifications/subscribe?endpoint=${encodeURIComponent(endpoint)}`),
}
