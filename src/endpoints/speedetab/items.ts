import speedetabApiRequest from 'src/apis/speedetab'

import { CafeItem } from 'src/models/CafeModel/ItemsModel'
import { itemNormalizer } from 'src/helpers/api/cafe/itemNormalizer'

interface CafeItemsParams {
  menuId: string;
  categoryId: string;
}

export const getCafeItems = ({ menuId, categoryId }: CafeItemsParams) => speedetabApiRequest({
  method: 'GET',
  endpoint: `/users/v1/menus/${menuId}/categories/${categoryId}/items`,
})

export const normalizeCafeItemsResponseData = (data: any) => {
  const { items = [] } = data

  const _items: Record<string, CafeItem> = items.reduce((object, item) => {
    object[item.id] = itemNormalizer(item) // eslint-disable-line
    return object
  }, {})

  const itemIds = items.map(item => item.id)

  return ({
    items: _items,
    itemIds,
  })
}
