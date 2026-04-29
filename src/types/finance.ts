export type DocumentType = 'invoice' | 'receipt' | 'voucher' | 'delivery_note'

export type DocumentStatus = 'draft' | 'issued' | 'void'

export type Document = {
  id: string
  document_number: string
  type: DocumentType
  status: DocumentStatus
  amount: number
  issued_to_name: string
  issued_to_address: string | null
  tax_id: string | null
  agency_id: string | null
  profile_id: string | null
  order_id: string | null
  delivery_id: string | null
  template_id: string | null
  issued_at: string | null
  issued_by: string | null
  pdf_url: string | null
  void_reason: string | null
  voided_document_id: string | null
  reissue_reason: string | null
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
