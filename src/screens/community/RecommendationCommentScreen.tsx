import React, { useState, useRef, useEffect, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { fetchCommentAction } from 'src/redux/actions/communities/fetchCommentAction'
import { fetchAnswersByIdsAction } from 'src/redux/actions/communities/fetchAnswersByIdsAction'
import {
  postCommentAction,
  editCommentAction,
} from 'src/redux/actions/communities/postCommentAction'
import { answerSelector } from 'src/redux/selectors/communities/questionsSelector'

import {
  AnswerId,
  CommentId,
  CommentModel,
  AnswerModel,
} from 'src/models/Communities/AnswerModel'

import Header from 'src/controls/navigation/Header'
import _Container from 'src/controls/layout/ScreenContainer'
import {
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import AddComment from 'src/components/Community/AddComment'
import CommentList from 'src/components/Community/CommentList'
import ReplyComment from 'src/components/Community/ReplyComment'
import RecommendationCta from 'src/components/CtaButtons/RecommendationCta'
import CommentScreenHeader from 'src/components/Community/CommentScreenHeader'

import { isEmpty } from 'src/helpers/objectHelpers'
import { Routes, Params } from 'src/helpers/navigationService'
import { CustomActions } from 'src/helpers/navigationHelper'

interface ContainerProps {
  currentWidth: number
}

const CommentsContainer = styled(_Container)<ContainerProps>`
  flex: 1;
  padding-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
  padding-top: ${CONTENT_VERTICAL_PADDING};
`

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
})
interface DispatchProps {
  fetchComment(answerId: AnswerId)
  postComment(answerId: AnswerId, commentId: CommentId, rawText: string)
  editComment: (
    commentId: CommentId,
    parentCommentId: CommentId,
    rawText: string,
  ) => void
  fetchAnswer: (answerId: AnswerId) => void
}

interface StateProps {
  answer: AnswerModel
}

const selector = createStructuredSelector({
  answer: (state, ownProps) => {
    const { navigation } = ownProps
    const answerId = navigation.getParam('answerId')
    return answerSelector(state, { answerId })
  },
})

const dispatcher = (dispatch) => ({
  fetchComment: (answerId) => dispatch(fetchCommentAction(answerId)),
  postComment: (answerId, commentId, rawText) =>
    dispatch(postCommentAction(answerId, commentId, rawText)),
  editComment: (commentId, parentCommentId, rawText) =>
    dispatch(editCommentAction(commentId, parentCommentId, rawText)),
  fetchAnswer: (answerId) => dispatch(fetchAnswersByIdsAction([answerId])),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = DispatchProps & NavigationInjectedProps & StateProps

const setNextScreensAndRoutes = (navigation) => {
  const questionId = navigation.getParam(Params.QUESTION_ID)
  navigation.dispatch({
    key: Routes.COMMUNITY__QUESTION,
    type: CustomActions.SUBMIT_NEW_ANSWER,
    routeName: Routes.COMMUNITY__QUESTION,
    params: { [Params.QUESTION_ID]: questionId },
  })
}

const EMPTY_COMMENT = {} as CommentModel
const RecommendationCommentScreen = ({
  navigation,
  fetchComment,
  postComment,
  editComment,
  fetchAnswer,
  answer,
}: Props) => {
  const { width } = useResponsiveDimensions()
  const [currentCommentId, setCommentId] = useState<CommentId>(0)
  const [editCommentModel, setEditComment] = useState<CommentModel>(
    EMPTY_COMMENT,
  )
  const commentList = useRef()
  const answerId = navigation.getParam(Params.ANSWER_ID)
  const ean = answer ? answer.product.ean : '0'
  useEffect(() => {
    if (answerId) {
      Promise.all([fetchComment(answerId), fetchAnswer(answerId)])
    }
  }, [answerId])
  const onShowReply = useCallback(
    (commentId) => {
      setEditComment(EMPTY_COMMENT)
      if (currentCommentId) {
        setCommentId(0)
      } else {
        setCommentId(commentId)
      }
    },
    [currentCommentId],
  )

  const handlePostComment = async (value: string) => {
    if (!value) {
      return
    }
    const isPosting =
      navigation.getParam('_posting', undefined) &&
      !navigation.getParam('_convertedToAgree')
    await postComment(answerId, 0, value)

    if (isPosting) {
      setNextScreensAndRoutes(navigation)
    }
  }

  const handlePostReply = (value: string) => {
    if (!value) {
      return
    }
    postComment(answerId, currentCommentId, value)
    setCommentId(0)
  }

  const toggleEditComment = (comment, parentCommentId) => {
    setCommentId(parentCommentId)
    setEditComment(comment)
  }

  const handlePostEdit = (value) => {
    if (editCommentModel.id !== currentCommentId) {
      editComment(editCommentModel.id, currentCommentId, value)
    } else {
      editComment(editCommentModel.id, 0, value)
    }
    setEditComment(EMPTY_COMMENT)
    setCommentId(0)
  }

  const recommendNew = navigation.getParam('_posting', false)
  return (
    <KeyboardAvoidingView
      style={styles.avoidingView}
      behavior={Platform.OS === 'ios' ? 'height' : undefined}
      keyboardVerticalOffset={110}
    >
      <CommentsContainer currentWidth={width}>
        <CommentList
          header={<CommentScreenHeader ean={ean} />}
          listRef={commentList}
          currentCommentId={currentCommentId}
          answerId={answerId}
          onShowReply={onShowReply}
          hideComments={recommendNew}
          editComment={toggleEditComment}
        />
      </CommentsContainer>
      {(() => {
        if (currentCommentId && isEmpty(editCommentModel)) {
          return (
            <ReplyComment
              postComment={handlePostReply}
              answerId={answerId}
              commentId={currentCommentId}
            />
          )
        }
        if (!isEmpty(editCommentModel)) {
          return (
            <AddComment
              label="Edit Comment"
              postComment={handlePostEdit}
              currentText={editCommentModel.text}
            />
          )
        }
        return <AddComment postComment={handlePostComment} />
      })()}
    </KeyboardAvoidingView>
  )
}

RecommendationCommentScreen.navigationOptions = ({ navigation }) => {
  const answerId = navigation.getParam(Params.ANSWER_ID)
  return {
    title: navigation.getParam('title', 'Tell us why'),
    header: (headerProps) => (
      <Header
        headerProps={headerProps}
        ctaComponent={
          <RecommendationCta navigation={navigation} answerId={answerId} />
        }
      />
    ),
  }
}

export default connector(RecommendationCommentScreen)
