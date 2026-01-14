import { useEffect } from 'react'

interface AuthLoginOverlayProps {
  isOpen: boolean
  error?: string | null
  onClose: () => void
}

const ENABLE_AUTH_DEBUG = import.meta.env.DEV

export function AuthLoginModal({ isOpen, error, onClose }: AuthLoginOverlayProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  if (ENABLE_AUTH_DEBUG) {
    console.debug('[AuthLoginOverlay] Displayed', { hasError: !!error })
  }

  return (
    <div className="auth-login-overlay">
      {error ? (
        <div className="auth-login-overlay-error">
          <p className="text-sm mb-3">{error}</p>
          <button
            onClick={onClose}
            className="auth-login-overlay-button"
            aria-label="Schließen"
          >
            Schließen
          </button>
        </div>
      ) : (
        <>
          <div className="auth-login-overlay-spinner" />
          <p className="auth-login-overlay-text">Login-Fenster wird geöffnet…</p>
        </>
      )}
    </div>
  )
}
