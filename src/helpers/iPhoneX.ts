import { Dimensions, Platform } from 'react-native'

const X_HEIGHT = 812
const XSMAX_HEIGHT = 896

const isX = () => {
  const { width, height } = Dimensions.get('window')
  return (width === X_HEIGHT || height === X_HEIGHT)
}

const isXSMax = () => {
  const { width, height } = Dimensions.get('window')
  return (width === XSMAX_HEIGHT || height === XSMAX_HEIGHT)
}

export const isIPhoneX = () => (
  Platform.OS === 'ios' &&
    (isX() || isXSMax())
)
