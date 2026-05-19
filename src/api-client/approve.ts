// v1.45 — Public magic-link approve endpoint client
// NO JWT auth required — token in URL path is the credential.
//
// Used by customer/ app at route /approve/:token.

import { ApiError } from './fetch'

let _baseUrl = ''
let _anonKey = ''

/**
 * Initialize the public approve client.
 * Call once at app startup. Anon key is sent in apikey header for Supabase Edge runtime.
 */
export function configureApproveClient(options: { baseUrl: string; anonKey: string }) {
  _baseUrl = options.baseUrl
  _anonKey = options.anonKey
}

function publicHeaders(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_anonKey) {
    h['apikey'] = _anonKey
    // Use anon key as bearer for unauthenticated public functions
    h['Authorization'] = `Bearer ${_anonKey}`
  }
  return h
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.error ?? body?.message ?? res.statusText
    throw new ApiError(res.status, message)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export type ApproveSummary = {
  group_number: string
  group_kind: 'faculty' | 'office'
  total_amount: number
  item_count: number
  agency_name: string
  customer_group_name: string | null
  my_step: number
  my_name: string
  my_position: string
  total_steps: number
  all_approvers: Array<{
    step: number
    name: string
    position: string
    status: string
    decided_at: string | null
  }>
  expires_at: string
}

export type DecisionPayload = {
  decision: 'approve' | 'reject'
  comment?: string | null
}

export type DecisionResult = {
  result: 'advanced' | 'fully_approved' | 'rejected'
  next_step?: number
  group_status?: string
}

export const approveApi = {
  /**
   * Fetch the approver-safe summary for a magic-link token.
   * Side effect: marks the approver row as 'opened' on first call.
   */
  getByToken: async (token: string): Promise<ApproveSummary> => {
    const res = await fetch(`${_baseUrl}/approve/${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: publicHeaders(),
    })
    return handle<ApproveSummary>(res)
  },

  /** Submit approve or reject decision. Single-use — server rejects replays with 410. */
  decide: async (token: string, payload: DecisionPayload): Promise<DecisionResult> => {
    const res = await fetch(`${_baseUrl}/approve/${encodeURIComponent(token)}/decide`, {
      method: 'POST',
      headers: publicHeaders(),
      body: JSON.stringify(payload),
    })
    return handle<DecisionResult>(res)
  },
}
