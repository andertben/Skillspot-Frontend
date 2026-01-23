import { useEffect } from 'react'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { useUserStore } from '@/hooks/useUserStore'
import { ProfileCompletionModal } from './ProfileCompletionModal'

interface ProfileGateProps {
  children: React.ReactNode
}

export function ProfileGate({ children }: ProfileGateProps) {
  const auth = useOptionalAuth()
  const { profile, fetchProfile, reset, loading } = useUserStore()

  useEffect(() => {
    // 4) After successful login, automatically call GET /me
    if (auth.isAuthenticated && !profile && !loading) {
      fetchProfile()
    } 
    // 6) On logout, reset the user state
    else if (!auth.isAuthenticated && profile) {
      reset()
    }
  }, [auth.isAuthenticated, profile, fetchProfile, reset, loading])

  // 5) Only show modal if user.profileComplete is false
  const showModal = auth.isAuthenticated && profile !== null && profile.profileComplete === false

  return (
    <>
      {children}
      <ProfileCompletionModal isOpen={showModal} />
    </>
  )
}
