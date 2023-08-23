import React, { useCallback, Fragment } from 'react'
import { connect } from 'react-redux'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { BookModel } from 'src/models/BookModel'
import {
  bookListForQuestionSelector,
  bookToAnswerSelector,
} from 'src/redux/selectors/booksListSelector'
import BookListItem from 'src/components/Community/BookList/BookListItem'
import { RequestStatus } from 'src/models/ApiStatus'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { questionAnswersFeedApiStatusSelector } from 'src/redux/selectors/apiStatus/community'
import { fetchMoreAnswersForQuestionAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import Images from 'assets/images'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
`

const EmptyContainer = styled.View`
  flex: 1;
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
  height: ${({ theme }) => theme.spacing(22)};;
  width: ${({ theme }) => theme.spacing(22)};
  margin-bottom: ${({ theme }) => -theme.spacing(2)};
`

interface OwnProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  questionId: string,
  sort: RecommendationSortNames
  header?: React.ReactElement;
}

interface StateProps {
  booksList: BookModel[]
  bookToAnswer
  questionAnswersFeedApiStatus: Nullable<RequestStatus>;
}

const selector = createStructuredSelector({
  booksList: bookListForQuestionSelector,
  bookToAnswer: bookToAnswerSelector,
  questionAnswersFeedApiStatus: (state, props) => {
    const ownProps = props as OwnProps
    const id = ownProps.questionId
    return questionAnswersFeedApiStatusSelector(state, { id })
  },
})

interface DispatchProps {
  fetchMoreAnswers: (questionId, sort) => void
}

const dispatcher = dispatch => ({
  fetchMoreAnswers: (questionId, sort) => dispatch(fetchMoreAnswersForQuestionAction(questionId, sort)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = OwnProps & StateProps & DispatchProps

const RecommendationBookList = ({ contentContainerStyle, booksList, bookToAnswer, header, fetchMoreAnswers, questionId, sort, questionAnswersFeedApiStatus }: Props) => {
  const fetchMore = () => {
    fetchMoreAnswers(questionId, sort)
  }

  const renderItem = useCallback(({ item }) => {
    if (bookToAnswer[item.ean]) {
      return <BookListItem ean={ item.ean } answerId={ bookToAnswer[item.ean] } />
    }
    return <Fragment />
  }, [bookToAnswer])

  const keyExtractor = useCallback(item => item.ean, [])

  const fetching = questionAnswersFeedApiStatus === RequestStatus.FETCHING

  const renderFooter = () => {
    if (booksList.length && bookToAnswer) {
      return <LoadingIndicator isLoading={ fetching } />
    }
    return undefined
  }

  const renderEmpty = () => {
    if (questionAnswersFeedApiStatus === RequestStatus.SUCCESS) {
      return (
        <EmptyContainer>
          <Image
            resizeMode="contain"
            source={ Images.noComments }
          />
          <HeaderText>It's a little too quiet in here.</HeaderText>{ /* eslint-disable-line */ }
          <BodyText>Kick off the conversation to get things rolling.</BodyText>
        </EmptyContainer>
      )
    }
    return undefined
  }

  return (
    <FlatList
      ListHeaderComponent={ (
        <React.Fragment>
          { header }
          { !booksList.length && (
            <LoadingIndicator isLoading={ fetching } />
          ) || undefined }
        </React.Fragment>
        ) }
      contentContainerStyle={ contentContainerStyle }
      data={ booksList && bookToAnswer && booksList || [] }
      keyExtractor={ keyExtractor }
      renderItem={ renderItem }
      onEndReached={ fetchMore }
      onEndReachedThreshold={ 0.5 }
      ItemSeparatorComponent={ Spacing }
      ListFooterComponent={ renderFooter() }
      ListEmptyComponent={ renderEmpty() }
    />

  )
}


export default connector(RecommendationBookList)
