export type AppRole = 'customer' | 'driver' | 'vendor' | 'pos' | 'admin' | 'superadmin'

export type UserRole = {
  role: AppRole
  is_active: boolean
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  roles: UserRole[]
  created_at: string
  updated_at: string
}

export type UpdateProfilePayload = {
  full_name?: string
  phone?: string
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
