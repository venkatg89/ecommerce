import { CafeCategory } from 'src/models/CafeModel/CategoryModel'

export const categoryNormalizer = (menu): CafeCategory => ({
  id: menu.id,
  name: menu.name,
  imageUrl: menu.list_view_photo.large_url,
})
