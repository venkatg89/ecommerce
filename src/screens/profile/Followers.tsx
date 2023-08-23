import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import _MembersList from 'src/components/MembersList'

import { RequestStatus } from 'src/models/ApiStatus'
import { Params } from 'src/helpers/navigationService'

import { fetchUserFollowersAction, fetchMoreUserFollowersAction } from 'src/redux/actions/user/community/followersAction'
import { userFollowersApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/user'
import { getUserFollowersListSelector } from 'src/redux/selectors/userSelector'
import { useResponsiveDimensions, getScrollHorizontalPadding } from 'src/constants/layout'

interface ContainerProps {
  currentWidth: number
}

const Container = styled(_Container)<ContainerProps>`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  followersList: string[];
  followersRequestStatus: Nullable<RequestStatus>;
}

const selector = createStructuredSelector({
  followersList: (state, ownProps) => {
    const uid = ownProps.navigation.getParam(Params.MILQ_MEMBER_UID)
    return getUserFollowersListSelector(state, { uid })
  },
  followersRequestStatus: (state, ownProps) => {
    const uid = ownProps.navigation.getParam(Params.MILQ_MEMBER_UID)
    return userFollowersApiRequestStatusSelector(state, { uid })
  },
})

const MembersList = styled(_MembersList)`
`

interface DispatchProps {
  fetchFollowers: (uid: string) => void;
  fetchMoreFollowers: (uid: string) => void;
}

const dispatcher = dispatch => ({
  fetchFollowers: uid => dispatch(fetchUserFollowersAction(uid)),
  fetchMoreFollowers: uid => dispatch(fetchMoreUserFollowersAction(uid)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const FollowersScreen = ({ navigation, followersList, fetchFollowers, fetchMoreFollowers, followersRequestStatus }: Props) => {
  const uid = navigation.getParam(Params.MILQ_MEMBER_UID)
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    fetchFollowers(uid)
  }, [])

  const header = useMemo(() => <HeaderText>Followers</HeaderText>, [])

  return (
    <Container currentWidth={ width }>
      <MembersList
        header={ header }
        memberIds={ followersList }
        fetching={ followersRequestStatus === RequestStatus.FETCHING }
        onRefresh={ () => { fetchFollowers(uid) } }
        onEndReached={ () => { fetchMoreFollowers(uid) } }
      />
    </Container>
  )
}

FollowersScreen.navigationOptions = () => ({
  title: 'Followers',
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default connector(FollowersScreen)
