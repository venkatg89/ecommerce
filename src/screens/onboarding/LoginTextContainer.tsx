import React from 'react'
import styled from 'styled-components/native'
import DescriptionText from './DescriptionText'
import TitleText from './TitleText'
import { Animated } from 'react-native'

interface ContainerProps {
  layoutHeight: number
}

const TextContainer = styled<ContainerProps>(Animated.View)`
  align-items: center;
  flex: 1;
  position: absolute;
  z-index: 2;
  opacity: 1;
`

const LoginTextContainer = ({
  title,
  description,
  passRef = null,
  style = {},
}) => {
  return (
    <TextContainer ref={passRef} style={{ ...style }}>
      <TitleText>{title}</TitleText>
      <DescriptionText>{description}</DescriptionText>
    </TextContainer>
  )
}

export default LoginTextContainer
