import React from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import { push, Routes } from 'src/helpers/navigationService'

const Container = styled.TouchableOpacity``

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
`

const PaymentCardsButton = () => (
  <Container
    accessibilityLabel="choose payment option"
    accessibilityRole="button"
    onPress={ () => { push(Routes.CAFE__CHOOSE_PAYMENT_CARD) } }
  >
    <Icon source={ icons.creditCard } />
  </Container>
)

export default PaymentCardsButton
