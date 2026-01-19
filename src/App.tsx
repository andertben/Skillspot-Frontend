import type { ReactNode } from 'react'
import { Auth0Provider } from '@auth0/auth0-react'
import { useSetupAuthInterceptor } from '@/auth/SetupAuthInterceptor'

interface AppProps {
  children: ReactNode
}

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE
const AUTH0_REDIRECT_URI =
  import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin

const isAuthConfigured = !!(AUTH0_DOMAIN && AUTH0_CLIENT_ID)

function AppContent({ children }: AppProps) {
  useSetupAuthInterceptor()

  return <>{children}</>
}

export default function App({ children }: AppProps) {
  if (!isAuthConfigured) {
    return <>{children}</>
  }

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: AUTH0_REDIRECT_URI,
        scope: 'openid profile email',
        ...(AUTH0_AUDIENCE && { audience: AUTH0_AUDIENCE }),
      }}
      cacheLocation="localstorage"
    >
      <AppContent>{children}</AppContent>
    </Auth0Provider>
  )
}
