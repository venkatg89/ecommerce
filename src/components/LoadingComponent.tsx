import React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator } from 'react-native'

const Container = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgb(52, 50, 42);
`


const RootComponent = () => (
  <Container>
    <ActivityIndicator animating size="large" />
  </Container>
)

export default RootComponent
