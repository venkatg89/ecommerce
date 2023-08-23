import React, { useEffect, useCallback } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { userPostSelector } from 'src/redux/selectors/communities/myPostSelector'
import { fetchUserPostsAction, fetchMoreUserPostAction, FetchUserPostParams } from 'src/redux/actions/communities/fetchUserPostAction'
import { fetchUserPostApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { questionsListSelector } from 'src/redux/selectors/communities/questionsSelector'
import { answersListSelector } from 'src/redux/selectors/communities/answerSelector'

import { RequestStatus } from 'src/models/ApiStatus'
import { UserPostListModel, myPostType, UserPostItem } from 'src/models/Communities/MyPostModel'
import { RecommendationSortNames, QuestionModel, QuestionId } from 'src/models/Communities/QuestionModel'
import { AnswerModel, AnswerId } from 'src/models/Communities/AnswerModel'

import AnswerItem from 'src/components/Profile/QaPostsLists/AnswerItem'
import QuestionItem from 'src/components/RelatedQuestionsList/Item'
import QaListHeader from 'src/components/Profile/QaPostsLists/QaListHeader'

const Spacing = styled.View`
  height: 30;
`

const Empty = styled.View`
  margin-top: -30;
`
interface OwnProps {
  uid: string
  totalQuestions: number
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  sort: RecommendationSortNames
  onChangeSort: (_: any, sort: RecommendationSortNames) => void
}


interface StateProps {
  myPosts: UserPostListModel,
  fetchMyPostApiStatus: Nullable<RequestStatus>,
  questionsList: Record<QuestionId, QuestionModel>
  answersList: Record<AnswerId, AnswerModel>
}

interface DispatchProps {
  fetchMyPost: (params: FetchUserPostParams) => void
  fetchMoreMyPost: (params: FetchUserPostParams) => void
}

const selector = createStructuredSelector({
  myPosts: (state, ownProps) => {
    const { uid, sort } = ownProps
    return userPostSelector(state, { uid, sort })
  },
  fetchMyPostApiStatus: (state, ownProps) => {
    const { uid, sort } = ownProps
    return fetchUserPostApiStatusSelector(state, { uid, sort })
  },
  questionsList: questionsListSelector,
  answersList: answersListSelector,
})

const dispatcher = dispatch => ({
  fetchMyPost: params => dispatch(fetchUserPostsAction(params)),
  fetchMoreMyPost: params => dispatch(fetchMoreUserPostAction(params)),
})

interface RenderItem {
  // eslint-disable-next-line react/no-unused-prop-types
  item: UserPostItem
}

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const QaPostsList = ({
  style, contentContainerStyle, sort, uid, fetchMyPost, fetchMoreMyPost,
  myPosts, fetchMyPostApiStatus, questionsList, answersList, totalQuestions, onChangeSort }:Props) => {
  const fetchMyPosts = useCallback(() => {
    fetchMyPost({ sort, uid })
  }, [uid, sort])
  useEffect(() => {
    fetchMyPosts()
  }, [uid, sort])
  const fetchMore = useCallback(() => {
    fetchMoreMyPost({ sort, uid })
  }, [sort, uid])

  const fetching = fetchMyPostApiStatus === RequestStatus.FETCHING
  const refreshing = myPosts.length > 0 && fetching

  const _onRefresh = () => !fetching && fetchMyPosts && fetchMyPosts()
  const _onEndReached = () => !fetching && fetchMore && fetchMore()

  const renderItem = useCallback(({ item }: RenderItem) => {
    if (item.type === myPostType.QUESTION) {
      if (!questionsList[item.referenceId]) {
        return <Empty />
      }
      return <QuestionItem key={ item.referenceId } questionId={ item.referenceId.toString() } />
    }
    if (!answersList[item.referenceId]) {
      return <Empty />
    }
    return <AnswerItem answerId={ item.referenceId.toString() } key={ item.referenceId } />
  }, [questionsList, answersList, myPosts])

  return (
    <>
      <FlatList
        ListHeaderComponent={ (
          <QaListHeader
            sort={ sort }
            onChangeSort={ onChangeSort }
            fetching={ fetching }
            totalPosts={ totalQuestions }
          />
        ) }
        style={ style }
        onRefresh={ _onRefresh }
        refreshing={ refreshing }
        onEndReached={ _onEndReached }
        contentContainerStyle={ contentContainerStyle }
        data={ myPosts }
        renderItem={ renderItem }
        ItemSeparatorComponent={ Spacing }
      />

    </>
  )
}

export default connector(QaPostsList)
