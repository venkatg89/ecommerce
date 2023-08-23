import React, { useEffect, useContext, useMemo } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Button from 'src/controls/Button'
import PaymentCardList from 'src/components/Cafe/PaymentCardList'

import {
  getContentContainerStyleWithAnchor,
  useResponsiveDimensions,
} from 'src/constants/layout'

import { fetchPaymentCardsAction } from 'src/redux/actions/cafe/paymentsAction'
import { ThemeModel } from 'src/models/ThemeModel'
import { Routes, navigate, pop } from 'src/helpers/navigationService'

const ButtonWrapper = styled.View`
  margin: ${({ theme }) => theme.spacing(2)}px;
`

const AddNewPaymentButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)}px;
`

const SelectPaymentButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing(2)}px;
`

interface DispatchProps {
  fetchPaymentCards: () => void
}

const dispatcher = (dispatch) => ({
  fetchPaymentCards: () => dispatch(fetchPaymentCardsAction()),
})

const connector = connect<{}, DispatchProps, {}>(null, dispatcher)

type Props = DispatchProps

const ChoosePaymentCardScreen = ({ fetchPaymentCards }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  useEffect(() => {
    fetchPaymentCards()
  }, [])
  const contentContainerStyle = useMemo(
    () => getContentContainerStyleWithAnchor(theme, width),
    [theme, width],
  )

  const addNewCard = () => {
    navigate(Routes.CAFE__ADD_PAYMENT_CARD)
  }

  return (
    <Container>
      <PaymentCardList contentContainerStyle={contentContainerStyle} />
      <ButtonWrapper>
        <AddNewPaymentButton
          accessibilityLabel="add new payment option"
          onPress={addNewCard}
          variant="outlined"
          maxWidth
          linkGreen
        >
          Add payment method
        </AddNewPaymentButton>
        <SelectPaymentButton
          accessibilityLabel="add new payment option"
          onPress={pop}
          variant="contained"
          maxWidth
        >
          Apply in checkout
        </SelectPaymentButton>
      </ButtonWrapper>
    </Container>
  )
}

ChoosePaymentCardScreen.navigationOptions = () => ({
  headerTitle: 'Payment Options',
})

export default connector(ChoosePaymentCardScreen)
