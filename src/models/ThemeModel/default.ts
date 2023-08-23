import { Platform } from 'react-native'
import { ThemeModel, Palette, Typography, BoxShadow } from '.'

const DEFAULT_PALETTE: Palette = {
  primaryGreen: '#346250',
  linkGreen: '#347d56',
  secondaryBlue: '#3d6db5',
  supportingError: '#dd2612',
  supportWarning: '#f4cc63',
  white: '#ffffff',
  black: '#000000',
  moderateRed: '#cc6666',
  disabledGrey: '#dddddd',
  lightGrey: '#fafafa',
  lightDisabledGrey: '#eeeeee',
  grey1: '#21282d',
  grey4: '#a3a6a8',
  grey2: '#454f56',
  grey3: '#6f7980',
  grey5: '#d3d4d5',
  tan: '#E1D9C9',
  beige: '#E1D9C9',
  couponGreen: '#c3efc5',
  gold: '#f2a80c',
  lightYellow: '#fefbf3',
}

const DEFAULT_TYPOGRAPHY: Typography = {
  tab: {
    fontSize: 16,
    fontFamily: 'Lato-Heavy',
    letterSpacing: 0.4,
  },
  heading1: {
    fontSize: 28,
    fontFamily: 'PoynterOSDisp-Bold',
    letterSpacing: 0.7,
  },
  heading2: {
    fontSize: 24,
    fontFamily: 'PoynterOSDisp-Semibold',
    letterSpacing: 0.7,
  },
  heading3: {
    fontSize: 20,
    fontFamily: 'PoynterOSDisp-Semibold',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.0,
  },
  subTitle1: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.4,
  },
  subTitle2: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    letterSpacing: 0.4,
  },
  body1: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.4,
  },
  body2: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.4,
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    letterSpacing: 0.2,
  },
  button: {
    small: {
      fontFamily: 'Lato-Bold',
      fontSize: 12,
      letterSpacing: 1.4,
    },
    regular: {
      fontFamily: 'Lato-Bold',
      fontSize: 14,
      letterSpacing: 1.4,
    },
  },
  navigation: {
    fontFamily: 'Lato-Medium',
    fontSize: 11,
    letterSpacing: 0.14,
  },
  specialHeading: {
    fontSize: 20,
    fontFamily: 'PoynterOSDisp-BoldItalic',
    letterSpacing: 0.5,
  },
}

const iosShadow = {
  container: `
    background-color: #ffffff;
    border-width: 1;
    border-color: #dddddd;
    shadow-offset: 0px 3px;
    shadow-radius: 2;
    shadow-opacity: 0.12;
    shadow-color: #000000;
`,
  button: `
    background-color: #ffffff;
    shadow-offset: 0px 4px;
    shadow-radius: 9;
    shadow-opacity: 0.20;
    shadow-color: #000000;
`,
}

const innerBoxShadow = {
  container: `
  background-color: transparent;
  border-color: #ffffff;
  border-top-width: 8;
  border-bottom-width: 8;
  overflow: hidden;
  shadow-offset: 0px 1px;
  shadow-color: #000000;
  shadow-radius: 5;
  shadow-opacity: 0.18;
`,
}

const DEFAULT_BOX_SHADOW: BoxShadow = {
  container: Platform.OS === 'ios' ? iosShadow.container : 'elevation: 1;',
  button: Platform.OS === 'ios' ? iosShadow.button : 'elevation: 1;',
}
const DEFAULT_INNER_BOX_SHADOW: BoxShadow = {
  container: Platform.OS === 'ios' ? innerBoxShadow.container : 'elevation: 5;',
}

const DEFAULT: ThemeModel = {
  palette: DEFAULT_PALETTE,
  typography: DEFAULT_TYPOGRAPHY,
  spacing: (number) => number * 8,
  boxShadow: DEFAULT_BOX_SHADOW,
  innerBoxShadow: DEFAULT_INNER_BOX_SHADOW,
  layout: {
    bg: '#fff',
    header: {
      bg: 'green',
    },
    body: {
      bg: 'pink',
    },
  },
  list: {
    separatorLine: '#515253',
  },
  border: {
    color: '#979797',
  },
  control: {
    button: {
      bg: 'black',
      light: '#E3E3E3',
    },
  },
  font: {
    default: '#515253',
    inactive: '#6f7980',
    light: '#B3AEB1',
    active: '#347d56',
  },
}

export default DEFAULT
