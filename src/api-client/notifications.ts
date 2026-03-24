import { get, post, patch } from './fetch'
import type { Notification, SendNotificationPayload } from '../types/notification'

export const notificationsApi = {
  send: (payload: SendNotificationPayload): Promise<void> =>
    post('/notifications/send', payload),

  list: (): Promise<Notification[]> =>
    get('/notifications'),

  markRead: (id: string): Promise<void> =>
    patch(`/notifications/${id}/read`),
}
