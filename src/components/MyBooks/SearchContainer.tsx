import React, { useState, useCallback, useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import { SearchTypesKeys } from 'src/constants/search'
import { Ean } from 'src/models/BookModel'

import { fetchSearchResultsAction, fetchMoreSearchResultsAction, FetchSearchResultsActionParams } from 'src/redux/actions/legacySearch/searchResultsAction'

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
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  selectedbookEans: Ean[];
  onSelectBook: (ean: Ean) => void;
}

interface DispatchProps {
  fetchSearchResults: (params: FetchSearchResultsActionParams) => void
  fetchMoreSearchResults: (params: FetchSearchResultsActionParams) => void
}

const dispatcher = dispatch => ({
  fetchSearchResults: params => dispatch(fetchSearchResultsAction(params)),
  fetchMoreSearchResults: params => dispatch(fetchMoreSearchResultsAction(params)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = DispatchProps & OwnProps

const SearchContainer = ({ style, contentContainerStyle, fetchSearchResults, fetchMoreSearchResults, selectedbookEans, onSelectBook }: Props) => {
  const [queryState, setQueryState] = useState<string>('')
  const [previousQueryState, setPreviousQueryState] = useState<string>('')

  const onSearchSubmit = useCallback(() => {
    if (queryState === previousQueryState) { return }
    fetchSearchResults({ query: queryState, searchType: SearchTypesKeys.BOOKS })
    setPreviousQueryState(queryState)
  }, [queryState, previousQueryState])

  const onLoadMore = useCallback(() => {
    fetchMoreSearchResults({ query: queryState, searchType: SearchTypesKeys.BOOKS })
  }, [queryState])

  const onSearchReset = useCallback((barcode = false) => () => {
    setQueryState('')
    if (!barcode) { setPreviousQueryState('') }
  }, [])

  const onRefresh = useCallback(() => {
    fetchSearchResults({ query: queryState, searchType: SearchTypesKeys.BOOKS })
  }, [queryState])

  const _style = useMemo(() => (
    [contentContainerStyle, { flex: 0, flexGrow: 0, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }, style]
  ), [style, contentContainerStyle])

  return (
    <Container>
      <SearchFieldHeader
        style={ _style }
        value={ queryState }
        onChange={ setQueryState }
        onSubmit={ onSearchSubmit }
        onReset={ onSearchReset() }
        onBarcodeScannedSuccess={ onSearchReset(true) }
      />
      <SearchResultList
        contentContainerStyle={ contentContainerStyle }
        searchType={ SearchTypesKeys.BOOKS }
        onRefresh={ onRefresh }
        onEndReached={ onLoadMore }
        BooksResultActionComponent={ AddToListActionButton }
        onBookResultActionPress={ onSelectBook }
        bookResultsActionedEans={ selectedbookEans }
      />
    </Container>
  )
}

export default connector(SearchContainer)
