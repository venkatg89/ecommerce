import React from 'react'
import { connect } from 'react-redux'
import { FlatList, ActivityIndicator } from 'react-native'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { AnswerId } from 'src/models/Communities/AnswerModel'
import RecommendedUserListItem from './RecommendedUserListItem'
import { membersForAnswerSelector } from 'src/redux/selectors/communities/MemberSelector'
import { ProfileModel } from 'src/models/UserModel'


const LoadingContainer = styled.View`
  flex: 1;
`
interface OwnProps {
  answerId: AnswerId,
}

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  members: ProfileModel[],
}

const selector = createStructuredSelector({
  members: membersForAnswerSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

class RecommendedUserList extends React.Component<Props> {
  render() {
    const { members } = this.props
    if (members.length < 1) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" />
        </LoadingContainer>
      )
    }

    return (
      <FlatList
        keyExtractor={ item => item.uid }
        data={ members }
        renderItem={ ({ item }) => <RecommendedUserListItem member={ item } /> }
        ItemSeparatorComponent={ Spacing }
      />
    )
  }
}

export default connector(RecommendedUserList)
