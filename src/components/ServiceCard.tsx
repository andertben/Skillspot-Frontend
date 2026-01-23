import { MapPin, ChevronDown, ChevronUp, Calendar, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Service } from '@/types/Service'
import type { Review } from '@/types/Review'
import StarRating from './StarRating'
import { createThread } from '@/api/chat'
import { useOptionalAuth } from '@/auth/useOptionalAuth'

interface ServiceCardProps {
  service: Service
  providerName?: string
  distance?: number
  rating?: number | null
  isExpanded?: boolean
  reviews?: Review[]
}

function RatingBars({ reviews }: { reviews: Review[] }) {
  const counts = [0, 0, 0, 0, 0] // 5, 4, 3, 2, 1
  reviews.forEach(r => {
    if (r.bewertung && r.bewertung >= 1 && r.bewertung <= 5) {
      counts[5 - Math.round(r.bewertung)]++
    }
  })

  const total = reviews.length

  return (
    <div className="flex flex-col gap-1.5 py-4 border-y border-border/50 my-2">
      {counts.map((count, i) => {
        const stars = 5 - i
        const percentage = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={stars} className="flex items-center gap-3 text-sm">
            <span className="w-12 text-muted-foreground font-medium shrink-0">{stars} {stars === 1 ? 'Star' : 'Stars'}</span>
            <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500 ease-out" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-10 text-right text-muted-foreground tabular-nums">{Math.round(percentage)}%</span>
          </div>
        )
      })}
    </div>
  )
}

function ReviewList({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation()

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground italic">
        {t('pages.services.noReviews') || 'Noch keine Bewertungen vorhanden'}
      </div>
    )
  }

  return (
    <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-4 py-2">
      {reviews.map((review, i) => (
        <div key={i} className="flex flex-col gap-1.5 pb-4 border-b border-border/30 last:border-0">
          <div className="flex items-center justify-between">
            <StarRating rating={review.bewertung} />
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>
                {review.erstellungsDatum 
                  ? new Date(review.erstellungsDatum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
                  : new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
                }
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80 italic">
            {review.text ? `"${review.text}"` : t('pages.services.noReviewText') || '"Kein Kommentar hinterlassen"'}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function ServiceCard({ 
  service, 
  providerName, 
  distance, 
  rating = null,
  isExpanded = false,
  reviews = []
}: ServiceCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, loginWithPopup } = useOptionalAuth()
  const [isCreatingThread, setIsCreatingThread] = useState(false)

  const serviceId = Number(service.dienstleistungId)
  const safeReviews = (reviews || []).filter(r => Number(r.dienstleistungId) === serviceId)
  const safeRating =
    rating !== null && rating !== undefined
      ? rating
      : safeReviews.length > 0
        ? safeReviews
            .filter(r => r.bewertung !== null && r.bewertung !== undefined)
            .reduce((sum, r) => sum + (Number(r.bewertung) || 0), 0) /
          Math.max(1, safeReviews.filter(r => r.bewertung !== null && r.bewertung !== undefined).length)
        : null

  return (
    <div className={`bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="p-5 flex flex-col gap-2 relative">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 mb-0.5">
              {service.title}
            </h3>
            {providerName && (
              <p className="text-sm font-medium text-primary">{providerName}</p>
            )}
          </div>
          <div className="shrink-0 p-1 rounded-full bg-secondary/50 text-muted-foreground">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        <div className="min-h-[24px] flex items-center">
          <StarRating rating={safeRating} />
        </div>

        {!isExpanded && (
          <div className="flex items-center justify-between gap-2">
            {distance !== undefined && distance >= 0 ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {distance.toFixed(1)} km
                </span>
              </div>
            ) : (
              <div />
            )}

            <button
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 border-2 border-primary/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={async (e) => {
                e.stopPropagation()
                if (!isAuthenticated) {
                  await loginWithPopup()
                  return
                }

                try {
                  setIsCreatingThread(true)
                  console.log('[ServiceCard] Creating thread for service:', service.dienstleistungId)
                  const thread = await createThread(String(service.dienstleistungId))
                  console.log('[ServiceCard] Thread created:', thread)
                  if (thread && thread.threadId) {
                    console.log('[ServiceCard] Navigating to:', `/chat/${thread.threadId}`)
                    navigate(`/chat/${thread.threadId}`, { 
                      state: { 
                        serviceTitle: thread.dienstleistungTitle,
                        providerName: thread.anbieterName
                      } 
                    })
                  } else {
                    console.error('[ServiceCard] Thread created but no threadId found:', thread)
                  }
                } catch (error) {
                  console.error('Failed to create chat thread:', error)
                } finally {
                  setIsCreatingThread(false)
                }
              }}
              disabled={isCreatingThread}
            >
              {isCreatingThread && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('common.inquiry')}
            </button>
          </div>
        )}

        {isExpanded && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {safeReviews.length > 0 && <RatingBars reviews={safeReviews} />}
            <ReviewList reviews={safeReviews} />
          </div>
        )}
      </div>
    </div>
  )
}
