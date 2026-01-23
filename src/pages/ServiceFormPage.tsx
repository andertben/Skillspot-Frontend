import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
          
          // Find the parent category for the selected subcategory
          // Works for both tree structure (children) and flat list (oberkategorie_id)
          const parent = categoriesData.find(cat => 
            cat.children?.some(child => child.kategorie_id === service.kategorieId) ||
            (cat.kategorie_id === categoriesData.find(c => c.kategorie_id === service.kategorieId)?.oberkategorie_id)
          )
          if (parent) {
            setSelectedOberkategorie(String(parent.kategorie_id))
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

  const topCategories = categories.filter(
    c => !c.oberkategorie_id || c.oberkategorie_id === 0
  )

  const subCategories = categories.filter(c => {
    if (selectedOberkategorie) {
      // If it's a tree structure
      const parent = categories.find(p => String(p.kategorie_id) === selectedOberkategorie)
      if (parent?.children && parent.children.length > 0) {
        return parent.children.some(child => child.kategorie_id === c.kategorie_id)
      }
      // If it's a flat structure
      return String(c.oberkategorie_id) === selectedOberkategorie
    }
    return false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!selectedUnterkategorie) {
      setError('Bitte wählen Sie eine Unterkategorie aus.')
      return
    }
    
    if (!title.trim()) {
      setError('Bitte geben Sie einen Titel an.')
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
    } catch (err) {
      console.error('Failed to save service:', err)
      setError(t('common.error') || 'Ein Fehler ist aufgetreten.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Lade Daten...</p>
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
        {isEditMode ? 'Dienstleistung bearbeiten' : 'Neue Dienstleistung erstellen'}
      </h1>

      {success ? (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-600 mb-2">Erfolgreich gespeichert!</h2>
          <p className="text-muted-foreground">
            Ihre Dienstleistung wurde gespeichert. Sie werden zum Profil weitergeleitet...
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
              <label className="text-sm font-medium text-muted-foreground">Oberkategorie</label>
              <select
                value={selectedOberkategorie}
                onChange={(e) => {
                  setSelectedOberkategorie(e.target.value)
                  setSelectedUnterkategorie('')
                }}
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              >
                <option value="">Wählen...</option>
                {topCategories.map(cat => (
                  <option key={cat.kategorie_id} value={cat.kategorie_id}>
                    {cat.bezeichnung}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Unterkategorie</label>
              <select
                value={selectedUnterkategorie}
                onChange={(e) => setSelectedUnterkategorie(e.target.value)}
                className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                disabled={!selectedOberkategorie}
                required
              >
                <option value="">Wählen...</option>
                {subCategories.map(sub => (
                  <option key={sub.kategorie_id} value={sub.kategorie_id}>
                    {sub.bezeichnung}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-muted-foreground">Titel</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Reparatur von Elektrogeräten"
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="beschreibung" className="text-sm font-medium text-muted-foreground">Beschreibung (optional)</label>
            <textarea
              id="beschreibung"
              value={beschreibung}
              onChange={(e) => setBeschreibung(e.target.value)}
              placeholder="Beschreiben Sie Ihre Dienstleistung näher..."
              className="w-full min-h-[120px] bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              disabled={isSaving}
            />
          </div>

          <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Speichern
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
