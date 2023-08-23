import { useEffect, useState } from 'react'
import { Dimensions, Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { isIPhoneX } from 'src/helpers/iPhoneX'
import { ThemeModel } from 'src/models/ThemeModel'

const { width } = Dimensions.get('screen')

const Tablet = {
  HORIZONTAL_PADDING_PCT: 0.15885,
  BUTTON_MAXWIDTH_PCT: 0.4466,
}

export const useResponsiveDimensions = () => {
  const [dimension, setDimension] = useState(Dimensions.get('screen'))

  useEffect(() => {
    const handleSetDimension = (dims) => {
      setDimension(dims.screen)
    }

    Dimensions.addEventListener('change', handleSetDimension)
    return () => {
      Dimensions.removeEventListener('change', handleSetDimension)
    }
  }, [])
  return dimension
}


export const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? 26 : isIPhoneX() ? 44 : 20
export const HEADER_HEIGHT = 64
export const NAV_BAR_HEIGHT = 64
export const BOTTOM_BAR_HEIGHT = Platform.OS === 'android' ? 0 : isIPhoneX() ? 34 : 0

export const CONTENT_HORIZONTAL_PADDING = (currentWidth = width) => {
  if (DeviceInfo.isTablet()) {
    return currentWidth * Tablet.HORIZONTAL_PADDING_PCT
  }
  return 16
}
export const CONTENT_WIDTH = (currentWidth = width) => currentWidth - 2 * CONTENT_HORIZONTAL_PADDING(currentWidth)

export const CONTENT_VERTICAL_PADDING = 16

export const TABLET_BUTTON_MAXWIDTH = (currentWidth = width) => Tablet.BUTTON_MAXWIDTH_PCT * currentWidth

// New content padding styling
export const getScrollVerticalPadding = (theme: ThemeModel) => theme.spacing(2)
export const getScrollHorizontalPadding = (theme: ThemeModel, currentWidth: number) => {
  if (DeviceInfo.isTablet()) {
    return CONTENT_HORIZONTAL_PADDING(currentWidth)
  }
  return theme.spacing(2)
}

export const getContentContainerStyleWithAnchor = (theme: ThemeModel, currentWidth: number) => ({
  flexGrow: 1,
  paddingTop: getScrollVerticalPadding(theme),
  paddingBottom: getScrollVerticalPadding(theme) + theme.spacing(9),
  paddingHorizontal: CONTENT_HORIZONTAL_PADDING(currentWidth),
})

export const getContentContainerStyle = (currentWidth: number) => ({
  flexGrow: 1,
  paddingVertical: CONTENT_VERTICAL_PADDING,
  paddingHorizontal: CONTENT_HORIZONTAL_PADDING(currentWidth),
})

export const getSuccessToastStyle = (theme: ThemeModel) => ({
  isClosable: true,
  variant: 'outline',
  /* @ts-ignore */
  status: 'success',
  backgroundColor: theme.palette.white,
  _title: {
    color: theme.palette.grey2,
    ...theme.typography.body2,
  },
  width: '95%',
  alignSelf: 'center',
  shadow: 1,
})
