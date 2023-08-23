import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'

import { icons } from 'assets/images'

import Button from 'src/controls/Button/CtaButton'
import CtaButton from 'src/controls/navigation/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'

import { reportContentAction } from 'src/redux/actions/user/community/flagContentsAction'
import { deleteCommentAction } from 'src/redux/actions/communities/deleteContentActions'

import { AnswerId, CommentId } from 'src/models/Communities/AnswerModel'


interface OwnProps {
  commentId: CommentId;
  accessibilityLabel?: string
  answerId: AnswerId
  parentCommentId?: CommentId
  isMyComment: boolean
  editComment: () => void
}

interface DispatchProps {
  reportComment: (commentId: CommentId) => void
  deleteComment: (commentId: CommentId, answerId: AnswerId, parentCommentId?: number) => void
}


const dispatcher = dispatch => ({
  reportComment: commentId => dispatch(reportContentAction('notes', commentId)),
  deleteComment: (commentId, answerId, parentCommentId) => dispatch(deleteCommentAction(commentId, answerId, parentCommentId)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = OwnProps & DispatchProps

const CommentCta = ({ answerId, commentId, accessibilityLabel, reportComment, deleteComment, parentCommentId, isMyComment, editComment }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggleModal = useCallback(() => setOpen(!isOpen), [isOpen])

  const toggleReport = () => {
    reportComment(commentId)
    toggleModal()
  }

  const handleDeleteComment = () => {
    deleteComment(commentId, answerId, parentCommentId)
    toggleModal()
  }

  const handleEditComment = () => {
    editComment()
    toggleModal()
  }

  return (
    <React.Fragment>
      <CtaButton dots onPress={ toggleModal } />
      <DraggableModal
        isOpen={ isOpen }
        onDismiss={ toggleModal }
      >
        { isMyComment && (
        <Button
          icon={ icons.edit }
          label="Edit Content"
          onPress={ handleEditComment }
        />
        )}
        <Button
          icon={ icons.flag }
          label="Report Content"
          onPress={ toggleReport }
          accessibilityLabel={ accessibilityLabel }
          warning
        />
        {isMyComment && (
        <Button
          icon={ icons.delete }
          label="Delete Content"
          onPress={ handleDeleteComment }
          warning
        />
        )}
      </DraggableModal>
    </React.Fragment>
  )
}

export default connector(CommentCta)
