import React, { Fragment } from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator } from 'react-native'

const LoadingContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(2)};
`
interface OwnProps {
  isLoading: boolean
  style?: any
  color?: any
}

type Props = OwnProps

const LoadingIndicator = ({ isLoading, style, color }: Props) => {
  if (isLoading) {
    return (
      <LoadingContainer style={style}>
        <ActivityIndicator size="large" animating={isLoading} color={color} />
      </LoadingContainer>
    )
  }
  return <Fragment />
}

export default LoadingIndicator
