let _baseUrl = ''
let _getToken: (() => Promise<string | null>) | null = null
let _anonKey = ''

export function configure(options: {
  baseUrl: string
  getToken: () => Promise<string | null>
  anonKey?: string
}) {
  _baseUrl = options.baseUrl
  _getToken = options.getToken
  _anonKey = options.anonKey ?? ''
}

async function buildHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_anonKey) headers['apikey'] = _anonKey
  const token = _getToken ? await _getToken() : null
  headers['Authorization'] = `Bearer ${token ?? _anonKey}`
  return headers
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, error.message ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const url = new URL(`${_baseUrl}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })
  }
  const res = await fetch(url.toString(), { headers: await buildHeaders() })
  return handleResponse<T>(res)
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: 'POST',
    headers: await buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: 'PATCH',
    headers: await buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function del<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${_baseUrl}${path}`, {
    method: 'DELETE',
    headers: await buildHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}
