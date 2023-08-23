import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

const Wrapper = styled.View``

const Container = styled.View``

const Gradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ theme }) => -theme.spacing(2)};
  right: ${({ theme }) => -theme.spacing(2)};
`

interface OwnProps {
  style?: any
  children?: React.ReactNode
  showDivider?: boolean
}

type Props = OwnProps

const BackgroundGradient = ({ style, children }: Props) => {
  return (
    <Wrapper >
      <Gradient colors={ ['#FFFFFF', '#F4F4F4'] } />
      <Container style={ style }>
        { children }
      </Container>
    </Wrapper>
  )
}

export default BackgroundGradient
