import { ThemeNames } from 'src/constants/theme'

import DEFAULT_THEME from './default'

export interface Palette {
  primaryGreen: HexColor
  linkGreen: HexColor
  secondaryBlue: HexColor
  supportingError: HexColor
  supportWarning: HexColor
  white: HexColor
  black: HexColor
  disabledGrey: HexColor
  lightGrey: HexColor
  lightDisabledGrey: HexColor
  moderateRed: HexColor
  grey1: HexColor
  grey2: HexColor
  grey3: HexColor
  grey4: HexColor
  grey5: HexColor
  beige: HexColor
  tan: HexColor
  couponGreen: HexColor
  gold: HexColor
  lightYellow: HexColor
}
export interface Typography {
  tab: {
    fontSize: number
    fontFamily: string
    letterSpacing: number
  }
  heading1: {
    fontSize: number
    fontFamily: string
    letterSpacing: number
  }
  heading2: {
    fontSize: number
    fontFamily: string
    letterSpacing: number
  }
  heading3: {
    fontSize: number
    fontFamily: string
    letterSpacing: number
  }
  title: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  subTitle1: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  subTitle2: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  body1: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  body2: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  caption: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  button: {
    small: {
      fontFamily: string
      fontSize: number
      letterSpacing: number
    }
    regular: {
      fontFamily: string
      fontSize: number
      letterSpacing: number
    }
  }
  navigation: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
  specialHeading: {
    fontFamily: string
    fontSize: number
    letterSpacing: number
  }
}

export interface BoxShadow {
  container: any
  button?: any
}

export interface ThemeModel {
  palette: Palette
  typography: Typography
  spacing: (number: number) => number
  boxShadow: BoxShadow
  innerBoxShadow: BoxShadow
  layout: {
    bg: HexColor
    header: {
      bg: HexColor
    }
    body: {
      bg: HexColor
    }
  }
  list: {
    separatorLine: HexColor
  }
  border: {
    color: HexColor
  }
  control: {
    button: {
      bg: HexColor
      light: HexColor
    }
  }
  font: {
    default: HexColor
    inactive: HexColor
    light: HexColor
    active: HexColor
  }
}

const Themes: Record<string, ThemeModel> = {
  [ThemeNames.DEFAULT]: DEFAULT_THEME,
}

export default Themes
