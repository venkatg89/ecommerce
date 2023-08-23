import speedetabApiRequest from 'src/apis/speedetab'

import { CafeCategory } from 'src/models/CafeModel/CategoryModel'
import { categoryNormalizer } from 'src/helpers/api/cafe/categoryNormalizer'

interface CafeCategoriesParams {
  menuId: string;
}

export const getCafeCategories = ({ menuId }: CafeCategoriesParams) => speedetabApiRequest({
  method: 'GET',
  endpoint: `/users/v1/menus/${menuId}/categories`,
})

export const normalizeCafeCategoriesResponseData = (data: any) => {
  const { categories = [] } = data

  const _categories: Record<string, CafeCategory> = categories.reduce((object, category) => {
    object[category.id] = categoryNormalizer(category) // eslint-disable-line
    return object
  }, {})

  const categoryIds = categories.map(category => category.id)

  return ({
    categories: _categories,
    categoryIds,
  })
}
