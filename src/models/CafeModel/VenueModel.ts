export interface CafeVenue {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  distance?: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  coverPhoto: string
  menuId: string
  phone: string
  storeId: string
  isOpen: boolean
}
