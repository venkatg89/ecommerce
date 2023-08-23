export interface WishListModel {
  default: boolean
  id: string
  name: string
  type: string
  isPublic: boolean
  items: WishtListItemModel[]
}

export interface WishtListItemModel {
  id: string
  addedDate: string
  priority: number
  name: string
  quanity: number
  ean: string
}
