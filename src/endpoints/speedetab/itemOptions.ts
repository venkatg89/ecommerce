import speedetabApiRequest from 'src/apis/speedetab'

import { CafeItemOption } from 'src/models/CafeModel/ItemsModel'
import { itemOptionNormalizer } from 'src/helpers/api/cafe/itemOptionNormalizer'

interface CafeItemOptionsParams {
  menuId: string
  addonGroupId: string;
}

export const getCafeItemOptions = ({ menuId, addonGroupId }: CafeItemOptionsParams) => speedetabApiRequest({
  method: 'GET',
  endpoint: `/users/v1/menus/${menuId}/addon_groups/${addonGroupId}/addons`,
})

export const normalizeCafeItemOptionsResponseData = (data: any) => {
  const { addons = [] } = data

  const itemOptions: Record<string, CafeItemOption> = addons.reduce((object, addon) => {
    object[addon.id] = itemOptionNormalizer(addon) // eslint-disable-line
    return object
  }, {})

  const itemOptionIds = addons.map(addon => addon.id)

  return ({
    itemOptions,
    itemOptionIds,
  })
}
