export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100
export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const

export type PageSize = typeof PAGE_SIZE_OPTIONS[number]

export type PaginationParams = {
  page?: number       // 1-based
  pageSize?: number   // clamped server-side to MAX_PAGE_SIZE
}

export type SearchParams = {
  q?: string          // free text search; per-resource fields chosen server-side
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function clampPageSize(n: number | undefined): number {
  if (!n || n < 1) return DEFAULT_PAGE_SIZE
  return Math.min(n, MAX_PAGE_SIZE)
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
