import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAxiosError } from 'axios'
import { Loader2, Save, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { fetchKategorieTree, createDienstleistung, getServiceById, updateDienstleistung } from '@/api/services'
import type { Category } from '@/types/Category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOptionalAuth } from '@/auth/useOptionalAuth'

export default function ServiceFormPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const auth = useOptionalAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [selectedOberkategorie, setSelectedOberkategorie] = useState<string>('')
  const [selectedUnterkategorie, setSelectedUnterkategorie] = useState<string>('')
  const [title, setTitle] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!auth.isAuthenticated || auth.isLoading) return

      try {
        setIsLoading(true)
        const categoriesData = await fetchKategorieTree()
        setCategories(categoriesData)

        if (isEditMode) {
          const service = await getServiceById(Number(id))
          setTitle(service.title)
          setBeschreibung(service.beschreibung || '')
          setSelectedUnterkategorie(String(service.kategorieId))
          
          // Find the parent category for the selected subcategory in the tree
          const parent = categoriesData.find(cat => 
            cat.children?.some(child => child.id === service.kategorieId)
          )
          if (parent) {
            setSelectedOberkategorie(String(parent.id))
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(t('pages.services.loadError') || 'Fehler beim Laden der Daten')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, isEditMode, t, auth.isAuthenticated, auth.isLoading])

  const topCategories = categories

  const subCategories = categories.find(
    cat => String(cat.id) === selectedOberkategorie
  )?.children || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!selectedUnterkategorie) {
      setError(t('pages.serviceForm.errorCategory'))
      return
    }
    
    if (!title.trim()) {
      setError(t('pages.serviceForm.errorTitle'))
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        kategorieId: Number(selectedUnterkategorie),
        title: title.trim(),
        beschreibung: beschreibung.trim() || undefined
      }

      if (isEditMode) {
        await updateDienstleistung(Number(id), payload)
      } else {
        await createDienstleistung(payload)
      }
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/account')
      }, 2000)
    } catch (err: unknown) {
      console.error('Failed to save service:', err)
      
      // Handle backend validation errors (400)
      if (isAxiosError(err)) {
        if (err.response?.status === 400 && err.response?.data) {
          const backendError = err.response.data
          if (typeof backendError === 'string') {
            setError(backendError)
          } else if (backendError.message) {
            setError(backendError.message)
          } else if (typeof backendError === 'object') {
            // If it's a field-level error map
            const messages = Object.entries(backendError)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ')
            setError(messages || t('pages.serviceForm.errorValidation'))
          } else {
            setError(t('pages.serviceForm.errorValidation'))
          }
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError(t('pages.serviceForm.errorUnauthorized'))
        } else {
          setError(t('common.error'))
        }
      } else {
        setError(t('common.error'))
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('common.back')}
      </button>

      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? t('pages.serviceForm.titleEdit') : t('pages.serviceForm.titleCreate')}
      </h1>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-600 mb-2">{t('pages.serviceForm.successTitle')}</h2>
          <p className="text-muted-foreground">
            {t('pages.serviceForm.successMessage')}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('pages.serviceForm.oberkategorie')}</label>
              <select
                value={selectedOberkategorie}
                onChange={(e) => {
                  setSelectedOberkategorie(e.target.value)
                  setSelectedUnterkategorie('')
                }}
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              >
                <option value="">{t('pages.serviceForm.select')}</option>
                {topCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('pages.serviceForm.unterkategorie')}</label>
              <select
                value={selectedUnterkategorie}
                onChange={(e) => setSelectedUnterkategorie(e.target.value)}
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                disabled={!selectedOberkategorie}
                required
              >
                <option value="">{t('pages.serviceForm.select')}</option>
                {subCategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-muted-foreground">{t('pages.serviceForm.title')}</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('pages.serviceForm.titlePlaceholder')}
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="beschreibung" className="text-sm font-medium text-muted-foreground">
              {t('pages.serviceForm.beschreibung')} {t('pages.serviceForm.optional')}
            </label>
            <textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder={t('pages.serviceForm.beschreibungPlaceholder')}
              className="w-full min-h-[120px] bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              disabled={isSaving}
            />
          </div>

          <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {t('common.save')}
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
