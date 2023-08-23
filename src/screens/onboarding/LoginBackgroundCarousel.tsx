import React, { useRef, useState } from 'react'
import { StyleSheet, Dimensions, Animated, Platform } from 'react-native'
import Carousel from 'react-native-looped-carousel'
import styled from 'styled-components/native'
import LoginBackgroundLottiePage from './LoginBackgroundLottiePage'
import { logInImages } from 'assets/images'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const delay = 5000

const ContainerView = styled.View`
  align-items: center;
  flex: 1;
`

const styles = StyleSheet.create({
  lottieStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageStyle: {
    height: SCREEN_HEIGHT,
    aspectRatio: Platform.OS === 'android' ? 0.56 : 0.58,
  },
})

const LoginBackgroundCarousel = ({ logoYPosition, layoutHeight }) => {
  const opacityDetailsOne = useRef(new Animated.Value(0)).current
  const opacityDetailsTwo = useRef(new Animated.Value(0)).current
  const opacityDetailsThree = useRef(new Animated.Value(0)).current

  const translateY = 20
  const duration = 600
  const marginTopOne = useRef(new Animated.Value(translateY)).current
  const marginTopTwo = useRef(new Animated.Value(translateY)).current
  const marginTopThree = useRef(new Animated.Value(translateY)).current

  const [curPage, setCurPage] = useState(0)

  const onImageLoad = (ev: any) => {
    onPageChange(0)
  }

  const selectAnimation = (pageNum) => {
    let fadeAnim
    let verticalTranslation
    switch (pageNum) {
      case 0:
        fadeAnim = opacityDetailsOne
        verticalTranslation = marginTopOne
        break
      case 1:
        fadeAnim = opacityDetailsTwo
        verticalTranslation = marginTopTwo
        break
      case 2:
        fadeAnim = opacityDetailsThree
        verticalTranslation = marginTopThree
        break
    }
    return [fadeAnim, verticalTranslation]
  }

  const onPageChange = (newPage) => {
    let oldPage = curPage
    setCurPage(newPage)
    let [fadeOut, moveUpward] = selectAnimation(oldPage)
    let [fadeIn, moveDownward] = selectAnimation(newPage)
    Animated.timing(fadeOut, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start()
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveUpward, {
      toValue: translateY,
      duration: duration,
      useNativeDriver: true,
    }).start()
    Animated.timing(moveDownward, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start()
  }

  return (
    <ContainerView>
      <Carousel
        delay={delay}
        style={styles.imageStyle}
        autoplay={true}
        currentPage={0}
        onAnimateNextPage={onPageChange}
      >
        <LoginBackgroundLottiePage
          title="Welcome to the B&N App!"
          description="Make sure you're always booked."
          lottieAsset={logInImages.lotties.shopping}
          imageAsset={logInImages.images.backgrounds.right}
          onImageLoad={onImageLoad}
          animationStyle={{
            opacity: opacityDetailsOne,
            transform: [{ translateY: marginTopOne }],
          }}
          logoYPosition={logoYPosition}
        />
        <LoginBackgroundLottiePage
          title="Need a Pick-Me-Up?"
          description="Place a Café order on the go and skip the line!"
          lottieAsset={logInImages.lotties.cafe}
          imageAsset={logInImages.images.backgrounds.left}
          animationStyle={{
            opacity: opacityDetailsTwo,
            transform: [{ translateY: marginTopTwo }],
          }}
          logoYPosition={logoYPosition}
        />
        <LoginBackgroundLottiePage
          title="Membership Made Easy"
          description="Get easy access to your B&N Membership Card and enjoy exclusive member benefits!"
          lottieAsset={logInImages.lotties.member}
          imageAsset={logInImages.images.backgrounds.middle}
          animationStyle={{
            opacity: opacityDetailsThree,
            transform: [{ translateY: marginTopThree }],
          }}
          logoYPosition={logoYPosition}
        />
      </Carousel>
    </ContainerView>
  )
}

export default LoginBackgroundCarousel
