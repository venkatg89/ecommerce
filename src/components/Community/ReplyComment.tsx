import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { AnswerId, CommentId, CommentModel } from 'src/models/Communities/AnswerModel'
import { commentSelector } from 'src/redux/selectors/communities/questionsSelector'
import AddComment from 'src/components/Community/AddComment'

interface OwnProps {
  answerId: AnswerId
  commentId: CommentId
  postComment: (value: string) => void
}
interface StateProps {
  comment: CommentModel,
}

const selector = createStructuredSelector({
  comment: commentSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

class ReplyComment extends React.Component<Props> {
  render() {
    const { comment, postComment } = this.props
    return (
      <AddComment postComment={ postComment } label={ `REPLYING TO ${comment.creator.name}` } />
    )
  }
}

export default connector(ReplyComment)
