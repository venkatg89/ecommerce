import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Alert from 'src/controls/Modal/Alert'

import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { CartSummary } from 'src/models/CafeModel/CartModel'
import { push, Routes } from 'src/helpers/navigationService'
import { checkedInVenueSelector, cafeCartSelector } from 'src/redux/selectors/cafeSelector'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-self: center;
  align-items: center;
  justify-content: center;
`

const VenueText = styled.Text`
  flex-shrink: 1;
  text-align: center;
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
  line-height: 24;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-left: ${({ theme }) => theme.spacing(1)};
  tint-color: ${({ theme }) => theme.palette.linkGreen};
`

interface OwnProps {
  style?: any;
}

interface StateProps {
  venue?: CafeVenue;
  cart: CartSummary;
}

const selector = createStructuredSelector({
  venue: checkedInVenueSelector,
  cart: cafeCartSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const SelectedVenueHeader = ({ style, venue, cart }: Props) => {
  const [isOpenState, setIsOpenState] = useState<boolean>(false)

  const onPress = useCallback(() => {
    if (venue && cart.items.length) {
      setIsOpenState(true)
    } else {
      push(Routes.CAFE__SEARCH_VENUES)
    }
  }, [venue, cart.items])

  return (
    <Container
      accessible
      accessibilityRole="button"
      style={ style }
      onPress={ onPress }
    >
      <VenueText numberOfLines={ 1 }>
        { venue ? venue.name : 'Choose store' }
      </VenueText>
      <Icon source={ icons.locationPin } />
      <Alert
        isOpen={ isOpenState }
        onDismiss={ () => { setIsOpenState(false) } }
        title="Changing location will reset your order"
        description="If you change your store location, your cart items will be removed."
        buttons={ [{ title: 'CHANGE STORE', onPress: () => { push(Routes.CAFE__SEARCH_VENUES) }, warning: true }] }
        cancelText = "Not now"
      />
    </Container>
  )
}

export default connector(SelectedVenueHeader)
