import React, { useContext } from 'react'
import { View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { StackHeaderProps as HeaderProps } from 'react-navigation-stack'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ThemeContext } from 'styled-components'
import DeviceInfo from 'react-native-device-info'

import { nav, logInImages } from 'assets/images'
import HeaderContainer from 'src/controls/layout/HeaderContainer'
import { push, Routes } from 'src/helpers/navigationService'
import {
  isUserLoggedInSelector,
  getMyProfileUidSelector,
} from 'src/redux/selectors/userSelector'
import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'
import { ThemeModel } from 'src/models/ThemeModel'

const Title = styled.Text`
  flex: 1;
`

interface ButtonProps {
  space?: boolean
}

const Icon = styled.Image`
  height: ${(props) => props.theme.spacing(4)};
  width: ${(props) => props.theme.spacing(4)};
  border-radius: ${({ theme }) => theme.spacing(2)}px;
`

const Container = styled(HeaderContainer)``

const Wrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${(props) => props.theme.spacing(2)}px;
  ${({ theme }) =>
    DeviceInfo.isTablet() &&
    `padding-left: ${theme.spacing(4)}px; padding-right: ${theme.spacing(
      4,
    )}px;`}
  border-bottom-width: 1;
  border-bottom-color: ${(props) => props.theme.palette.disabledGrey};
  justify-content: space-between;
`

const Button = styled.TouchableOpacity<ButtonProps>`
  margin-left: ${(props) => (props.space ? props.theme.spacing(2) : 0)};
`

const Spacer = styled.View<ButtonProps>`
  width: ${(props) => props.theme.spacing(4)};
  margin-left: ${(props) => (props.space ? props.theme.spacing(2) : 0)};
`

const Image = styled.Image`
  height: ${(props) => props.theme.spacing(2)};
  width: ${(props) => props.theme.spacing(25)};
`

interface OwnProps {
  style?: any
  headerProps: HeaderProps
  showProfileButton?: boolean
  rightComp?: object
  home?: boolean
}

interface StateProps {
  isUserLoggedIn: boolean
  userProfileUid: string | undefined
}

type Props = OwnProps & StateProps & NavigationInjectedProps

const selector = createStructuredSelector({
  isUserLoggedIn: isUserLoggedInSelector,
  userProfileUid: getMyProfileUidSelector,
})

const connector = connect<StateProps, OwnProps>(selector)

const MainHeader = ({
  style,
  headerProps,
  showProfileButton = true,
  isUserLoggedIn,
  userProfileUid,
  navigation,
  rightComp,
  home,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { scene } = headerProps
  const { options } = scene.descriptor

  const _onPress = () => {
    push(Routes.PROFILE__MAIN)
  }

  const _imageSource =
    isUserLoggedIn && userProfileUid
      ? { uri: getProfilePhotoUrl(userProfileUid) }
      : nav.topBar.user

  return (
    <Container style={style}>
      <Wrapper>
        { home ? (
          <>
            <Spacer space />
            <Image source={ logInImages.images.logo} />
          </>
        ) : (
          <Title
            accessibilityRole="header"
            style={theme.typography.heading1}
            numberOfLines={1}
          >
            {options.title}
          </Title>
        ) }
        {showProfileButton ? (
          <Button accessibilityLabel="Profile button" space onPress={_onPress}>
            <Icon source={_imageSource} />
          </Button>
        ) : null}
        {rightComp}
      </Wrapper>
    </Container>
  )
}

export default withNavigation(connector(MainHeader))
