import { CafeItem, CafeAddonGroup } from 'src/models/CafeModel/ItemsModel'

export const itemNormalizer = (item): CafeItem => {
  const addonGroups = (item.addon_groups).map((addonGroup): CafeAddonGroup => ({
    id: addonGroup.id,
    name: addonGroup.name,
    minSelection: addonGroup.min_selections,
    maxSelection: addonGroup.max_selections,
  }))

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    outOfStock: item.out_of_stock,
    imageUrl: item.list_view_photo.original_url,
    coverImageUrl: item.images.cover,
    addonGroups,
  }
}
