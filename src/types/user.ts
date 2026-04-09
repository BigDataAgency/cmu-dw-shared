export type AppRole = 'customer' | 'driver' | 'vendor' | 'pos' | 'admin' | 'superadmin'

export type UserRole = {
  role: AppRole
  is_active: boolean
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  billing_name: string | null
  billing_address: string | null
  billing_tax_id: string | null
  roles: UserRole[]
  created_at: string
  updated_at: string
}

export type UpdateProfilePayload = {
  full_name?: string
  phone_number?: string
  email?: string
  avatar_url?: string
  billing_name?: string
  billing_address?: string
  billing_tax_id?: string
}

export type AddressPayload = {
  label: string
  address: string
  recipient_name?: string
  phone?: string
  subdistrict?: string
  district?: string
  province?: string
  postal_code?: string
  lat?: number
  lng?: number
  is_default?: boolean
  delivery_notes?: string
}

export type Address = {
  id: string
  label: string
  address: string
  recipient_name: string | null
  phone: string | null
  subdistrict: string | null
  district: string | null
  province: string | null
  postal_code: string | null
  lat: number | null
  lng: number | null
  is_default: boolean
  delivery_notes: string | null
}

export interface ExportedData {
  exported_at: string
  profile: {
    id: string
    full_name: string | null
    email: string | null
    phone_number: string | null
    avatar_url: string | null
    account_status: string
    created_at: string
  } | null
  addresses: {
    label: string
    recipient_name: string | null
    recipient_phone: string | null
    address_line: string
    district: string | null
    province: string | null
    postal_code: string | null
  }[]
  orders: {
    id: string
    order_number: string
    status: string
    total_amount: number
    created_at: string
  }[]
  consent_history: {
    accepted_at: string
    ip_address: string | null
    consent_version: string
    consent_type: string
    consent_title: string
  }[]
}
