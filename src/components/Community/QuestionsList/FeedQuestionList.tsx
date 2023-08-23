import React, { useEffect } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { RequestStatus } from 'src/models/ApiStatus'
import {
  QuestionsList,
  RecommendationFilterNames,
  RecommendationSortNames,
} from 'src/models/Communities/QuestionModel'
import {
  questionsListFilterSelector,
} from 'src/redux/selectors/communities/questionsSelector'
import RecommendationItem from 'src/components/Community/QuestionsList/QuestionItem'
import {
  fetchFeedQuestionsAction,
  fetchFeedQuestionMore } from 'src/redux/actions/communities/fetchFeedhomeQuestionsAction'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import { communityHomeFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'

const Spacing = styled.View`
  height: 24;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  // eslint-disable-next-line react/no-unused-prop-types
  filter: RecommendationFilterNames,
  header?: React.ReactElement;
  sort: RecommendationSortNames
}

interface StateProps {
  questions: QuestionsList,
  communityHomeFeedApiStatus: Nullable<RequestStatus>;
}

const selector = createStructuredSelector({
  questions: questionsListFilterSelector,
  communityHomeFeedApiStatus: communityHomeFeedApiStatusSelector,
})

interface DispatchProps {
  fetchFeedQuestions(sort: RecommendationSortNames): void
  fetchMoreQuestions: (sort: RecommendationSortNames) => void
}

const dispatcher = dispatch => ({
  fetchFeedQuestions: (sort: RecommendationSortNames) => dispatch(fetchFeedQuestionsAction(sort)),
  fetchMoreQuestions: (sort: RecommendationSortNames) => dispatch(fetchFeedQuestionMore(sort)),
})

const connector = connect<StateProps, DispatchProps, {}>(
  selector,
  dispatcher,
)

type Props = OwnProps & DispatchProps & StateProps

const FeedQuestionList = ({ style, contentContainerStyle, header, questions, fetchFeedQuestions, communityHomeFeedApiStatus, fetchMoreQuestions, sort }: Props) => {
  useEffect(() => {
    fetchFeedQuestions(sort)
  }, [sort])

  const fetching = communityHomeFeedApiStatus === RequestStatus.FETCHING
  const refreshing = questions.length > 0 && fetching
  const _onEndReached = () => !fetching && fetchMoreQuestions && fetchMoreQuestions(sort)
  const _onRefresh = () => !fetching && fetchFeedQuestions && fetchFeedQuestions(sort)

  return (
    <FlatList
      ListHeaderComponent={ (
        <>
          { header }
          {questions.length === 0 && <LoadingIndicator isLoading={ fetching } /> }
        </>
    ) }
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      data={ questions }
      refreshing={ refreshing }
      onEndReached={ _onEndReached }
      onRefresh={ _onRefresh }
      keyExtractor={ item => item.id.toString() }
      renderItem={ ({ item, index }) => (
        <RecommendationItem questionId={ item.id } />
      ) }
      ListFooterComponent={ (
        <>
          {questions.length > 0 &&
          <LoadingIndicator isLoading={ fetching } />
        }
        </>
    ) }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default connector(FeedQuestionList)
