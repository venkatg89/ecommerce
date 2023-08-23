import React from 'react'
import { Image, StyleSheet, Dimensions, View, Platform } from 'react-native'
import LottieView from 'lottie-react-native'
import LoginTextContainer from './LoginTextContainer'

const SCREEN_HEIGHT = Dimensions.get('screen').height

const styles = StyleSheet.create({
  lotteView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  lotteViewContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    height: SCREEN_HEIGHT,
    aspectRatio: Platform.OS === 'android' ? 0.56 : 0.58,
  },
})
const LoginBackgroundLottiePage = ({
  passRef = null,
  style = {},
  onLayout = () => {},
  title = '',
  description = '',
  imageAsset,
  lottieAsset = '',
  onImageLoad = (ev: any) => {},
  animationStyle = {},
  logoYPosition,
}) => {
  return (
    <View onLayout={onLayout} style={{ ...styles.container, ...style }}>
      <Image source={imageAsset} style={styles.image} onLoad={onImageLoad} />
      <View style={{ ...styles.lotteViewContainer }}>
        <LottieView
          style={{ ...styles.lotteView }}
          ref={passRef}
          source={lottieAsset}
          imageAssetsFolder={'lotties'}
          autoPlay
          loop
        />
      </View>
      <LoginTextContainer
        title={title}
        description={description}
        style={{...animationStyle, top:logoYPosition}}
      />
    </View>
  )
}

export default LoginBackgroundLottiePage
