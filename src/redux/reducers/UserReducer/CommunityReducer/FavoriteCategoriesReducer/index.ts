import { Reducer } from 'redux'

import { SET_MY_FAVORITE_CATEGORIES } from 'src/redux/actions/user/community/favoriteCategoriesAction'

export type FavoriteCategoriesState = number[]

const DEFAULT: FavoriteCategoriesState = []

const favoriteCategories: Reducer<FavoriteCategoriesState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MY_FAVORITE_CATEGORIES: {
      return action.payload
    }

    default:
      return state
  }
}

export default favoriteCategories
