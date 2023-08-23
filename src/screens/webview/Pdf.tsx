import React, { useMemo } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import _Pdf from 'react-native-pdf'
import styled from 'styled-components/native'

import config from 'config'

import Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'

import { Params } from 'src/helpers/navigationService'

export enum PdfFile {
  CAFE_NUTRITION = 'cafe_nutrition',
  CAFE_TERMS_SALE = 'cafe_terms_sale',
}

const Pdf = styled(_Pdf)`
  width: 100%;
  height: 100%;
`

type Props = NavigationInjectedProps

const PdfScreen = ({ navigation }: Props) => {
  const pdfSource = useMemo(() => {
    switch (navigation.getParam(Params.PDF_FILE)) {
      case PdfFile.CAFE_NUTRITION: {
        return config.api.speedetab.nutritionPdf
      }
      case PdfFile.CAFE_TERMS_SALE: {
        return config.api.speedetab.termsSalePdf
      }
      default:
        return undefined
    }
  }, [navigation.getParam(Params.PDF_FILE, '')])

  return (
    <Container>
      <Pdf
        source={ { uri: pdfSource, cache: true } }
        maxScale={ 100 }
      />
    </Container>
  )
}

PdfScreen.navigationOptions = () => ({
  header: headerProps => <Header headerProps={ headerProps } />,
})

export default PdfScreen
