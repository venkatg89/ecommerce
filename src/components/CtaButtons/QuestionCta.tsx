import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { icons } from 'assets/images'

import Button from 'src/controls/Button/CtaButton'
import CtaButton from 'src/controls/navigation/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'

import { pop } from 'src/helpers/navigationService'

import { toggleQuestionNotificationsAction } from 'src/redux/actions/user/community/notificationsAction'
import { reportContentAction } from 'src/redux/actions/user/community/flagContentsAction'
import { deleteQuestionAction } from 'src/redux/actions/communities/deleteContentActions'

import { isFollowingQuestionSelector, isMyQuestionSelector } from 'src/redux/selectors/userSelector'

import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { questionSelector } from 'src/redux/selectors/communities/questionsSelector'

interface OwnProps {
  questionId: string;
}

interface StateProps {
  isFollowingQuestion: boolean;
  isMyQuestion: boolean;
  question: QuestionModel
}

const selector = createStructuredSelector({
  isFollowingQuestion: isFollowingQuestionSelector,
  isMyQuestion: isMyQuestionSelector,
  question: questionSelector,
})

interface DispatchProps {
  toggleQuestionNotifications: (questionId: string) => void;
  toggleReportQuestion: (questionId: string) => void
  deleteQuestion: (questionId: string) => void

}

const dispatcher = dispatch => ({
  toggleQuestionNotifications: questionId => dispatch(toggleQuestionNotificationsAction(questionId)),
  toggleReportQuestion: questionId => dispatch(reportContentAction('questions', questionId)),
  deleteQuestion: questionId => dispatch(deleteQuestionAction(questionId)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const QuestionCta = ({ questionId, isFollowingQuestion, toggleQuestionNotifications, toggleReportQuestion, isMyQuestion, deleteQuestion, question }: Props) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const toggleModal = useCallback(() => {
    setOpen(!isOpen)
  }, [isOpen])

  const reportQuestion = () => {
    toggleReportQuestion(questionId)
    toggleModal()
  }

  const toggleNotification = () => {
    toggleQuestionNotifications(questionId)
    toggleModal()
  }

  // question can delete when it doesn't have answers
  const showDeleteQuestion = question.answerCount === 0 && isMyQuestion

  const handleDeleteQuestion = () => {
    toggleModal()
    pop()
    deleteQuestion(questionId)
  }

  return (
    <React.Fragment>
      <CtaButton dots onPress={ toggleModal } />
      <DraggableModal
        isOpen={ isOpen }
        onDismiss={ toggleModal }
      >
        <Button
          icon={ isFollowingQuestion ? icons.disableNotification : icons.enableNotification }
          label={ isFollowingQuestion ? 'Stop Notifications' : 'Get Notifications' }
          onPress={ toggleNotification }
        />
        <Button
          icon={ icons.flag }
          label="Report Content"
          onPress={ reportQuestion }
          warning
        />
        {showDeleteQuestion && (
          <Button
            icon={ icons.delete }
            label="Delete Content"
            onPress={ handleDeleteQuestion }
            warning
          />
        )}
      </DraggableModal>
    </React.Fragment>
  )
}

export default connector(QuestionCta)
