import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps, withNavigation, NavigationParams } from 'react-navigation'
import styled, { ThemeContext } from 'styled-components/native'

import _Button from 'src/controls/Button'

import { toggleFollowUserAction } from 'src/redux/actions/user/community/followingAction'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { setRouteToRedirectPostLoginAction } from 'src/redux/actions/onboarding'
import { isMyFollowerUserSelector, getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

import Routes, { Params } from 'src/constants/routes'

const Button = styled(_Button)`
  ${({ theme, variant }) => (variant === 'contained' ? `background-color: ${theme.palette.secondaryBlue}` : `border-color: ${theme.palette.secondaryBlue}`)};
  padding: 0;
  width: 101;
  height: 24;
`

interface OwnProps {
  style?: any;
  uid: string;
}

interface StateProps {
  isFollowing: boolean;
  myProfileUid?: string;
}

const selector = createStructuredSelector({
  isFollowing: (state, ownProps) => {
    const { uid } = ownProps
    return isMyFollowerUserSelector(state, { uid })
  },
  myProfileUid: getMyProfileUidSelector,
})

interface DispatchProps {
  toggleFollowUser: (uid: string) => void;
  checkIsUserLoggedOutToBreak: () => boolean
  setRedirect: (route: string, params: NavigationParams) => void
}

const dispatcher = dispatch => ({
  toggleFollowUser: uid => dispatch(toggleFollowUserAction(uid)),
  checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
  setRedirect: (route: string, params: NavigationParams) => dispatch(setRouteToRedirectPostLoginAction({ route, params })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps & NavigationInjectedProps

const FollowButton = ({ style, uid, isFollowing, toggleFollowUser, myProfileUid, setRedirect, checkIsUserLoggedOutToBreak, navigation }: Props) => {
  if (myProfileUid === uid) { return null }
  const _onPress = () => {
    if (checkIsUserLoggedOutToBreak()) {
      if (navigation.state.routeName === Routes.SEARCH__MAIN_LEGACY) {return}
      const answerId = navigation.getParam(Params.ANSWER_ID, '')
      const title = navigation.getParam(Params.TITLE, '')
      const route = navigation.state.routeName
      setRedirect(route, { answerId, title })
      return
    }

    toggleFollowUser(uid)
  }
  const { palette } = useContext(ThemeContext)
  const buttonTextStyle = { color: palette.secondaryBlue, textTransform: 'uppercase' }

  return (
    isFollowing
      ? (
        <Button
          style={ style }
          size="small"
          onPress={ _onPress }
          variant="outlined"
          textStyle={ buttonTextStyle }
        >
          Following
        </Button>
      ) : (
        <Button
          style={ style }
          size="small"
          variant="contained"
          onPress={ _onPress }
        >
          Follow
        </Button>
      )
  )
}

export default withNavigation(connector(FollowButton))
