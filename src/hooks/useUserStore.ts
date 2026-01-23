import { create } from 'zustand'
import { getMe, completeProfile, updateUserProfile } from '@/api/user'
import type { UserProfile, CompleteProfileRequest, UpdateProfileRequest } from '@/types/User'

interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (data: CompleteProfileRequest) => Promise<void>
  updateProfileDetails: (data: UpdateProfileRequest) => Promise<void>
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: false,
  error: null,
  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const profile = await getMe()
      
      // Client-side safety check: Even if backend says false, if we have name & role, it's complete.
      // This covers cases where backend might not have updated the profileComplete flag yet.
      const isComplete = profile.profileComplete || (!!profile.displayName && !!profile.role)
      
      set({ 
        profile: { ...profile, profileComplete: isComplete }, 
        loading: false 
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile'
      set({ error: message, loading: false })
    }
  },
  updateProfile: async (data: CompleteProfileRequest) => {
    set({ loading: true, error: null })
    try {
      const updatedProfile = await completeProfile(data)
      // Explicitly set the new profile in state. 
      // Force profileComplete to true if it's not present in response, to ensure modal closes.
      set({ 
        profile: { ...updatedProfile, profileComplete: updatedProfile.profileComplete ?? true }, 
        loading: false 
      })
    } catch (error: unknown) {
      let message = 'Failed to update profile'
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      } else if (error instanceof Error) {
        message = error.message
      }
      set({ error: message, loading: false })
      throw error
    }
  },
  updateProfileDetails: async (data: UpdateProfileRequest) => {
    set({ loading: true, error: null })
    try {
      const updatedProfile = await updateUserProfile(data)
      // Ensure profileComplete remains true if we are updating details (since the user already completed it)
      set((state) => ({ 
        profile: { 
          ...updatedProfile, 
          profileComplete: updatedProfile.profileComplete ?? state.profile?.profileComplete ?? true 
        }, 
        loading: false 
      }))
    } catch (error: unknown) {
      let message = 'Failed to update profile'
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      } else if (error instanceof Error) {
        message = error.message
      }
      set({ error: message, loading: false })
      throw error
    }
  },
  reset: () => set({ profile: null, loading: false, error: null }),
}))
