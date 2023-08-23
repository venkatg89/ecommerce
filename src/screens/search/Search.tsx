import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'
import { debounce } from 'lodash'
import HeaderContainer from 'src/controls/layout/HeaderContainer'

import Container from 'src/controls/layout/ScreenContainer'
import _ScrollContainer from 'src/controls/layout/ScrollContainer'
import _SearchInput from 'src/controls/form/SearchInput'
import SearchHistory from 'src/components/Search/History'
import SearchAutocomplete from 'src/components/Search/Autocomplete'
import _SearchResultsWithFilter from 'src/components/Search/ResultsWithFilter'
import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'

import { getSearchAutocompleteAction } from 'src/redux/actions/search/typeAhead'
import { SearchTypeAheadModel } from 'src/models/SearchModel'
import { getRecentlyViewedAction } from 'src/redux/actions/pdp/recentlyViewed'
import { recentlyViewedSelector } from 'src/redux/selectors/pdpSelector'
import { Params } from 'src/constants/routes'

const ScrollContainer = styled(_ScrollContainer)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const SearchInput = styled(_SearchInput)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const SearchResultsWithFilter = styled(_SearchResultsWithFilter)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

interface OnSelectAutocompleteParams {
  searchTerm: string
  filterTerm: string
  disableInputChange?: boolean
}

interface StateProps {
  recentlyViewed: string[]
}

const selector = createStructuredSelector({
  recentlyViewed: recentlyViewedSelector,
})

interface DispatchProps {
  getRecentlyViewed: () => void
  getSearchAutocomplete: (query) => (undefined | SearchTypeAheadModel)
}

const dispatcher = dispatch => ({
  getRecentlyViewed: () => dispatch(getRecentlyViewedAction()),
  getSearchAutocomplete: (query) => dispatch(getSearchAutocompleteAction(query)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

enum SearchContentType {
  HISTORY = 'history',
  AUTOCOMPLETE = 'autocomplete',
  RESULTS = 'result',
}

const SearchScreen = ({ recentlyViewed, getRecentlyViewed, navigation, getSearchAutocomplete }: Props) => {
  const [searchContent, setSearchContent] = useState<SearchContentType>(SearchContentType.HISTORY)
  const [searchValue, setSearchValue] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterTerm, setFilterTerm] = useState<string>('')

  const [searchTypeAheadResults, setSearchTypeAheadResults] = useState<SearchTypeAheadModel | undefined>(undefined)

  useEffect(() => {
    const query = navigation.getParam(Params.SEARCH_QUERY)
    if (query) {
      onSelectAutocomplete({ searchTerm: query, filterTerm: '' })
    }
  }, [])

  const onReset = () => {
    setSearchContent(SearchContentType.HISTORY)
    setSearchValue('')
    setSearchTerm('')
    setFilterTerm('')
    setSearchTypeAheadResults(undefined)
  }

  useEffect(() => {
    getRecentlyViewed()
  }, [])

  const onSubmit = () => {
    setSearchContent(SearchContentType.RESULTS)
    onSelectAutocomplete({ searchTerm: searchValue, filterTerm: '' })
  }

  const debounceGetSearchAutocompleteData = useCallback(debounce(async (searchValue) => {
    const results = await getSearchAutocomplete(searchValue)
    if (!results || searchContent === SearchContentType.RESULTS) { return null }
    setSearchTypeAheadResults(results)
    const { pageLinkSuggestion, categorySuggestions, productSuggestions } = results
    if (!pageLinkSuggestion.length && !categorySuggestions.length && !productSuggestions.length) {
      onSelectAutocomplete({ searchTerm: searchValue, filterTerm: '', disableInputChange: true })
    } else {
      setIsLoading(false)
    }
  }, 500), [])

  const onSearchInputChange = (value) => {
    if (value) {
      setIsLoading(true)
      setSearchContent(SearchContentType.AUTOCOMPLETE)
      debounceGetSearchAutocompleteData(value)
    } else {
      setIsLoading(false)
      setSearchContent(SearchContentType.HISTORY)
    }
    setSearchValue(value)
  }

  const onSelectAutocomplete = ({ searchTerm, filterTerm, disableInputChange }: OnSelectAutocompleteParams) => {
    setSearchTerm(searchTerm)
    setFilterTerm(filterTerm)
    if (!disableInputChange) {
      setSearchValue(searchTerm)
    }
    setSearchContent(SearchContentType.RESULTS)
  }

  const onBarcodeScannedSuccess = (ean) => {
    onSelectAutocomplete({ searchTerm: ean, filterTerm: '' })
  }

  return (
    <Container>
      <SearchInput
        placeholder="Search by Title, Author, or ISBN"
        value={ searchValue }
        onChange={ onSearchInputChange }
        onReset={ onReset }
        onBarcodeScannedSuccess={ onBarcodeScannedSuccess }
        onSubmit={ onSubmit }
      />
      { searchContent === SearchContentType.HISTORY && !isLoading && (
        <ScrollContainer>
          <SearchHistory />
          <BookCarouselHorizontalRow
            header="Recently Viewed"
            eans={ recentlyViewed }
            size="large"
          />
        </ScrollContainer>
      ) }
      { searchContent === SearchContentType.AUTOCOMPLETE && !isLoading && (
        <ScrollContainer>
          <SearchAutocomplete
            results={ searchTypeAheadResults }
            onSelectAutocomplete={ onSelectAutocomplete }
          />
        </ScrollContainer>
      ) }
      { searchContent === SearchContentType.RESULTS && (
        <SearchResultsWithFilter
          searchTerm={ searchTerm }
          initialFilterTerm={ filterTerm }
        />
      ) }
    </Container>
  )
}

SearchScreen.navigationOptions = ({ navigation }) => ({
  title: 'Search',
  header: headerProps => <HeaderContainer />,
})

export default connector(SearchScreen)
