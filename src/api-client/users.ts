import { get, post, patch } from './fetch'
import type { Profile, UpdateProfilePayload, AddressPayload } from '../types/user'
import type { Order } from '../types/order'

export const usersApi = {
  getMe: (): Promise<Profile> =>
    get('/users/me'),

  updateMe: (payload: UpdateProfilePayload): Promise<Profile> =>
    patch('/users/me', payload),

  getPurchaseRights: (): Promise<{ can_purchase: boolean; reason?: string }> =>
    get('/users/me/purchase-rights'),

  addAddress: (payload: AddressPayload): Promise<{ id: string }> =>
    post('/users/me/addresses', payload),

  getMyOrders: (): Promise<Order[]> =>
    get('/users/me/orders'),
}
