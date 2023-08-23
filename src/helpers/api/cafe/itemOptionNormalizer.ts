import { CafeItemOption } from 'src/models/CafeModel/ItemsModel'

export const itemOptionNormalizer = (itemOption): CafeItemOption => ({
  id: itemOption.id,
  name: itemOption.name,
  price: itemOption.price,
  outOfStock: itemOption.out_of_stock,
  calories: !Number.isNaN(itemOption.calories) ? Number(itemOption.calories) : undefined,
})
