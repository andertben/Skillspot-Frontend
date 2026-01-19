import { useTranslation } from 'react-i18next'
import { MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Category } from '@/types/Category'

interface SubCategoryCardProps {
  category: Category
  distance?: number
}

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

export default function SubCategoryCard({ category, distance }: SubCategoryCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
      <div
        className="h-44 w-full bg-gradient-to-br flex items-center justify-center"
        style={{ background: DEFAULT_GRADIENT }}
      >
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
          {t('pages.services.noImage')}
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col justify-between pt-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-3">{category.bezeichnung}</h3>

        {distance !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{distance.toFixed(1)} km</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
