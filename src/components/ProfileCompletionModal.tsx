import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '@/hooks/useUserStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// Local type to avoid runtime import issues if '@/types/User' does not export UserRole at runtime
type UserRole = 'USER' | 'PROVIDER'
import { MapPin, Loader2 } from 'lucide-react'

interface ProfileCompletionModalProps {
  isOpen: boolean
}

export function ProfileCompletionModal({ isOpen }: ProfileCompletionModalProps) {
  const { t } = useTranslation()
  const { updateProfile, loading, error } = useUserStore()

  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [address, setAddress] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLon, setLocationLon] = useState<number | null>(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  if (!isOpen) return null

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName || !role) return

    setLocalError(null)
    try {
      await updateProfile({
        displayName: displayName.trim(),
        role: role as UserRole,
        locationLat: role === 'PROVIDER' ? locationLat : null,
        locationLon: role === 'PROVIDER' ? locationLon : null,
        address: role === 'PROVIDER' ? address.trim() : null,
      })
    } catch (err: unknown) {
      let message = t('auth.profile.error')
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        message = axiosError.response?.data?.message || message
      } else if (err instanceof Error) {
        message = err.message
      }
      setLocalError(message)
    }
  }

  const isValid = displayName.trim().length > 0 && role !== ''

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      {/* Darkened backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal Container: Like a Skillspot Card */}
      <div className="relative bg-card border border-border rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-[520px] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="space-y-3 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t('auth.profile.completeTitle')}
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              {t('auth.profile.completeDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label htmlFor="displayName" className="text-sm font-semibold text-foreground/90 ml-1">
                {t('auth.profile.displayName')}
              </label>
              <Input
                id="displayName"
                placeholder="e.g. Max Mustermann"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                className="h-12 bg-background/50 focus:bg-background transition-colors"
              />
            </div>

            <div className="space-y-2.5">
              <label htmlFor="role" className="text-sm font-semibold text-foreground/90 ml-1">
                {t('auth.profile.role')}
              </label>
              <select
                id="role"
                className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
                disabled={loading}
                style={{ borderColor: 'hsl(var(--input))' }}
              >
                <option value="" disabled>
                  {t('auth.profile.role')}...
                </option>
                <option value="USER">{t('auth.profile.roleUser')}</option>
                <option value="PROVIDER">{t('auth.profile.roleProvider')}</option>
              </select>
            </div>

            {role === 'PROVIDER' && (
              <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="address" className="text-sm font-semibold text-foreground/90 ml-1">
                  {t('auth.profile.address')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="address"
                    placeholder="Musterstraße 1, 12345 Berlin"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={loading || isGeocoding}
                    className="h-12 bg-background/50 focus:bg-background transition-colors flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGeocode}
                    disabled={loading || isGeocoding || !address.trim()}
                    className="h-12 px-4 shrink-0"
                  >
                    {isGeocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : t('auth.profile.takeAddress')}
                  </Button>
                </div>
                {locationLat && locationLon && (
                  <p className="text-[10px] text-muted-foreground ml-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    ✓ Koordinaten gefunden: {locationLat.toFixed(4)}, {locationLon.toFixed(4)}
                  </p>
                )}
              </div>
            )}

            {role !== 'PROVIDER' && (
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-foreground/90 ml-1 flex items-center gap-2">
                  {t('auth.profile.location')} <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">(optional)</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 justify-start gap-3 bg-background/50 hover:bg-accent/50 border-dashed"
                  disabled={true}
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{t('auth.profile.useMyLocation')}</span>
                </Button>
              </div>
            )}

            {(error || localError) && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-in shake-in-1">
                <p className="text-sm font-medium text-destructive text-center">
                  {localError || error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              disabled={!isValid || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('auth.profile.saving')}
                </>
              ) : (
                t('auth.profile.save')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
