import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import _SearchFieldHeader from 'src/components/Search/SearchFieldHeader'
import _SearchResultList from 'src/components/Search/ResultList'
import _SubmitActionButton from 'src/components/BookGridList/SubmitActionButton'
import AnswerQuestionHeader from 'src/components/Community/AnswerQuestionHeader'

import {
  CONTENT_HORIZONTAL_PADDING,
  CONTENT_VERTICAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { SearchTypesKeys } from 'src/constants/search'
import { Ean } from 'src/models/BookModel'
import { QuestionsState } from 'src/redux/reducers/CommunitiesReducer/QuestionsReducer/QuestionsReducer'
import { push, Routes, Params } from 'src/helpers/navigationService'

import { postAnswerAction } from 'src/redux/actions/communities/postAnswerAction'
import {
  fetchSearchResultsAction,
  FetchSearchResultsActionParams,
  fetchMoreSearchResultsAction,
} from 'src/redux/actions/legacySearch/searchResultsAction'
import { questionsListSelector } from 'src/redux/selectors/communities/questionsSelector'

interface ContainerProps {
  currentWidth: number
}

const Container = styled(_Container)<ContainerProps>`
  padding-top: ${CONTENT_VERTICAL_PADDING};
  padding-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
`

const SearchContainer = styled.View`
  flex: 1;
`

const SubmitActionButton = styled(_SubmitActionButton)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const SearchFieldHeader = styled(_SearchFieldHeader)<ContainerProps>`
  /* padding-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)}; */
`

const SearchResultList = styled(_SearchResultList)`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

interface StateProps {
  questions: QuestionsState
}

const selector = createStructuredSelector({
  questions: questionsListSelector,
})

interface DispatchProps {
  postAnswer: (questionId: string, EAN: Ean) => any
  fetchSearchResults: (params: FetchSearchResultsActionParams) => void
  fetchMoreSearchResults: (params: FetchSearchResultsActionParams) => void
}

const dispatcher = (dispatch) => ({
  postAnswer: (questionId: string, EAN: Ean) =>
    dispatch(postAnswerAction(questionId, EAN)),
  fetchSearchResults: (params) => dispatch(fetchSearchResultsAction(params)),
  fetchMoreSearchResults: (params) =>
    dispatch(fetchMoreSearchResultsAction(params)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const AnswerRecommendationScreen = ({
  fetchSearchResults,
  fetchMoreSearchResults,
  navigation,
  postAnswer,
  questions,
}: Props) => {
  const [query, setQuery] = useState<string>('')
  const [previousQuery, setPreviousQuery] = useState<string>('')
  const { width } = useResponsiveDimensions()
  const questionId = navigation.getParam('questionId')
  const question = questions[questionId]

  const onBarcodeScannedSuccess = useCallback(() => setQuery(''), [])

  const onSearchSubmit = useCallback(() => {
    if (query === previousQuery) {
      return
    }
    fetchSearchResults({ query, searchType: SearchTypesKeys.BOOKS })
    setPreviousQuery(query)
  }, [query])

  const onSearchReset = useCallback(() => {
    setQuery('')
    setPreviousQuery('')
  }, [])

  const onRecommendBook = async (ean) => {
    if (!questionId) {
      return
    }

    const params = await postAnswer(questionId, ean)
    if (params) {
      push(Routes.COMMUNITY__COMMENT, {
        [Params.QUESTION_ID]: questionId,
        ean,
        _posting: true,
        ...params,
      })
      setQuery('')
    }
  }

  return (
    <Container currentWidth={width}>
      <AnswerQuestionHeader questionTitle={question.title} />
      <SearchContainer>
        <SearchFieldHeader
          currentWidth={width}
          value={query}
          onChange={setQuery}
          onSubmit={onSearchSubmit}
          onReset={onSearchReset}
          onBarcodeScannedSuccess={onBarcodeScannedSuccess}
        />
        <SearchResultList
          searchType={SearchTypesKeys.BOOKS}
          onRefresh={() =>
            fetchSearchResults({ query, searchType: SearchTypesKeys.BOOKS })
          }
          onEndReached={() =>
            fetchMoreSearchResults({ query, searchType: SearchTypesKeys.BOOKS })
          }
          BooksResultActionComponent={SubmitActionButton}
          onBookResultActionPress={onRecommendBook}
        />
      </SearchContainer>
    </Container>
  )
}

AnswerRecommendationScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam(Params.TITLE, 'Recommend a book'),
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AnswerRecommendationScreen)
