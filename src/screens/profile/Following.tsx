import React, { useEffect, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import MembersList from 'src/components/MembersList'

import { RequestStatus } from 'src/models/ApiStatus'
import { Params } from 'src/helpers/navigationService'

import { fetchUserFollowingAction, fetchMoreUserFollowingAction } from 'src/redux/actions/user/community/followingAction'
import { userFollowingApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'
import { getUserFollowingListSelector } from 'src/redux/selectors/userSelector'
import { useResponsiveDimensions, getScrollHorizontalPadding } from 'src/constants/layout'

interface StateProps {
  followingList: string[];
  followingRequestStatus: Nullable<RequestStatus>;
}

interface ContainerProps {
  currentWidth: number
}

const Container = styled(_Container)<ContainerProps>`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

const HedaerText = styled.Text`
   ${({ theme }) => theme.typography.heading2};
   color: ${({ theme }) => theme.palette.grey1};
   margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const selector = createStructuredSelector({
  followingList: (state, ownProps) => {
    const uid = ownProps.navigation.getParam(Params.MILQ_MEMBER_UID)
    return getUserFollowingListSelector(state, { uid })
  },
  followingRequestStatus: (state, ownProps) => {
    const uid = ownProps.navigation.getParam(Params.MILQ_MEMBER_UID)
    return userFollowingApiRequestStatusSelector(state, { uid })
  },
})

interface DispatchProps {
  fetchFollowing: (uid: string) => void;
  fetchMoreFollowing: (uid: string) => void;
}

const dispatcher = dispatch => ({
  fetchFollowing: uid => dispatch(fetchUserFollowingAction(uid)),
  fetchMoreFollowing: uid => dispatch(fetchMoreUserFollowingAction(uid)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const FollowingScreen = ({ navigation, followingList, fetchFollowing, fetchMoreFollowing, followingRequestStatus }: Props) => {
  const uid = navigation.getParam(Params.MILQ_MEMBER_UID)
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    fetchFollowing(uid)
  }, [])

  const header = useMemo(() => (
    <HedaerText>Following</HedaerText>
  ), [])

  const fetchUser = useCallback(() => {
    fetchFollowing(uid)
  }, [uid])

  const fetchMoreUser = useCallback(() => {
    fetchMoreFollowing(uid)
  }, [uid])

  return (
    <Container currentWidth={ width }>
      <MembersList
        header={ header }
        memberIds={ followingList }
        fetching={ followingRequestStatus === RequestStatus.FETCHING }
        onRefresh={ fetchUser }
        onEndReached={ fetchMoreUser }
      />
    </Container>
  )
}

FollowingScreen.navigationOptions = () => ({
  title: 'Following',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(FollowingScreen)
