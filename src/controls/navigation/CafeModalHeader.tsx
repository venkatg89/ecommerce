import React, { useEffect, useState } from 'react'
import { StackHeaderProps as HeaderProps } from 'react-navigation-stack'
import { getBackButtontitle } from 'src/controls/navigation/Header'

import styled from 'styled-components/native'

import { icons, nav } from 'assets/images'
import { HEADER_HEIGHT } from 'src/constants/layout'
import { goBack, popToTop } from 'src/helpers/navigationService'

const Container = styled.View`
  position: relative;
  background-color: 'rgb(255,255,255)';
`

const Wrapper = styled.View`
  height: ${HEADER_HEIGHT};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 20;
  margin-right: 20;
`

const Title = styled.Text`
  /* color: #333;
  font-size: 16;*/
  font-weight: bold;
  ${({ theme }) => theme.typography.heading1};
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
  height: 25;
  width: 25;
`

const Icon = styled.Image`
  height: 25;
  width: 25;
`

const DraggableHandle = styled.View`
  position: absolute;
  top: ${({ theme }) => theme.spacing(1)};
  align-self: center;
  height: ${({ theme }) => theme.spacing(0.5)};
  width: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.palette.grey5};
  border-radius: 2;
`

interface Props {
  style?: any
  headerProps: HeaderProps
}

const CafeModalHeader = ({ style, headerProps }: Props) => {
  const { previous, scene } = headerProps

  const [isFirstInStack, setIsTopLevelScreen] = useState(true)
  useEffect(() => {
    setIsTopLevelScreen(headerProps.navigation.isFirstRouteInParent())
  }, [setIsTopLevelScreen, headerProps.navigation])

  const previousSceneTitle =
    previous?.descriptor?.options?.headerTitle ||
    getBackButtontitle(previous) ||
    'Back'
  const currentSceneTitle = scene.descriptor.options.headerTitle

  return (
    <Container>
      <Wrapper>
        {!isFirstInStack ? (
          <BackButton
            onPress={() => {
              goBack()
            }}
          >
            <Icon source={nav.topBar.back} />
            <BackButtonText numberOfLines={1}>
              {previousSceneTitle}
            </BackButtonText>
          </BackButton>
        ) : (
          <>
            <CloseButton hidden onPress={() => {}} />
            <Title>{currentSceneTitle}</Title>
          </>
        )}
        <CloseButton
          onPress={() => {
            popToTop()
            if (!isFirstInStack) {
              popToTop()
            }
          }}
        >
          <Icon source={icons.close} />
        </CloseButton>
      </Wrapper>
      <DraggableHandle />
    </Container>
  )
}

export default CafeModalHeader
