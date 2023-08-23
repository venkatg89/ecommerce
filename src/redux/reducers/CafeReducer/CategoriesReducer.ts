import { Reducer } from 'redux'

import { CafeCategory } from 'src/models/CafeModel/CategoryModel'

import { SET_CAFE_CATEGORIES } from 'src/redux/actions/cafe/categoriesAction'

export type CategoriesState = Record<string, CafeCategory>

const DEFAULT: CategoriesState = {}

const _categories: Reducer<CategoriesState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_CATEGORIES: {
      const { categories } = action.payload

      return ({
        ...state,
        ...categories,
      })
    }

    default:
      return state
  }
}

export default _categories
