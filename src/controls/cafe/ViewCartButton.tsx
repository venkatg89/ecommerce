import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import { CartSummary } from 'src/models/CafeModel/CartModel'
import { navigate, Routes } from 'src/helpers/navigationService'

import { updateCartAction } from 'src/redux/actions/cafe/cartAction'
import { cafeCartSelector, checkedInVenueIdSelector } from 'src/redux/selectors/cafeSelector'

const Container = styled.TouchableOpacity`
  position: relative;
`

interface OwnProps {
  large?: boolean;
}

const Icon = styled.Image<OwnProps>`
  height: ${({ theme, large }) => theme.spacing(large ? 4 : 3)};
  width: ${({ theme, large }) => theme.spacing(large ? 4 : 3)};
`

const NumberContainer = styled.View<OwnProps>`
  position: absolute;
  top: 0;
  right: 0;
  height: ${({ theme, large }) => (theme.spacing(2) * (large ? 1 : 0.75))};
  width: ${({ theme, large }) => (theme.spacing(2) * (large ? 1 : 0.75))};
  border-radius: ${({ theme, large }) => (theme.spacing(1) * (large ? 1 : 0.75))};
  background-color: ${({ theme }) => (theme.palette.secondaryBlue)};
  justify-content: center;
`

const NumberText = styled.Text`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.white};
  text-align: center;
`

interface StateProps {
  checkedInVenue?: string;
  cart: CartSummary;
}

const selector = createStructuredSelector({
  cart: cafeCartSelector,
  checkedInVenue: checkedInVenueIdSelector,
})

interface DispatchProps {
  updateCart: () => void;
}

const dispatcher = dispatch => ({
  updateCart: () => dispatch(updateCartAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const ViewCartButton = ({ large, cart, checkedInVenue, updateCart }: Props) => {
  useEffect(() => {
    updateCart()
  }, [checkedInVenue])

  const onPress = useCallback(() => {
    navigate(Routes.CAFE__CHECKOUT)
  }, [])

  return (
    <Container
      accessibilityLabel="view cart"
      accessibilityRole="button"
      onPress={ onPress }
    >
      <Icon source={ icons.checkout } large={ large } />
      { cart.items.length && (
        <NumberContainer large={ large }>
          { large && (
            <NumberText>{ cart.items.length }</NumberText>
          ) || undefined }
        </NumberContainer>
      ) || undefined }
    </Container>
  )
}

export default connector(ViewCartButton)
