import React, { useState } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { Routes, Params, pop } from 'src/helpers/navigationService'
import { CustomActions } from 'src/helpers/navigationHelper'

import { AnswerId } from 'src/models/Communities/AnswerModel'

import { isFollowingAnswerSelector, isMyAnswerSelector } from 'src/redux/selectors/userSelector'
import { toggleAnswerNotificationAction } from 'src/redux/actions/user/community/notificationsAction'
import { reportContentAction } from 'src/redux/actions/user/community/flagContentsAction'
import { deleteAnswerAction } from 'src/redux/actions/communities/deleteContentActions'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'

import { icons } from 'assets/images'
import TextButton from 'src/controls/Button'
import CtaButton from 'src/controls/navigation/CtaButton'
import Button from 'src/controls/Button/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'
import Alert from 'src/controls/Modal/Alert'

type ModalState = 'Closed' | 'MeatballsMenu' | 'DeleteConfirmation'

interface OwnProps extends NavigationInjectedProps {
  answerId: AnswerId
}

interface DispatchProps {
  toggleAnswerNotification: (answerId: AnswerId) => void
  reportAnswer: (answerId: AnswerId) => void
  deleteAnswer: (answerId: AnswerId) => void
  checkIsUserLoggedOutToBreak: () => boolean
}

const dispatcher = dispatch => ({
  toggleAnswerNotification: answerId => dispatch(toggleAnswerNotificationAction(answerId)),
  reportAnswer: answerId => dispatch(reportContentAction('answers', answerId)),
  deleteAnswer: answerId => dispatch(deleteAnswerAction(answerId)),
  checkIsUserLoggedOutToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
})

interface StateProps {
  isFollowingAnswer: boolean
  isMyAnswer: boolean
}

const selector = createStructuredSelector({
  isFollowingAnswer: isFollowingAnswerSelector,
  isMyAnswer: isMyAnswerSelector,
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const RecommendationCta = ({ navigation, answerId, isFollowingAnswer, toggleAnswerNotification, reportAnswer, isMyAnswer, deleteAnswer, checkIsUserLoggedOutToBreak }: Props) => {
  const [modalState, setModalState] = useState<ModalState>('Closed')
  const isPosting = navigation.getParam('_posting', undefined)

  const setNextScreensAndRoutes = () => {
    const questionId = navigation.getParam(Params.QUESTION_ID)
    navigation.dispatch({
      key: Routes.COMMUNITY__QUESTION,
      // @ts-ignore
      type: CustomActions.SUBMIT_NEW_ANSWER,
      routeName: Routes.COMMUNITY__QUESTION,
      params: { [Params.QUESTION_ID]: questionId, _reload_question: true },
    })
  }

  const openMeatballsMenu = () => {
    setModalState('MeatballsMenu')
  }

  const closeModal = () => {
    setModalState('Closed')
  }

  const toggleNotification = () => {
    toggleAnswerNotification(answerId)
    closeModal()
  }

  const toggleReport = () => {
    reportAnswer(answerId)
    closeModal()
  }

  const handleDeleteAnswer = () => {
    setModalState('DeleteConfirmation')
  }

  const confirmDeleteAnswer = () => {
    closeModal()
    pop()
    deleteAnswer(answerId)
  }

  if (isPosting) {
    return (
      <TextButton
        onPress={ setNextScreensAndRoutes }
        size="small"
        linkGreen
      >
        SKIP
      </TextButton>
    )
  }

  return (
    <>
      <CtaButton dots onPress={ openMeatballsMenu } />
      { modalState === 'MeatballsMenu' ? (
        <DraggableModal
          isOpen={ modalState === 'MeatballsMenu' }
          onDismiss={ closeModal }
        >
          <Button
            icon={ isFollowingAnswer ? icons.disableNotification : icons.enableNotification }
            label={ isFollowingAnswer ? 'Stop Notifications' : 'Get Notifications' }
            onPress={ toggleNotification }
          />
          <Button
            icon={ icons.flag }
            label="Report Content"
            onPress={ toggleReport }
            warning
          />
          {isMyAnswer && (
          <Button
            icon={ icons.delete }
            label="Delete Content"
            onPress={ handleDeleteAnswer }
            warning
          />
          )}
        </DraggableModal>
      ) : (
        <Alert
          isOpen={ modalState === 'DeleteConfirmation' }
          title="Discard this post?"
          description="Are you sure you want to discard your post?"
          buttons={ [{ title: 'Discard Post', onPress: confirmDeleteAnswer }] }
          cancelText="Keep Writing"
          onDismiss={ closeModal }
        />
      )}
    </>
  )
}

export default connector(RecommendationCta)
