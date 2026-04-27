import { get, post, patch } from './fetch'
import type { Product, CreateProductPayload, UpdateProductPayload } from '../types/product'
import type { PaginationParams, SearchParams, PaginatedResponse } from '../types/pagination'

export type ProductFilters = PaginationParams & SearchParams & {
  category?: string
  is_active?: boolean
}

export type UpdateStockPayload = {
  qty: number
  type: 'stock_in' | 'stock_out' | 'adjust' | 'return'
  notes?: string
}

export const productsApi = {
  list: (filters?: ProductFilters): Promise<PaginatedResponse<Product>> =>
    get('/products', filters as Record<string, unknown>),

  getById: (id: string): Promise<Product> =>
    get(`/products/${id}`),

  create: (payload: CreateProductPayload): Promise<Product> =>
    post('/products', payload),

  update: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    patch(`/products/${id}`, payload),

  updateStock: (id: string, payload: UpdateStockPayload): Promise<void> =>
    patch(`/products/${id}/stock`, payload),
}
