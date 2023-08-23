import React from 'react'
import { StackHeaderProps as HeaderProps } from 'react-navigation-stack'

import styled from 'styled-components/native'

import { icons, nav } from 'assets/images'
import Container from 'src/controls/layout/HeaderContainer'
import { HEADER_HEIGHT } from 'src/constants/layout'
import Routes from 'src/constants/routes'
import { navigate, goBack } from 'src/helpers/navigationService'

const Wrapper = styled.View`
  height: ${HEADER_HEIGHT};
  flex-direction: row;
  align-items: center;
  margin-left: 20;
  margin-right: 20;
`

const Title = styled.Text`
  flex: 1;
  color: #333;
  font-size: 16;
  font-weight: bold;
`

const BackButton = styled.TouchableOpacity`
  max-width: 50%;
  flex-direction: row;
  align-items: center;
`

const BackButtonText = styled.Text`
  margin-left: 9;
  color: #333;
  font-size: 16;
  font-weight: bold;
`

const CloseButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const Icon = styled.Image`
  height: 25;
  width: 25;
`

interface Props {
  style?: any,
  headerProps: HeaderProps;
}

// Show the header if this is the first screen on the stack
// otherwise hide the header and show the back button instead
// the dismiss button is always shown
const ModalHeader = ({ style, headerProps }: Props) => {
  //TODO check the 'blind' StackHeaderProps update/fix
  const { previous, scene } = headerProps
  // if the the scene index is 0, assume it is no longer part of the rootStack and is top level
  // otherwise if the last screen is the root, then assume the current screen should be top level
  const isTopLevelScreen = true //index === 0 || (index > 0 && scenes[index - 1].route.routeName === Routes.ROOT)
  // headerBackTitle is ios only
  const previousSceneTitle = previous?.descriptor?.options?.title || 'Back' //(index > 0 && scenes[index - 1].descriptor.options.title) || 'Back'
  const currentSceneTitle = scene.descriptor.options.title//scenes[index].descriptor.options.title

  return (
    <Container style={ style }>
      <Wrapper>
        { !isTopLevelScreen && (
          <BackButton onPress={ () => { goBack() } }>
            <Icon source={ nav.topBar.back } />
            <BackButtonText numberOfLines={ 1 }>
              { previousSceneTitle }
            </BackButtonText>
          </BackButton>
        )}
        <Title>{ isTopLevelScreen && currentSceneTitle }</Title>
        <CloseButton onPress={ () => { navigate(Routes.ROOT) } }>
          <Icon source={ icons.close } />
        </CloseButton>
      </Wrapper>
    </Container>
  )
}

export default ModalHeader
