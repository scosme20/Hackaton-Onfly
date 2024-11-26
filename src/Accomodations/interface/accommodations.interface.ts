export interface Accommodation {
  id: number
  name: string
  type: string
  city: string
  state: string
  description: string
  stars?: number
  image?: string
  amenities?: string[]
}
