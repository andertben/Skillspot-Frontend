import api from './client'
import type { Review } from '@/types/Review'

export async function getReviews(): Promise<Review[]> {
  try {
    const response = await api.get<Review[]>('/reviews')
    if (import.meta.env.DEV) {
      console.log(`[BACKEND] GET /reviews → ${response.data.length} reviews`)
    }
    return response.data
  } catch (error) {
    console.error('[BACKEND] GET /reviews failed:', error)
    return [] // Return empty array on failure as fallback
  }
}

export function calculateAverageRating(reviews: Review[]): number | null {
  const validReviews = reviews.filter((r) => r.bewertung !== null)
  if (validReviews.length === 0) return null
  
  const sum = validReviews.reduce((acc, r) => acc + (r.bewertung || 0), 0)
  return sum / validReviews.length
}

export function getProviderReviews(reviews: Review[], providerId: number): Review[] {
  return reviews.filter((r) => r.anbieterId === providerId)
}

export function getServiceReviews(reviews: Review[], serviceId: number): Review[] {
  return reviews.filter((r) => r.dienstleistungId === serviceId)
}
