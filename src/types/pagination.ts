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

/**
 * "Today" in Asia/Bangkok (UTC+7) as YYYY-MM-DD.
 *
 * Must NOT use toISOString(), which is UTC: between 00:00 and 07:00 ICT that
 * returns YESTERDAY's date. Driver job lists query `scheduled_date = todayISO()`,
 * so a UTC value showed drivers an empty job list at the very start of a shift.
 * en-CA formatting yields YYYY-MM-DD directly.
 */
export function todayISO(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}
