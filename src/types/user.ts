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
  address_line: string
  lat?: number
  lng?: number
  is_default?: boolean
}
