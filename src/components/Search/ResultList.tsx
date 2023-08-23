// LEGACY - TO BE REMOVED
import React, { useCallback, useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Images from 'assets/images'

import AnswersList from 'src/components/AnswersList'
import BookList from 'src/components/BookGridList'
import MembersList from 'src/components/MembersList'
import RecommendationQuestionsList from 'src/components/RecommendationQuestionsList'
import CategoryList from 'src/components/CategoryList'
import FlatListApiStatusHandler from 'src/controls/FlatListApiStatusHandler'

import { RequestStatus } from 'src/models/ApiStatus'
import { Ean } from 'src/models/BookModel'
import { SearchTypesKeys } from 'src/constants/search'
import {
  checkForMemberIdFromKey, checkForQuestionIdFromKey, checkForBooksIdFromKey,
  checkForAnswerIdFromKey, checkForCategoryIdFromKey,
} from 'src/helpers/api/milq/searchListingKeys'

import { SearchListingsState } from 'src/redux/reducers/ListingsReducer/SearchReducer'
import { searchResultsApiStatusSelector, isBookSearchBusySelector } from 'src/redux/selectors/searchSelector'
import { searchListingsSelector } from 'src/redux/selectors/listings/searchSelector'
import { searchResultsApiStatusActions, clearSearchResultsAction } from 'src/redux/actions/legacySearch/searchResultsAction'

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
  contentContainerStyle?: StyleProp<ViewStyle>;
  searchType: SearchTypesKeys;
  onRefresh: () => void;
  onEndReached: () => void;
  style?: any
  BooksResultActionComponent?: any;
  onBookResultActionPress?: (ean: Ean) => void;
  bookResultsActionedEans?: Ean[]
}

interface StateProps {
  listings: SearchListingsState;
  listingsApiStatus: Nullable<RequestStatus>;
  isBookSearchBusy: boolean
}

interface DispatchProps {
  clearSearch: () => void
}

const selector = createStructuredSelector({
  listingsApiStatus: searchResultsApiStatusSelector,
  listings: searchListingsSelector,
  isBookSearchBusy: isBookSearchBusySelector,
})

const dispatcher = dispatch => ({
  clearSearch: () => {
    dispatch(clearSearchResultsAction())
    dispatch(searchResultsApiStatusActions().actions.clear)
  },
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & OwnProps & DispatchProps

const SearchResultList = ({
  contentContainerStyle, searchType, listings, listingsApiStatus, onRefresh, onEndReached, isBookSearchBusy,
  BooksResultActionComponent, onBookResultActionPress, bookResultsActionedEans, style, clearSearch,
}: Props) => {
  const resultListing = listings[searchType]
  const resultIds = resultListing && resultListing.ids || []
  const apiStatus = listingsApiStatus

  useEffect(() => clearSearch(), [])

  const renderEmpty = useCallback(() => (
    <EmptyContainer>
      <Image
        resizeMode="contain"
        source={ Images.search }
      />
      <HeaderText>No results can be found</HeaderText>
      <BodyText>Try changing the filter above or trying a new search term.</BodyText>
    </EmptyContainer>
  ), [])

  switch (searchType) {
    case SearchTypesKeys.READERS: {
      const ids = resultIds.filter(id => !!id).map(id => checkForMemberIdFromKey(id)) as string[]
      return (
        <FlatListApiStatusHandler
          style={ style }
          apiStatus={ apiStatus }
          dataArray={ ids }
          flatList={ (
            <MembersList
              contentContainerStyle={ contentContainerStyle }
              memberIds={ ids }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              fetching={ apiStatus === RequestStatus.FETCHING }
            />
          ) }
          noResultsStateComponent={ renderEmpty() }
        />
      )
    }

    case SearchTypesKeys.QUESTIONS: {
      const ids = resultIds.filter(id => !!id).map(id => checkForQuestionIdFromKey(id)) as string[]
      return (
        <FlatListApiStatusHandler
          style={ style }
          apiStatus={ apiStatus }
          dataArray={ ids }
          flatList={ (
            <RecommendationQuestionsList
              contentContainerStyle={ contentContainerStyle }
              questionIds={ ids }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              fetching={ apiStatus === RequestStatus.FETCHING }
            />
          ) }
          noResultsStateComponent={ renderEmpty() }
        />
      )
    }

    case SearchTypesKeys.ANSWERS: {
      const ids = resultIds.filter(id => !!id).map(id => checkForAnswerIdFromKey(id)) as string[]
      return (
        <FlatListApiStatusHandler
          style={ style }
          apiStatus={ apiStatus }
          dataArray={ ids }
          flatList={ (
            <AnswersList
              contentContainerStyle={ contentContainerStyle }
              answerIds={ ids }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              fetching={ apiStatus === RequestStatus.FETCHING }
            />
          ) }
          noResultsStateComponent={ renderEmpty() }
        />
      )
    }
    // TODO: category search list required
    case SearchTypesKeys.CATEGORIES: {
      const ids = resultIds.filter(id => !!id).map(id => checkForCategoryIdFromKey(id)) as string[]
      return (
        <FlatListApiStatusHandler
          style={ style }
          apiStatus={ apiStatus }
          dataArray={ ids }
          flatList={ (
            <CategoryList
              contentContainerStyle={ contentContainerStyle }
              categoryIds={ ids }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              fetching={ apiStatus === RequestStatus.FETCHING }
            />
          ) }
          noResultsStateComponent={ renderEmpty() }
        />
      )
    }

    case SearchTypesKeys.BOOKS:
    default: {
      const ids = resultIds.filter(id => !!id).map(id => checkForBooksIdFromKey(id)) as string[]
      return (
        <FlatListApiStatusHandler
          style={ style }
          apiStatus={ apiStatus }
          dataArray={ ids }
          flatList={ (
            <BookList
              eans={ ids }
              onRefresh={ onRefresh }
              onEndReached={ onEndReached }
              fetching={ isBookSearchBusy }
              showLibraryStatus
              ActionComponent={ BooksResultActionComponent }
              onActionPress={ onBookResultActionPress }
              actionedBookList={ bookResultsActionedEans }
              listContentContainerStyle={ contentContainerStyle }
            />
          ) }
          noResultsStateComponent={ renderEmpty() }
        />
      )
    }
  }
}

export default connector(SearchResultList)
