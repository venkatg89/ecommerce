import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'

import { SearchTypesKeys } from 'src/constants/search'
import { Ean } from 'src/models/BookModel'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

import {
  fetchSearchResultsAction,
  FetchSearchResultsActionParams,
  fetchMoreSearchResultsAction,
} from 'src/redux/actions/legacySearch/searchResultsAction'
import {
  addOnboardingBookAction,
  removeOnboardingBookAction,
} from 'src/redux/actions/onboarding'
import { updateReadingStatusAction } from 'src/redux/actions/user/nodeProfileActions'

import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { onboardingBookListEansSelector } from 'src/redux/selectors/onboarding/booksSelector'

import SearchFieldHeader from 'src/components/Search/SearchFieldHeader'
import _SearchResultList from 'src/components/Search/ResultList'
import AddToThisListActionButton from 'src/components/BookGridList/AddToThisListActionButton'

const Container = styled.View`
  flex: 1;
`

const SearchResultList = styled(_SearchResultList)`
  flex: 1;
`

const AddToListActionButton = styled(AddToThisListActionButton)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}

interface StateProps {
  readBooks: Record<Ean, ReadingStatus>
  isUserLoggedIn: boolean
}

interface DispatchProps {
  addOnboardingBook(ean: Ean, isUserLoggedIn: boolean)
  removeOnboardingBook(ean: Ean, isUserLoggedIn: boolean)
  fetchSearchResults: (params: FetchSearchResultsActionParams) => void
  fetchMoreSearchResults: (params: FetchSearchResultsActionParams) => void
}

const selector = () => {
  const _onboardingSelector = onboardingBookListEansSelector()

  return (state, ownProps) => ({
    readBooks: _onboardingSelector(state),
    isUserLoggedIn: isUserLoggedInSelector(state),
  })
}

const dispatcher = (dispatch) => ({
  addOnboardingBook: async (ean: Ean, isUserLoggedIn: boolean) => {
    if (!isUserLoggedIn) {
      await dispatch(addOnboardingBookAction(ean))
      return
    }
    await dispatch(
      updateReadingStatusAction({ [ean]: { status: ReadingStatus.FINISHED } }),
    )
  },
  removeOnboardingBook: (ean: Ean, isUserLoggedIn: boolean) =>
    !isUserLoggedIn
      ? dispatch(removeOnboardingBookAction(ean))
      : dispatch(updateReadingStatusAction({ [ean]: { status: null } })),
  fetchSearchResults: (params) => dispatch(fetchSearchResultsAction(params)),
  fetchMoreSearchResults: (params) =>
    dispatch(fetchMoreSearchResultsAction(params)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps & NavigationInjectedProps

const SearchContainer = ({
  navigation,
  style,
  contentContainerStyle,
  fetchSearchResults,
  fetchMoreSearchResults,
  removeOnboardingBook,
  addOnboardingBook,
  readBooks,
  isUserLoggedIn,
}: Props) => {
  const [query, setQuery] = useState<string>('')
  const [previousQuery, setPrevious] = useState<string>('')

  const onSearchSubmit = () => {
    if (query === previousQuery) {
      return
    }
    fetchSearchResults({ query, searchType: SearchTypesKeys.BOOKS })
    setPrevious(query)
  }

  const onSearchReset = (barcode = false) => () => {
    setQuery('')
    if (!barcode) {
      setPrevious('')
    }
  }

  const onRefresh = () =>
    fetchSearchResults({ query, searchType: SearchTypesKeys.BOOKS })

  const loadMore = () =>
    fetchMoreSearchResults({ query, searchType: SearchTypesKeys.BOOKS })

  const onPressBook = useCallback(
    (ean) => {
      if (readBooks[ean]) {
        removeOnboardingBook(ean, isUserLoggedIn)
      } else {
        addOnboardingBook(ean, isUserLoggedIn)
      }
    },
    [readBooks, isUserLoggedIn],
  )

  useEffect(() => {
    navigation.setParams({ _addBookToList: onPressBook })
  }, [onPressBook])

  useEffect(() => {
    navigation.setParams({ _onboarding: true })
  }, [])

  const selectedBookEans = Object.keys(readBooks)
  const _style = useMemo(
    () => [
      contentContainerStyle,
      {
        flex: 0,
        flexGrow: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      },
      style,
    ],
    [style, contentContainerStyle],
  )

  return (
    <Container>
      <SearchFieldHeader
        style={_style}
        value={query}
        onChange={setQuery}
        onSubmit={onSearchSubmit}
        onReset={onSearchReset()}
        onBarcodeScannedSuccess={onSearchReset(true)}
      />
      <SearchResultList
        contentContainerStyle={contentContainerStyle}
        searchType={SearchTypesKeys.BOOKS}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        BooksResultActionComponent={AddToListActionButton}
        onBookResultActionPress={onPressBook}
        bookResultsActionedEans={selectedBookEans}
      />
    </Container>
  )
}

export default withNavigation(connector(SearchContainer))
