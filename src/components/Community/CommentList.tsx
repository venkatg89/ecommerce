import React from 'react'
import { connect } from 'react-redux'
import { FlatList, ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import CommentItem from 'src/components/Community/CommentItem'
import { commentListSelector } from 'src/redux/selectors/communities/questionsSelector'
import { AnswerId, CommentId, CommentRecords, CommentModel } from 'src/models/Communities/AnswerModel'
import { recommendBookCommentsApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { RequestStatus } from 'src/models/ApiStatus'

const Container = styled.View`
  margin-top: 8;
  margin-bottom: 8;
`

const EmptyText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey3};
`

const EmptyContainer = styled.View`
  align-items: center;
  flex: 1;
`

interface OwnProps {
  hideComments: boolean
  answerId: AnswerId
  onShowReply: (commentId: CommentId) => void
  currentCommentId: CommentId
  listRef?
  header: React.ReactNode
  editComment: (comment:CommentModel, parentId: CommentId) => void
}

interface StateProps {
  comments: CommentRecords
  recommendBookCommentsApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  comments: commentListSelector,
  recommendBookCommentsApiStatus: (state, props) => {
    const ownProps = props as OwnProps
    const id = ownProps.answerId
    return recommendBookCommentsApiStatusSelector(state, { id })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

class CommentList extends React.Component<Props> {
  scrollToBottom = () => {
    const { listRef } = this.props
    if (listRef) {
      listRef.current.scrollToEnd()
    }
  }

  render() {
    const { comments, onShowReply, recommendBookCommentsApiStatus, hideComments, currentCommentId, header, listRef, editComment } = this.props
    const fetching = recommendBookCommentsApiStatus === RequestStatus.FETCHING
    return (
      <FlatList
        ref={ listRef }
        onContentSizeChange={ this.scrollToBottom }
        ListHeaderComponent={ (
          <View>
            { header }
            { fetching && !hideComments && (
              <Container>
                <ActivityIndicator size="large" animating={ fetching } />
              </Container>
            ) }
          </View>
        ) }
        data={ Object.values(comments).filter(comment => comment.text !== '') }
        keyExtractor={ item => `${item.id}` }
        renderItem={ ({ item }) => (
          <CommentItem currentCommentId={ currentCommentId } comment={ item } onShowReply={ onShowReply } editComment={ editComment } />
        ) }
        ListEmptyComponent={
          (!fetching && !hideComments && (
            <EmptyContainer>
              <EmptyText>No Comments</EmptyText>
            </EmptyContainer>
          )) ||
          undefined
        }
      />
    )
  }
}

export default connector(CommentList)
