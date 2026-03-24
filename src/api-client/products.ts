import { get, post, patch } from './fetch'
import type { Product, CreateProductPayload, UpdateProductPayload } from '../types/product'

export type ProductFilters = {
  category?: string
  is_active?: boolean
}

export const productsApi = {
  list: (filters?: ProductFilters): Promise<Product[]> =>
    get('/products', filters as Record<string, unknown>),

  getById: (id: string): Promise<Product> =>
    get(`/products/${id}`),

  create: (payload: CreateProductPayload): Promise<Product> =>
    post('/products', payload),

  update: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    patch(`/products/${id}`, payload),
}
