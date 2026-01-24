import api from './client'
import type { UserProfile, CompleteProfileRequest, UpdateProfileRequest } from '@/types/User'

export const getMe = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>('/me')
  return response.data
}

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  // Backend requires `role` on PUT /me/profile (400 "Role is required" otherwise).
  // The UI may not allow changing the role here, but we still must send the current role.
  
  if (!data.role) {
    console.error('[updateUserProfile] Missing role in update request', data)
    throw new Error('Role is required for profile update')
  }

  const payload: UpdateProfileRequest = {
    displayName: data.displayName,
    role: data.role,
    address: data.address ?? null,
    locationLat: data.locationLat ?? null,
    locationLon: data.locationLon ?? null,
  }

  console.debug('[updateUserProfile] PUT /me/profile payload', payload)
  const response = await api.put<UserProfile>('/me/profile', payload)
  return response.data
}

export const completeProfile = async (data: CompleteProfileRequest): Promise<UserProfile> => {
  // Backend expects these exact JSON keys (see Swagger): displayName, role, locationLat, locationLon
  // Also ensure role is not empty to avoid 400 validation errors.
  const payload: CompleteProfileRequest = {
    displayName: data.displayName,
    role: data.role,
    locationLat: data.locationLat,
    locationLon: data.locationLon,
    address: data.address,
  }

  if (!payload.role) {
    throw new Error('Role is missing in completeProfile payload')
  }

  const response = await api.post<UserProfile>('/me/complete-profile', payload)
  return response.data
}
