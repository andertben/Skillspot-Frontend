import api from './client'
import type { Review } from '@/types/Review'

export async function getReviewsByServiceId(serviceId: number | string): Promise<Review[]> {
  try {
    const response = await api.get<any[]>(`/api/reviews/service/${serviceId}`)
    const normalized = response.data.map(raw => {
      const normalizedReview: Review = {
        id: Number(raw.id || raw.bewertungId || raw.bewertung_id),
        serviceId: Number(raw.dienstleistungId ?? raw.dienstleistung_id ?? raw.serviceId ?? raw.service_id ?? serviceId),
        providerId: Number(raw.anbieterId ?? raw.anbieter_id ?? raw.providerId ?? raw.provider_id),
        rating: Number(raw.rating ?? raw.bewertung ?? 0),
        comment: String(raw.comment ?? raw.text ?? ''),
        createdAt: raw.createdAt || raw.datum || new Date().toISOString()
      }
      return normalizedReview
    })
    console.log(`[REVIEWS] Normalized reviews for service ${serviceId}:`, normalized)
    return normalized
  } catch (error) {
    console.error(`[BACKEND] GET /api/reviews/service/${serviceId} failed:`, error)
    return []
  }
}

export async function getAverageRating(serviceId: number | string): Promise<number | null> {
  try {
    const response = await api.get<number | { average: number }>(`/api/reviews/average/${serviceId}`)
    const data = response.data
    
    if (typeof data === 'object' && data !== null && 'average' in data) {
      return Number(data.average)
    }
    
    return data !== null ? Number(data) : null
  } catch (error) {
    // Return null on any error (404, 500, etc) to prevent UI breakage
    console.warn(`[BACKEND] GET /api/reviews/average/${serviceId} failed or not found:`, error)
    return null
  }
}

/**
 * Fallback or support for provider-specific reviews if needed
 */
export async function getReviewsByProviderId(providerId: number | string): Promise<Review[]> {
  try {
    const response = await api.get<Review[]>(`/api/reviews/provider/${providerId}`)
    return response.data
  } catch (error) {
    console.error(`[BACKEND] GET /api/reviews/provider/${providerId} failed:`, error)
    return []
  }
}

export async function createReview(serviceId: number, rating: number, comment: string): Promise<Review> {
  try {
    const response = await api.post('/bewertungen', {
      dienstleistungId: serviceId,
      bewertung: rating,
      text: comment
    })
    
    const raw = response.data
    // Normalize response to Review type
    return {
      id: Number(raw.id || raw.bewertungId || raw.bewertung_id),
      serviceId: Number(raw.dienstleistungId ?? raw.dienstleistung_id ?? raw.serviceId ?? raw.service_id ?? serviceId),
      providerId: Number(raw.anbieterId ?? raw.anbieter_id ?? raw.providerId ?? raw.provider_id),
      rating: Number(raw.rating ?? raw.bewertung ?? rating),
      comment: String(raw.comment ?? raw.text ?? comment),
      createdAt: raw.createdAt || raw.datum || new Date().toISOString()
    }
  } catch (error) {
    console.error('[REVIEWS API] createReview failed:', error)
    throw error
  }
}

export function calculateAverageRating(reviews: Review[]): number | null {
  const validReviews = reviews.filter((r) => r.rating !== null)
  if (validReviews.length === 0) return null

  const sum = validReviews.reduce((acc, r) => acc + (r.rating || 0), 0)
  return sum / validReviews.length
}
