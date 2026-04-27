import { get, post, patch, del } from './fetch'
import type { Profile, UpdateProfilePayload, AddressPayload, Address, ExportedData } from '../types/user'
import type { Order } from '../types/order'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type UserFilters = PaginationParams & SearchParams & {
  role?: string
  status?: string
}

export const usersApi = {
  list: (filters?: UserFilters): Promise<PaginatedResponse<Profile>> =>
    get('/users', filters as Record<string, unknown>),

  getMe: (): Promise<Profile> =>
    get('/users/me'),

  updateMe: (payload: UpdateProfilePayload): Promise<Profile> =>
    patch('/users/me', payload),

  getPurchaseRights: (): Promise<{ can_purchase: boolean; reason?: string }> =>
    get('/users/me/purchase-rights'),

  getMyOrders: (): Promise<Order[]> =>
    get('/users/me/orders'),

  getAddresses: (): Promise<Address[]> =>
    get('/users/me/addresses'),

  addAddress: (payload: AddressPayload): Promise<Address> =>
    post('/users/me/addresses', payload),

  updateAddress: (id: string, payload: Partial<AddressPayload>): Promise<Address> =>
    patch(`/users/me/addresses/${id}`, payload),

  deleteAddress: (id: string): Promise<void> =>
    del(`/users/me/addresses/${id}`),

  setDefaultAddress: (id: string): Promise<void> =>
    patch(`/users/me/addresses/${id}/set-default`, {}),

  exportMyData: (): Promise<ExportedData> =>
    get('/users/me/export-data'),
}
