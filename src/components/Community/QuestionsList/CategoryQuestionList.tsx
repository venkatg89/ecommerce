import React from 'react'
import { FlatList, ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
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
  questionsListCategorySelector,
} from 'src/redux/selectors/communities/questionsSelector'
import { communityCategoryFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'

import {
  fetchMoreCateogryQuestionsActions,
  fetchCategoryQaFeedAction,
} from 'src/redux/actions/communities/fetchCategoryQuestionsAction'
import RecommendationItem from 'src/components/Community/QuestionsList/QuestionItem'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)}px;
`

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  categoryId?: string,
  filter?: RecommendationFilterNames,
  header?: React.ReactElement;
  sort: RecommendationSortNames
}

interface StateProps {
  questions: QuestionsList,
  communityCategoryFeedApiStatus: Nullable<RequestStatus>;
}

const selector = createStructuredSelector({
  questions: questionsListCategorySelector,
  communityCategoryFeedApiStatus: (state, ownProps: OwnProps) => {
    const id = ownProps.categoryId
    return communityCategoryFeedApiStatusSelector(state, { id })
  },
})

interface DispatchProps {
  fetchCategoryQafeed(categoryId, sort, filter): void
  fetchMoreCateogryQuestions: (categoryId, sort, filter) => void
}

const dispatcher = dispatch => ({
  fetchCategoryQafeed: (categoryId, sort, filter) => dispatch(fetchCategoryQaFeedAction(categoryId, sort, filter)),
  fetchMoreCateogryQuestions:
    (categoryId, sort, filter) => dispatch(fetchMoreCateogryQuestionsActions(categoryId, sort, filter)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = OwnProps & DispatchProps & StateProps

class CategoryQuestionList extends React.Component<Props> {
  componentDidMount() {
    const { categoryId, sort, filter, fetchCategoryQafeed } = this.props
    fetchCategoryQafeed(categoryId, sort, filter)
  }

  loadMoreQuestions = () => {
    const { categoryId, sort, fetchMoreCateogryQuestions, filter } = this.props
    fetchMoreCateogryQuestions(categoryId, sort, filter)
  }

  renderItem = ({ item }) => (<RecommendationItem questionId={ item.id } />)

  render() {
    const {
      style, contentContainerStyle, questions, header, fetchCategoryQafeed, categoryId, communityCategoryFeedApiStatus, sort, filter,
    } = this.props
    const fetching = communityCategoryFeedApiStatus === RequestStatus.FETCHING
    return (
      <>
        <FlatList
          style={ style }
          contentContainerStyle={ contentContainerStyle }
          data={ questions }
          refreshing={ false }
          onRefresh={ () => fetchCategoryQafeed(categoryId, sort, filter) }
          keyExtractor={ item => item.id.toString() }
          ListHeaderComponent={ (
          // this is ganna be refactored, add it here to keep it below the header
          // when we refactor this, lets not use a listheader instead, lets use
          // a separate component and collapse it depending on scroll position
          // this way we always keep the activity indictor below the header
            <React.Fragment>
              { header }
              { fetching && (
              <Container>
                <ActivityIndicator size="large" animating={ fetching } />
              </Container>
              ) }
            </React.Fragment>
        ) }
          renderItem={ this.renderItem }
          onEndReached={ this.loadMoreQuestions }
          ItemSeparatorComponent={ Spacing }
          ListFooterComponent={ (
            <>
              {questions.length > 0 && <LoadingIndicator isLoading={ fetching } />}
            </>
          ) }
        />
      </>
    )
  }
}

export default connector(CategoryQuestionList)
