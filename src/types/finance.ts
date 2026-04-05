export type DocumentType = 'invoice' | 'receipt' | 'credit_note'

export type DocumentStatus = 'active' | 'voided' | 'pending_void'

export type Document = {
  id: string
  document_number: string
  type: DocumentType
  status: DocumentStatus
  order_id: string
  customer_id: string
  amount: number
  issued_at: string
  voided_at: string | null
  pdf_url: string | null
  pdf_encrypted: boolean
  created_at: string
}

export type Transaction = {
  id: string
  document_id: string
  amount: number
  payment_method: string
  reference: string | null
  created_at: string
}

export type VoidRequest = {
  id: string
  document_id: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requested_by: string
  reviewed_by: string | null
  created_at: string
}

export type ApproveVoidPayload = {
  void_request_id: string
  reissue: boolean
}

export type RejectVoidPayload = {
  void_request_id: string
  reason: string
}

export type SettleDebtPayload = {
  customer_id: string
  amount: number
  payment_method: string
  reference?: string
}
