import { useTranslation } from 'react-i18next'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { User, Mail, Clock, Shield, LogOut } from 'lucide-react'

export default function AccountPage() {
  const { t } = useTranslation()
  const auth = useOptionalAuth()

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-muted-foreground">{t('pages.account.notAuthenticated')}</p>
      </div>
    )
  }

  const handleLogout = () => {
    auth.logout({ returnTo: window.location.origin })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.account.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-8 text-center" style={{ borderColor: 'hsl(var(--border))' }}>
            {auth.user.picture ? (
              <img
                src={auth.user.picture}
                alt={auth.user.name || t('pages.account.profile')}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{auth.user.name || t('pages.account.user')}</h2>
            <p className="text-sm text-muted-foreground mb-6">{auth.user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogOut className="w-4 h-4" />
              {t('common.logout')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-lg border p-6" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('pages.account.profileInfo')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('pages.account.name')}</label>
                  <p className="text-lg mt-1">{auth.user.name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('pages.account.email')}
                  </label>
                  <p className="text-lg mt-1">{auth.user.email || '-'}</p>
                </div>
                {auth.user.email_verified !== undefined && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('pages.account.emailVerification')}</label>
                    <p className="text-lg mt-1">
                      {auth.user.email_verified ? (
                        <span className="text-green-600">✓ {t('pages.account.verified')}</span>
                      ) : (
                        <span className="text-yellow-600">⚠ {t('pages.account.notVerified')}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('pages.account.security')}
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('pages.account.securityDescription')}
                </p>
                <button className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                  {t('pages.account.changePassword')}
                </button>
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('pages.account.orderHistory')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('pages.account.orderHistoryDescription')}
              </p>
              <p className="text-center py-8 text-muted-foreground">{t('pages.account.noOrders')}</p>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4">{t('pages.account.accountDetails')}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">{t('pages.account.createdAt')}:</span>
                  <span className="ml-2">
                    {auth.user.created_at ? new Date(auth.user.created_at).toLocaleDateString(t('locale')) : '-'}
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">{t('pages.account.updatedAt')}:</span>
                  <span className="ml-2">
                    {auth.user.updated_at ? new Date(auth.user.updated_at).toLocaleDateString(t('locale')) : '-'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
