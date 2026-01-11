import type { ReactNode } from 'react'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useOptionalAuth()

  if (auth.isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground mb-6">
          Please log in to access this page.
        </p>
        <Button onClick={() => auth.loginWithRedirect()}>Login</Button>
      </div>
    )
  }

  return <>{children}</>
}
