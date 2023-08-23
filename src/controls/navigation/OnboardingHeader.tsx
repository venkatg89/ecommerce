import React from 'react'
import { StackHeaderProps as HeaderProps } from 'react-navigation-stack'

import styled from 'styled-components/native'

import ProgressBar from 'src/controls/progress/ProgressBar'
import Header from './Header'

type Props = {
  headerProps: HeaderProps
}


const Container = styled.View``


const OnboardingHeader = ({ headerProps }:Props) => {
  const { routes } = headerProps.navigation.state
  const navRoutes = headerProps.navigation.state.routes[routes.length - 1].routes || []
  const index = navRoutes.length ? navRoutes[0].index : 0
  return (
    <Container>
      <Header headerProps={ headerProps } />
      { index === 1 && <ProgressBar start="60%" end="90%" /> }
    </Container>

  )
}

export default OnboardingHeader
