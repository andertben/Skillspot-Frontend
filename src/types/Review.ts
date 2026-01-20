export interface Review {
  anbieterId: number | null
  dienstleistungId: number
  bewertung: number | null
  text?: string
  erstellungsDatum?: string
  bewertungId?: number
  benutzerId?: number
  buchungId?: number
}
