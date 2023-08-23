import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Images from 'assets/images'

import { RequestStatus } from 'src/models/ApiStatus'
import { UserPostListModel, myPostType, UserPostItem } from 'src/models/Communities/MyPostModel'
import { RecommendationSortNames, QuestionModel, QuestionId } from 'src/models/Communities/QuestionModel'
import { AnswerModel, AnswerId } from 'src/models/Communities/AnswerModel'

import { userPostSelector } from 'src/redux/selectors/communities/myPostSelector'
import { fetchUserPostsAction, fetchMoreUserPostAction, FetchUserPostParams } from 'src/redux/actions/communities/fetchUserPostAction'
import { fetchUserPostApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { questionsListSelector } from 'src/redux/selectors/communities/questionsSelector'
import { answersListSelector } from 'src/redux/selectors/communities/answerSelector'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import AnswerItem from 'src/components/AnswersList/Item'
import QuestionItem from 'src/components/RecommendationQuestionsList/Item'

const Spacing = styled.View`
  height: 30;
`

const Empty = styled.View`
  margin-top: -30;
`

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing(10)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
`

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(25)};;
  width: ${({ theme }) => theme.spacing(25)};
  margin-bottom: ${({ theme }) => -theme.spacing(2)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

const BodyText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  uid?: string; // if no uid, assume logged in user
  header?: React.ReactElement;
  sort: RecommendationSortNames
}

interface StateProps {
  myPosts: UserPostListModel,
  fetchMyPostApiStatus: Nullable<RequestStatus>,
  questionsList: Record<QuestionId, QuestionModel>
  answersList: Record<AnswerId, AnswerModel>
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

interface DispatchProps {
  fetchMyPost: (params: FetchUserPostParams) => void
  fetchMoreMyPost: (params: FetchUserPostParams) => void
}

const dispatcher = dispatch => ({
  fetchMyPost: params => dispatch(fetchUserPostsAction(params)),
  fetchMoreMyPost: params => dispatch(fetchMoreUserPostAction(params)),
})

const connector = connect<StateProps, DispatchProps, {}>(
  selector,
  dispatcher,
)

type Props = OwnProps & DispatchProps & StateProps

interface RenderItem {
  // eslint-disable-next-line react/no-unused-prop-types
  item: UserPostItem
}


const MyPostList = ({ style, contentContainerStyle, uid, fetchMyPost, fetchMoreMyPost, sort, header, myPosts, fetchMyPostApiStatus, questionsList, answersList }: Props) => {
  const fetchMyPosts = () => {
    fetchMyPost({ sort, uid })
  }
  useEffect(() => {
    fetchMyPosts()
  }, [sort])

  const fetchMore = () => {
    fetchMoreMyPost({ sort, uid })
  }

  const renderItem = useCallback(({ item }: RenderItem) => {
    if (item.type === myPostType.QUESTION) {
      if (!questionsList[item.referenceId]) {
        return <Empty />
      }
      return <QuestionItem key={ item.referenceId } questionId={ item.referenceId } />
    }
    if (!answersList[item.referenceId]) {
      return <Empty />
    }
    return <AnswerItem answerId={ item.referenceId } key={ item.referenceId } />
  }, [questionsList, answersList, myPosts])

  const keyExtractor = useCallback(item => `${item.type}-${item.referenceId}`, [myPosts])


  const fetching = fetchMyPostApiStatus === RequestStatus.FETCHING
  const refreshing = myPosts.length > 0 && fetching

  const _onRefresh = () => !fetching && fetchMyPosts && fetchMyPosts()
  const _onEndReached = () => !fetching && fetchMore && fetchMore()

  const renderFooter = () => {
    if (myPosts.length) {
      return <LoadingIndicator isLoading={ fetching } />
    }
    return undefined
  }

  const renderEmpty = () => {
    if (fetchMyPostApiStatus === RequestStatus.SUCCESS) {
      return (
        <EmptyContainer>
          <Image
            resizeMode="contain"
            source={ Images.noComments }
          />
          <HeaderText>You've been a little quiet lately.</HeaderText>{ /* eslint-disable-line */ }
          <BodyText>Ask for suggestions from your community & find your next favorite from fellow readers.</BodyText>
        </EmptyContainer>
      )
    }
    return undefined
  }


  return (
    <FlatList
      ListHeaderComponent={ (
        <>
          { header }
          {myPosts.length === 0 &&
            <LoadingIndicator isLoading={ fetching } />
          }
        </>
        ) }
      style={ style }
      onRefresh={ _onRefresh }
      refreshing={ refreshing }
      onEndReached={ _onEndReached }
      contentContainerStyle={ contentContainerStyle }
      data={ myPosts }
      keyExtractor={ keyExtractor }
      renderItem={ renderItem }
      ItemSeparatorComponent={ Spacing }
      ListFooterComponent={ renderFooter() }
      ListEmptyComponent={ renderEmpty() }
    />
  )
}


export default connector(MyPostList)
