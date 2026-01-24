import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOptionalAuth } from '@/auth/useOptionalAuth'
import { useUserStore } from '@/hooks/useUserStore'
import { User, Mail, Clock, Shield, LogOut, Loader2, Save, MapPin, MessageSquare, Trash2, PlusCircle, Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types/User'
import { getMyThreads } from '@/api/chat'
import { getMyServices, deleteDienstleistung } from '@/api/services'
import type { ThreadSummary } from '@/types/Chat'
import type { Service } from '@/types/Service'

export default function AccountPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useOptionalAuth()
  const { profile, loading, error, fetchProfile, updateProfileDetails } = useUserStore()

  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [address, setAddress] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLon, setLocationLon] = useState<number | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const [threads, setThreads] = useState<ThreadSummary[]>([])
  const [isThreadsLoading, setIsThreadsLoading] = useState(true)
  const [threadsError, setThreadsError] = useState<string | null>(null)

  const [myServices, setMyServices] = useState<Service[]>([])
  const [isServicesLoading, setIsServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)

  const effectiveRole = (role || profile?.role) as UserRole

  useEffect(() => {
    // Only fetch if profile is missing. 
    // ProfileGate already handles the initial fetch for the app.
    if (!profile) {
      fetchProfile()
    }
  }, [fetchProfile, profile])

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setIsThreadsLoading(true)
        const data = await getMyThreads()
        setThreads(data)
        setThreadsError(null)
      } catch (err) {
        console.error('Failed to fetch threads:', err)
        setThreadsError(t('pages.chat.loadError') || 'Fehler beim Laden der Chats')
      } finally {
        setIsThreadsLoading(false)
      }
    }

    if (auth.isAuthenticated) {
      fetchThreads()
    }
  }, [auth.isAuthenticated, t])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsServicesLoading(true)
        const data = await getMyServices()
        setMyServices(data)
        setServicesError(null)
      } catch (err) {
        console.error('Failed to fetch services:', err)
        setServicesError('Fehler beim Laden der Dienstleistungen')
      } finally {
        setIsServicesLoading(false)
      }
    }

    if (auth.isAuthenticated && role === 'PROVIDER') {
      fetchServices()
    }
  }, [auth.isAuthenticated, role])

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Möchten Sie diese Dienstleistung wirklich löschen?')) return

    try {
      await deleteDienstleistung(id)
      setMyServices(prev => prev.filter(s => s.dienstleistungId !== id))
    } catch (err) {
      console.error('Failed to delete service:', err)
      alert('Fehler beim Löschen der Dienstleistung')
    }
  }

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '')
      // Only set role if it's not already set or if profile has a valid role.
      // Do not fallback to '' if profile.role exists.
      if (profile.role) {
        setRole(profile.role)
      }
      setAddress(profile.address || '')
      setLocationLat(profile.locationLat ?? null)
      setLocationLon(profile.locationLon ?? null)
    }
  }, [profile])

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-muted-foreground">{t('pages.account.notAuthenticated')}</p>
      </div>
    )
  }

  const handleLogout = () => {
    auth.logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleGeocode = async () => {
    if (!address.trim()) return

    setIsGeocoding(true)
    setLocalError(null)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        setLocationLat(parseFloat(data[0].lat))
        setLocationLon(parseFloat(data[0].lon))
      } else {
        setLocalError(t('auth.profile.geocodingError'))
      }
    } catch {
      setLocalError(t('auth.profile.geocodingError'))
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSaveSuccess(false)

    if (!displayName.trim()) {
      setLocalError(t('auth.profile.displayName') + ' ' + t('common.error')) // Or a more specific key if I had one
      return
    }

    if (!effectiveRole) {
      setLocalError(t('auth.profile.role') + ' ' + t('common.error'))
      return
    }

    if (effectiveRole === 'PROVIDER' && !address.trim()) {
      setLocalError(t('auth.profile.address') + ' ' + t('common.error'))
      return
    }

    if (effectiveRole === 'PROVIDER' && (locationLat === null || locationLon === null)) {
      setLocalError("Bitte bestätigen Sie die Adresse mit dem Button 'Adresse übernehmen', um die Standortdaten zu generieren.")
      return
    }

    try {
      await updateProfileDetails({
        displayName: displayName.trim(),
        role: effectiveRole,
        address: effectiveRole === 'PROVIDER' ? address.trim() : null,
        locationLat: effectiveRole === 'PROVIDER' ? locationLat : null,
        locationLon: effectiveRole === 'PROVIDER' ? locationLon : null,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch {
      // Error is handled by store and displayed via error variable
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('de-DE')
    } catch {
      return '-'
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('pages.account.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-8 text-center bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
            {auth.user.picture ? (
              <img
                src={auth.user.picture}
                alt={auth.user.name || t('pages.account.profile')}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-primary/20">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2 break-words">{profile?.displayName || auth.user.name || t('pages.account.user')}</h2>
            <p className="text-sm text-muted-foreground mb-6 break-all">{auth.user.email}</p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <LogOut className="w-4 h-4" />
              {t('common.logout')}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4">
                <User className="w-5 h-5 text-primary" />
                {t('pages.account.profileInfo')}
              </h3>
              
              <div className="space-y-5">
                <div className="grid gap-2">
                  <label htmlFor="displayName" className="text-sm font-medium text-muted-foreground">
                    {t('pages.account.name')}
                  </label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                    placeholder="Anzeigename"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Rolle
                  </label>
                  <p className="text-base font-medium px-3 py-2 bg-muted/30 rounded-md border border-border/50">
                    {role === 'PROVIDER' ? t('auth.profile.roleProvider') : t('auth.profile.roleUser')}
                  </p>
                  <p className="text-[10px] text-muted-foreground ml-1 italic">
                    Die Rolle kann nach der Registrierung nicht mehr geändert werden.
                  </p>
                </div>

                {role === 'PROVIDER' && (
                  <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                      {t('auth.profile.address')}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value)
                          setLocationLat(null)
                          setLocationLon(null)
                        }}
                        disabled={loading || isGeocoding}
                        placeholder="Musterstraße 1, 12345 Berlin"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleGeocode}
                        disabled={loading || isGeocoding || !address.trim()}
                        className="h-10 px-4 shrink-0"
                      >
                        {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.profile.takeAddress')}
                      </Button>
                    </div>
                    {locationLat && locationLon && (
                      <p className="text-[10px] text-green-600 font-semibold ml-1 flex items-center gap-1 animate-in fade-in">
                        <MapPin className="h-3 w-3" />
                        ✓ {t('auth.profile.location')} bestätigt: {locationLat.toFixed(4)}, {locationLon.toFixed(4)}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t('pages.account.email')}
                  </label>
                  <p className="text-base font-medium px-3 py-2 bg-muted/30 rounded-md border border-border/50">
                    {auth.user.email || '-'}
                  </p>
                </div>

                {(error || localError) && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    {localError || error}
                  </div>
                )}

                {saveSuccess && (
                  <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium">
                    {t('auth.profile.saveSuccess', 'Profil erfolgreich gespeichert!')}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || (effectiveRole === 'PROVIDER' && (!locationLat || !locationLon))}
                  className="w-full sm:w-auto mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('auth.profile.save')}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                {t('pages.chat.title') || 'Meine Chats'}
              </h3>
              
              <div className="space-y-4">
                {isThreadsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : threadsError ? (
                  <p className="text-center py-8 text-destructive bg-destructive/5 rounded-lg border border-dashed border-destructive/20">
                    {threadsError}
                  </p>
                ) : threads.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    {t('pages.chat.noMessages') || 'Keine aktiven Chats vorhanden'}
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {threads.map((thread) => (
                      <button
                        key={thread.threadId}
                        type="button"
                        onClick={() => navigate(`/chat/${thread.threadId}`)}
                        className="w-full text-left p-4 rounded-xl border border-border/50 hover:bg-accent hover:border-primary/20 transition-all group relative"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {thread.dienstleistungTitle || 'Anfrage'}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {thread.anbieterName}
                            </p>
                            {thread.lastMessageText && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-1 italic">
                                "{thread.lastMessageText}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {thread.unreadCount ? thread.unreadCount > 0 && (
                              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                                {thread.unreadCount}
                              </span>
                            ) : null}
                            {thread.lastMessageAt && (
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                {new Date(thread.lastMessageAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {role === 'PROVIDER' && (
              <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    Meine Dienstleistungen
                  </h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/services/new')}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Neu erstellen
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {isServicesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : servicesError ? (
                    <p className="text-center py-8 text-destructive bg-destructive/5 rounded-lg border border-dashed border-destructive/20">
                      {servicesError}
                    </p>
                  ) : myServices.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                      <p className="mb-4">Sie haben noch keine Dienstleistungen erstellt.</p>
                      <Button onClick={() => navigate('/services/new')} variant="secondary">
                        Erste Dienstleistung erstellen
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {myServices.map((service) => (
                        <div
                          key={service.dienstleistungId}
                          className="w-full flex justify-between items-center p-4 rounded-xl border border-border/50 bg-card/50"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-foreground truncate">
                              {service.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {service.beschreibung || 'Keine Beschreibung'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/services/edit/${service.dienstleistungId}`)}
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Bearbeiten"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteService(service.dienstleistungId)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              title="Löschen"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t('pages.account.security')}
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('pages.account.securityDescription')}
                </p>
                <button 
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors text-sm font-medium shadow-sm"
                >
                  {t('pages.account.changePassword')}
                </button>
              </div>
            </div>

            <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t('pages.account.orderHistory')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 italic">
                {t('pages.account.orderHistoryDescription')}
              </p>
              <p className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                {t('pages.account.noOrders')}
              </p>
            </div>

            <div className="rounded-lg border p-6 bg-card shadow-sm" style={{ borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {t('pages.account.accountDetails')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground block mb-1 font-medium">{t('pages.account.createdAt')}</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(profile?.createdAt)}
                  </span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <span className="text-muted-foreground block mb-1 font-medium">{t('pages.account.updatedAt')}</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(profile?.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
