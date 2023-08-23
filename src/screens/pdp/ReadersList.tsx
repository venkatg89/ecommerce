import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import _MembersList from 'src/components/MembersList'
import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import _ScreenHeader from 'src/components/ScreenHeader'

import { Params } from 'src/constants/routes'

import { fetchMembersAction } from 'src/redux/actions/communities/fetchMemberAction'
import { fetchMemberApiRequestSelector } from 'src/redux/selectors/apiStatus/user'
import { currentlyReadingUserIdsFromWorkIdSelector } from 'src/redux/selectors/pdpSelector'
import { RequestStatus } from 'src/models/ApiStatus'

const NUMBER_PER_FETCH = 20

const ScreenHeader = styled(_ScreenHeader)`
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const MembersList = styled(_MembersList)`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  currentlyReadingUserIds: string[]
  apiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  currentlyReadingUserIds: (state, ownProps) => {
    const workId = ownProps.navigation.getParam(Params.WORK_ID)
    return currentlyReadingUserIdsFromWorkIdSelector(state, { workId })
  },
  apiStatus: (state) => fetchMemberApiRequestSelector(state),
})

interface DispatchProps {
  fetchMembers: (uids: string[]) => void
  // fetchBookCurrentlyReadingUsers: (workId: string) => void; // TODO?
}

const dispatcher = (dispatch) => ({
  fetchMembers: (uids) => dispatch(fetchMembersAction(uids)),
  // fetchBookCurrentlyReadingUsers: workId => dispatch(fetchBookCurrentlyReadingUsersAction({ workId })),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const ReadersListScreen = ({
  currentlyReadingUserIds,
  fetchMembers,
  apiStatus,
}: Props) => {
  const [paginationState, setPaginationState] = useState<number>(0)

  const fetchMembersWrapper = useCallback(() => {
    const membersToFetch = currentlyReadingUserIds.slice(
      paginationState * NUMBER_PER_FETCH,
      (paginationState + 1) * NUMBER_PER_FETCH,
    )
    fetchMembers(membersToFetch)
    setPaginationState(paginationState + 1)
  }, [paginationState, currentlyReadingUserIds])

  const fetching = apiStatus === RequestStatus.FETCHING

  const onEndReached = useCallback(() => {
    if (
      !fetching &&
      paginationState * NUMBER_PER_FETCH < currentlyReadingUserIds.length
    ) {
      fetchMembersWrapper()
    }
  }, [fetching, paginationState, currentlyReadingUserIds.length])

  useEffect(() => {
    if (
      !fetching &&
      paginationState * NUMBER_PER_FETCH < currentlyReadingUserIds.length
    ) {
      fetchMembersWrapper()
    }
  }, [paginationState, fetching, currentlyReadingUserIds.length])

  return (
    <Container>
      <ScreenHeader header="Currently Reading" />
      <MembersList
        memberIds={currentlyReadingUserIds.slice(
          0,
          (paginationState + 1) * NUMBER_PER_FETCH,
        )}
        fetching={apiStatus === RequestStatus.FETCHING}
        onEndReached={onEndReached}
      />
    </Container>
  )
}

ReadersListScreen.navigationOptions = ({ navigation }) => ({
  title: 'Currently reading',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(ReadersListScreen)
