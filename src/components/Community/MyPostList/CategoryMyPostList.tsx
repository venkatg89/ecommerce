import React, { useEffect } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { myPostType, UserPostListModel } from 'src/models/Communities/MyPostModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { userPostSelector } from 'src/redux/selectors/communities/myPostSelector'
import { fetchUserPostApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { fetchUserPostsAction, fetchMoreUserPostAction } from 'src/redux/actions/communities/fetchUserPostAction'

import AnswerItem from 'src/components/AnswersList/Item'
import QuestionItem from 'src/components/RecommendationQuestionsList/Item'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import Images from 'assets/images'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)}px;
`

const EmptyContainer = styled.View`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  min-height: ${({ theme }) => theme.spacing(10)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
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

const Image = styled.Image`
  height: ${({ theme }) => theme.spacing(25)};;
  width: ${({ theme }) => theme.spacing(25)};
  margin-bottom: ${({ theme }) => -theme.spacing(2)};
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactElement
  categoryId?: string
  sort: RecommendationSortNames
}

interface StateProps {
  myPosts: UserPostListModel
  communityCategoryFeedApiStatus: Nullable<RequestStatus>;
}

const selector = createStructuredSelector({
  myPosts: (state, ownProps) => {
    const { categoryId, sort } = ownProps
    return userPostSelector(state, { sort, categoryId })
  },
  communityCategoryFeedApiStatus: (state, ownProps) => {
    const { sort } = ownProps
    return fetchUserPostApiStatusSelector(state, { sort })
  },
})

interface DispatchProps {
  fetchMyCategoryPost: (categoryId, sort) => void
  fetchMoreMyCategoryPost: (categoryId, sort) => void
}

const dispatcher = dispatch => ({
  fetchMyCategoryPost: (categoryId, sort) => dispatch(fetchUserPostsAction({ sort, categoryId })),
  fetchMoreMyCategoryPost:
    (categoryId, sort) => dispatch(fetchMoreUserPostAction({ categoryId, sort })),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const CategoryMyPostList = ({ style, contentContainerStyle, categoryId, sort, header, myPosts, communityCategoryFeedApiStatus, fetchMyCategoryPost, fetchMoreMyCategoryPost }:Props) => {
  useEffect(() => {
    fetchMyCategoryPost(categoryId, sort)
  }, [])

  const loadMore = () => {
    fetchMoreMyCategoryPost(categoryId, sort)
  }

  const renderItem = item => (item.type === myPostType.QUESTION ? <QuestionItem key={ `question-${item.referenceId}` } questionId={ item.referenceId } />
    : <AnswerItem answerId={ item.referenceId } key={ `agreed-answer-${item.referenceId}` } />)

  const fetching = communityCategoryFeedApiStatus === RequestStatus.FETCHING

  const renderFooter = () => {
    if (myPosts.length) {
      return <LoadingIndicator isLoading={ fetching } />
    }
    return undefined
  }

  const renderEmpty = () => {
    if (communityCategoryFeedApiStatus === RequestStatus.SUCCESS) {
      return (
        <EmptyContainer>
          <Image
            resizeMode="contain"
            source={ Images.noComments }
          />
          <HeaderText>You've been a little quiet lately.</HeaderText>{ /* eslint-disable-line */ }
          <BodyText>Start the conversation with your community.</BodyText>
        </EmptyContainer>
      )
    }
    return undefined
  }

  return (
    <FlatList
      contentContainerStyle={ contentContainerStyle }
      refreshing={ false }
      data={ myPosts }
      keyExtractor={ item => `${item.type}-${item.referenceId}` }
      onEndReached={ loadMore }
      ListHeaderComponent={ (
        <React.Fragment>
          { header }
          { !myPosts.length && (
            <LoadingIndicator isLoading={ fetching } />
          ) || undefined }
        </React.Fragment>
      ) }
      ItemSeparatorComponent={ Spacing }
      renderItem={ ({ item }) => renderItem(item) }
      ListFooterComponent={ renderFooter() }
      ListEmptyComponent={ renderEmpty() }
    />

  )
}

export default connector(CategoryMyPostList)
