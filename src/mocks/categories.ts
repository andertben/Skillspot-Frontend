import type { Category } from '@/types/Category'

export const mockCategories: Category[] = [
  {
    kategorie_id: 1,
    bezeichnung: 'Handwerk',
    icon: '🔨',
    oberkategorie_id: 0,
  },
  {
    kategorie_id: 2,
    bezeichnung: 'Dienstleistungen',
    icon: '🛠️',
    oberkategorie_id: 0,
  },
  {
    kategorie_id: 3,
    bezeichnung: 'Bildung',
    icon: '📚',
    oberkategorie_id: 0,
  },
  {
    kategorie_id: 4,
    bezeichnung: 'Elektroarbeiten',
    icon: '⚡',
    oberkategorie_id: 1,
  },
  {
    kategorie_id: 5,
    bezeichnung: 'Reparaturen',
    icon: '🔧',
    oberkategorie_id: 1,
  },
  {
    kategorie_id: 6,
    bezeichnung: 'Reinigung',
    icon: '🧹',
    oberkategorie_id: 2,
  },
  {
    kategorie_id: 7,
    bezeichnung: 'Sprachkurse',
    icon: '🗣️',
    oberkategorie_id: 3,
  },
  {
    kategorie_id: 8,
    bezeichnung: 'Nachhilfe',
    icon: '✏️',
    oberkategorie_id: 3,
  },
]
