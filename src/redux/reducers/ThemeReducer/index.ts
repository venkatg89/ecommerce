import { Reducer } from 'redux'

import { DEFAULT_THEME, ThemeNames } from 'src/constants/theme'

export type ThemeState = ThemeNames

const DEFAULT: ThemeState = DEFAULT_THEME

const theme: Reducer<ThemeState> = (state = DEFAULT, action) => {
  switch (action.type) {
    // case THEME_CHANGE: {
    //   return action.payload
    // }

    default:
      return state
  }
}

export default theme
