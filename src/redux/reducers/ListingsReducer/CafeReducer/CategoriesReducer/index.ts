import { Reducer } from 'redux'

import { SET_CAFE_CATEGORIES } from 'src/redux/actions/cafe/categoriesAction'

// menu => categories
export type CategoriesState = Record<string, string[]>

const DEFAULT: CategoriesState = {}

const categories: Reducer<CategoriesState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_CAFE_CATEGORIES: {
      const { menuId, categoryIds } = action.payload

      return ({
        ...state,
        [menuId]: categoryIds,
      })
    }

    default:
      return state
  }
}

export default categories
