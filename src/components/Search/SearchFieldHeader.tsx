import React from 'react'
import styled from 'styled-components/native'
import { CONTENT_VERTICAL_PADDING } from 'src/constants/layout'

import _SearchInput from 'src/controls/form/SearchInput'

import { goBack } from 'src/helpers/navigationService'
import { SearchTypesKeys } from 'src/constants/search'

const Container = styled.View`
  align-self: center;
  flex-direction: row;
  padding-vertical: ${CONTENT_VERTICAL_PADDING};
`

const SearchInput = styled(_SearchInput)`
  flex: 1;
`

const CancelButton = styled.TouchableOpacity`
  margin-left: ${({ theme }) => theme.spacing(2)};
  padding-vertical: ${({ theme }) => theme.spacing(1)};
  align-self: center;
`

const CancelText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
`

interface Props {
  style?: any;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  onBarcodeScannedSuccess: () => void;
  showBackButton?: boolean;
  searchType?: SearchTypesKeys
}

const PlaceholderText = {
  [SearchTypesKeys.BOOKS]: 'Search by Title, Author or ISBN',
  [SearchTypesKeys.READERS]: 'Search by Pen Name',
  [SearchTypesKeys.QUESTIONS]: 'Search by Topic, Genre, Title, or Author',
  [SearchTypesKeys.ANSWERS]: 'Search by Topic, Genre, Title, or Author',
  [SearchTypesKeys.CATEGORIES]: 'Search for Your Favorites',
}

const SearchFieldHeader = ({ style, value, onChange, onSubmit, onReset, onBarcodeScannedSuccess, showBackButton, searchType }: Props) => (
  <Container style={ style }>
    <SearchInput
      value={ value }
      onChange={ onChange }
      onSubmit={ onSubmit }
      onReset={ onReset }
      onBarcodeScannedSuccess={ onBarcodeScannedSuccess }
      autoFocus
      noScanner={ searchType && !(searchType === SearchTypesKeys.BOOKS) }
      placeholder={ PlaceholderText[searchType || SearchTypesKeys.BOOKS] || PlaceholderText[SearchTypesKeys.BOOKS] }
    />
    {
      showBackButton && (
        <CancelButton
          accessibilityLabel="cancel"
          accessibilityRole="button"
          onPress={ () => { goBack() } }
        >
          <CancelText>
            CANCEL
          </CancelText>
        </CancelButton>
      )
    }
  </Container>
)


export default SearchFieldHeader
