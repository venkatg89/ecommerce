import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import DeviceInfo from 'react-native-device-info'

import { nav } from 'assets/images'
import HeaderContainer from 'src/controls/layout/HeaderContainer'

import { Routes } from 'src/helpers/navigationService'

const Wrapper = styled(View)`
  flex-direction: row;
  padding: ${(props) => props.theme.spacing(2)}px;
  ${({ theme }) =>
    DeviceInfo.isTablet() &&
    `padding-left: ${theme.spacing(4)}px; padding-right: ${theme.spacing(
      4,
    )}px;`}
  border-bottom-width: 1;
  border-bottom-color: ${(props) => props.theme.palette.disabledGrey};
`

const BackButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const BackButtonText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  flex: 1;
  margin-left: ${(props) => props.theme.spacing(2)};
`

const BackIcon = styled.Image`
  height: ${(props) => props.theme.spacing(4)};
  width: ${(props) => props.theme.spacing(4)};
`

interface Props {
  style?: any
  headerProps: any
  ctaComponent?: React.ReactNode
  onPressBack?
}

// Since we use the title as the back button title, the back button will always be the the title
// override these cases with sub tabs with a different title
export const getBackButtontitle = (scene) => {
  try {
    switch (scene.route.routeName) {
      case Routes.HOME__DISCOVERY: {
        return 'Discovery'
      }
      case Routes.HOME__WHATS_NEW: {
        return 'Social'
      }
      case Routes.COMMUNITY__QUESTIONS: {
        return 'Questions'
      }
      case Routes.COMMUNITY__CHOOSE_CATEGORIES: {
        return 'Genres'
      }
      case Routes.MY_BOOKS__LISTS_AND_COLLECTIONS: {
        return 'Lists'
      }
      case Routes.MY_BOOKS__NOOK_LIBRARY: {
        return 'NOOK Library'
      }
      case Routes.MY_BN__STORE_DETAILS:
      case Routes.CART__STORE_DETAILS:
      case Routes.CAFE__STORE_DETAILS: {
        return scene.route.params.store_name
      }
      case Routes.MY_BN__MEMBERSHIP: {
        return 'Membership'
      }
      case Routes.MY_BN__SEARCH_STORE:
      case Routes.CAFE__SEARCH_VENUES: {
        return 'Store Search'
      }
      case Routes.CAFE__CHECKOUT: {
        return 'Checkout'
      }
      case Routes.PDP__MAIN: {
        return scene.route.params._title
      }
      case Routes.PDP__AUTHOR_DETAILS:
      case Routes.PDP__CONTRIBUTORS: {
        return scene.route.params._authorName
      }
      case Routes.WEBVIEW__WITH_SESSION: {
        return scene.route.params.webview_title
      }
      default:
        break
    }
  } catch {
    /* */
  }

  return scene?.descriptor?.options?.title || 'Back'
}

// Since the main home screen always uses the MainHeader which doesnt have a back button
// we can always show the backbutton to allow goBack to another tab incase
const Header = ({ style, headerProps, ctaComponent, onPressBack }: Props) => {
  const {
    navigation: { pop },
  } = headerProps
  const prevScene: any = headerProps.previous // scenes[Math.max(0, index - 1)]
  const backButtonTitle = getBackButtontitle(prevScene)
  const onPress = onPressBack || pop
  return (
    <HeaderContainer>
      <Wrapper>
        <BackButton
          accessibilityLabel={`back to ${backButtonTitle} button`}
          onPress={() => onPress()}
        >
          <BackIcon source={nav.topBar.back} />
          <BackButtonText numberOfLines={1}>{backButtonTitle}</BackButtonText>
        </BackButton>
        {ctaComponent}
      </Wrapper>
    </HeaderContainer>
  )
}

export default Header
