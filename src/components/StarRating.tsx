import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
  rating: number | null
}

export default function StarRating({ rating }: StarRatingProps) {
  // Handle null, undefined, or NaN
  if (rating === null || rating === undefined || isNaN(rating)) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          ))}
        </div>
        <span className="text-xs font-semibold text-muted-foreground">(0.0)</span>
      </div>
    )
  }

  // Ensure rating is within 0-5 range and is a valid number
  const safeRating = Math.max(0, Math.min(5, Number(rating)))

  // Round to nearest 0.5
  const roundedRating = Math.round(safeRating * 2) / 2
  
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      )
    } else if (i - 0.5 <= roundedRating) {
      stars.push(
        <StarHalf
          key={i}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      )
    } else {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-gray-300"
        />
      )
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">({safeRating.toFixed(1)})</span>
    </div>
  )
}
