import React from 'react'
import styled from 'styled-components/native'

import { SearchTypeAheadModel } from 'src/models/SearchModel'

const Container = styled.View``

const ResultsText = styled.Text`
  ${({ theme, bold }) => bold ? theme.typography.subTitle1 : theme.typography.body1 }
  ${({ theme, indent }) => indent ? `margin-left: ${theme.spacing(3)};` : '' }
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ResultButton = styled.TouchableOpacity``

interface SelectAutocompleteParam {
  searchTerm: string
  filterTerm: string
}

interface OwnProps {
  results?: SearchTypeAheadModel
  onSelectAutocomplete: (param: SelectAutocompleteParam) => void
}

type Props = OwnProps

const SearchAutocomplete = ({ results, onSelectAutocomplete }: Props  ) => {
  if (!results) { return null }
  const { pageLinkSuggestion, categorySuggestions, productSuggestions } = results
  if (!pageLinkSuggestion.length && !categorySuggestions.length && !productSuggestions.length) { return null }

  return (
    <Container>
      { pageLinkSuggestion.map((_pageLinkSuggestion, index) => (
        <ResultButton key={ index } onPress={ () => { onSelectAutocomplete({ searchTerm: _pageLinkSuggestion.searchTerm, filterTerm: _pageLinkSuggestion.filterTerm }) } }>
          <ResultsText bold>{ _pageLinkSuggestion.name || _pageLinkSuggestion.searchTerm }</ResultsText>
        </ResultButton>
      )) }
      { categorySuggestions[0] && (
          <ResultsText>{ categorySuggestions[0].searchTerm }</ResultsText>
      ) }
      { categorySuggestions.map((categorySuggestion, index) => (
        <ResultButton key={ index } onPress={ () => { onSelectAutocomplete({ searchTerm: categorySuggestion.searchTerm, filterTerm: categorySuggestion.filterTerm }) } }>
          <ResultsText indent>in { categorySuggestion.category }</ResultsText>
        </ResultButton>
      )) }
      { productSuggestions.map((productSuggestion, index) => (
        <ResultButton key={ index } onPress={ () => { onSelectAutocomplete({ searchTerm: productSuggestion.searchTerm, filterTerm: productSuggestion.filterTerm }) } }>
          <ResultsText>{ productSuggestion.searchTerm }</ResultsText>
        </ResultButton>
      )) }
    </Container>
  )
}

export default SearchAutocomplete
