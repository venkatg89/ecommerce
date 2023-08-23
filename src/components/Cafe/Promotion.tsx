import React, { useState, useEffect } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { CafePromotion } from 'src/models/CafeModel/Promotion'

import FastImage from 'react-native-fast-image'

const Container = styled.View`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface OwnProps {
  style?: any
  promotion: CafePromotion
}

type Props = OwnProps

const Promotion = ({ style, promotion }: Props) => {
  const [imageStyle, setImageStyle] = useState({ width: 0, height: 0 })
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    Image.getSize(promotion.bannerImage,  (width, height) => {
      const ratio = height / width
      setImageStyle({ width: containerWidth, height: containerWidth * ratio })
    })
  }, [promotion.bannerImage, containerWidth])

  const measureView = (event) => {
    setContainerWidth(event.nativeEvent.layout.width)
  }

  return (
    <Container style={ style } onLayout={ measureView }>
      <FastImage
        resizeMode="contain"
        style={ imageStyle }
        source={{ uri: promotion.bannerImage }}
      />
    </Container>
  )
}

export default Promotion
