import React from 'react'
import styled from 'styled-components/native'

import { navigate, Routes } from 'src/helpers/navigationService'
import { ON_SCAN_SUCCESS_CALLBACK_PARAM } from 'src/screens/search/BarCodeScanner'
import { nav, icons } from 'assets/images'
import Button from 'src/controls/Button'
import _TextField from 'src/controls/form/TextField'

const Container = styled.View`
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const TextField = styled(_TextField)``

interface Props {
  style?: any;
  value: string;
  autoFocus?: boolean;
  placeholder?: string
  onChange: (value: string) => void
  onSubmit?: () => void
  noScanner?: boolean
  onReset?: () => void
  onBarcodeScannedSuccess?: (ean) => void;
}

const SearchInput = ({
  style, value, autoFocus, placeholder, onChange, onSubmit, noScanner, onReset = () => {}, onBarcodeScannedSuccess,
}: Props) => {
  const onPressBarcode = () => {
    navigate(Routes.SEARCH__BARCODE_SCAN, { [ON_SCAN_SUCCESS_CALLBACK_PARAM]: onBarcodeScannedSuccess })
  }

  return (
    <Container style={ style }>
      <TextField
        placeholder={ placeholder || 'Search' }
        onChange={ onChange }
        onSubmitEditing={ onSubmit }
        value={ value }
        autoFocus={ autoFocus }
        startAdornment={
          <Icon source={ nav.topBar.loupe } />
        }
        endAdornment={ (
          value ? <Button icon onPress={ onReset }><Icon source={ icons.searchClose } /></Button>
            : !noScanner && (
            <Button accessibilityLabel="scan a barcode" onPress={ onPressBarcode } icon>
              <Icon source={ nav.scanbar } />
            </Button>
            )
        ) }
        returnKeyType="search"
      />
    </Container>
  )
}

export default React.memo(SearchInput)
