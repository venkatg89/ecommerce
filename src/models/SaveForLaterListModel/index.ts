export interface SaveForLaterListModel {
  [id: number]: SaveForLaterItemModel[]
}

export interface SaveForLaterItemModel {
  id: string
  siteId: string
  pdpUrl: string
  imageUrls: []
  class: string
  quantity: number
  rating: number
  productName: string
  productId: string
}
