export type UserRole = 'USER' | 'PROVIDER'

export interface UserProfile {
  id: string
  email: string
  displayName: string | null
  role: UserRole | null
  profileComplete: boolean
  locationLat: number | null
  locationLon: number | null
  address?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CompleteProfileRequest {
  displayName: string
  role: UserRole
  locationLat: number | null
  locationLon: number | null
  address?: string | null
}

export interface UpdateProfileRequest {
  displayName: string
  role: UserRole
  address?: string | null
  locationLat?: number | null
  locationLon?: number | null
}
