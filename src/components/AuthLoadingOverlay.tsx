import { useTranslation } from 'react-i18next'

interface AuthLoadingOverlayProps {
  isOpen: boolean
  error?: string
  onDismissError: () => void
}

export function AuthLoadingOverlay({ isOpen, error, onDismissError }: AuthLoadingOverlayProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="auth-loading-overlay">
      {error ? (
        <div className="auth-loading-content auth-loading-error">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <button
            onClick={onDismissError}
            className="px-4 py-2 bg-muted text-foreground rounded-md hover:opacity-80 transition-opacity"
          >
            {t('auth.dismiss')}
          </button>
        </div>
      ) : (
        <div className="auth-loading-content">
          <div className="auth-loading-spinner" />
          <p className="text-center text-muted-foreground mt-4">
            {t('auth.popupLoading')}
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {t('auth.popupBlockerHint')}
          </p>
        </div>
      )}
    </div>
  )
}
