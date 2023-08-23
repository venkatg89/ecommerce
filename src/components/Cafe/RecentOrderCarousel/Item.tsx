import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { ActivityIndicator } from 'react-native'
import Alert from 'src/controls/Modal/Alert'
import { navigate, Routes } from 'src/helpers/navigationService'
import { CafeRecentOrder } from 'src/models/CafeModel/OrderModel'
import { AddOrderToCart, CartSummary } from 'src/models/CafeModel/CartModel'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { toMonthDay } from 'src/helpers/dateFormatters'
import { fetchRecentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import { addRecentOrderToCartAction } from 'src/redux/actions/cafe/cartAction'
import { checkInVenueAction } from 'src/redux/actions/cafe/checkInAction'
import { dismissGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import {
  checkedInVenueIdSelector,
  venueFromIdSelector,
  cafeCartSelector,
  recentOrdersSelector,
} from 'src/redux/selectors/cafeSelector'
import { activeGlobalModalSelector } from 'src/redux/selectors/widgetSelector'
import { GlobalModals } from 'src/constants/globalModals'

const MainContainer = styled.View`
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.15);
  background-color: white;
`
const Container = styled.TouchableOpacity`
  flex-grow: 1;
  border-radius: 4;
  border-width: 1;
  border-color: ${({ theme }) => theme.palette.disabledGrey};
  background-color: ${({ theme }) => theme.palette.white};
  width: 192;
  height: 146;
  overflow: hidden;
`

const Image = styled.Image`
  height: 72;
  width: 72;
  margin-right: 8;
  overflow: hidden;
`

const ImagesContainer = styled.View`
  flex-direction: row;
  margin-left: 16;
`
const TextContainer = styled.View`
  padding-top: 16;
  padding-bottom: 8;
  padding-left: 16;
  padding-right: 8;
`

const DateText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 16;
  margin-right: ${({ theme }) => theme.spacing(1)};
`
const DateContainer = styled.View`
  flex-direction: row;
`

const NamesText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  font-size: 12;
  margin-top: 4;
`

interface OwnProps {
  order: CafeRecentOrder
}

interface StateProps {
  checkedInVenue?: string
  cart: CartSummary
  venue?: CafeVenue
  recentOrders: Record<string, CafeRecentOrder>
  activeGlobalModal?: string
}

const selector = createStructuredSelector({
  recentOrders: recentOrdersSelector,
  checkedInVenue: checkedInVenueIdSelector,
  cart: cafeCartSelector,
  venue: (state, ownProps) => {
    const { venueId } = ownProps.order
    return venueFromIdSelector(state, { venueId })
  },
  activeGlobalModal: activeGlobalModalSelector,
})

interface DispatchProps {
  checkInVenue: (venueId: string) => void
  addRecentOrderToCart: (params: CafeRecentOrder) => boolean
  fetchRecentOrders: () => void
  dismissModal: () => void
}

const dispatcher = (dispatch) => ({
  checkInVenue: (venueId) => dispatch(checkInVenueAction(venueId)),
  addRecentOrderToCart: (params) =>
    dispatch(addRecentOrderToCartAction(params)),
  fetchRecentOrders: () => dispatch(fetchRecentOrdersAction()),
  dismissModal: () => dispatch(dismissGlobalModalAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const RecentOrderItem = ({
  order,
  addRecentOrderToCart,
  checkedInVenue,
  cart,
  venue,
  checkInVenue,
  activeGlobalModal,
  recentOrders,
  fetchRecentOrders,
  dismissModal,
}: Props) => {
  const [modalOpenState, setModalOpenState] = useState<
    'closed' | 'changeVenue' | 'addonToCurrentOrder' | 'itemOutOfStock'
  >('closed')
  const [outOfStockItems, setOutOfStockItems] = useState<AddOrderToCart[]>([])
  const [pending, setIsPending] = useState<Boolean>(false)
  useEffect(() => {
    setOutOfStockItems(
      recentOrders[order.id].items.filter((item) => item.outOfStock === true),
    )
  }, [recentOrders])

  const getOutOfStockTitle = useCallback(() => {
    return outOfStockItems.length && outOfStockItems[0] !== null
      ? outOfStockItems[0].name + ' is out of stock'
      : ''
  }, [outOfStockItems])

  const addRecentOrder = async (changeStore?: boolean) => {
    if (changeStore) {
      await checkInVenue(order.venueId)
    }
    const success = await addRecentOrderToCart(order)
    if (success) {
      setIsPending(false)
      navigate(Routes.CAFE__CHECKOUT)
    }
  }

  const showSpinner = useMemo(() => pending, [pending])

  const onPress = useCallback(() => {
    if (checkedInVenue === order.venueId) {
      if (
        outOfStockItems.length ||
        activeGlobalModal === GlobalModals.CAFE_ITEM_OUT_OF_STOCK
      ) {
        setModalOpenState('itemOutOfStock')
        return
      }
      if (cart.items.length) {
        setModalOpenState('addonToCurrentOrder')
      } else {
        addRecentOrder()
      }
    } else {
      setModalOpenState('changeVenue')
    }
  }, [checkInVenue, cart, order, outOfStockItems, activeGlobalModal])

  const closeModal = useCallback(() => {
    setModalOpenState('closed')
    dismissModal()
    setIsPending(false)
  }, [])

  const displayPhotos = () => {
    return order.items.map(
      (item, index) =>
        !item.image?.includes('missing') && (
          <Image key={item.itemId + index} source={{ uri: item.image }} />
        ),
    )
  }

  const displayNames = () => {
    let nameList = ''
    for (let i = 0; i < order.items.length; i++) {
      if (i !== order.items.length - 1) {
        nameList = nameList + order.items[i].name + ', '
      } else {
        nameList = nameList + order.items[i].name
      }
    }
    return nameList
  }

  return (
    <MainContainer style={{ elevation: 4 }}>
      <Container
        onPress={async () => {
          setIsPending(true)
          await fetchRecentOrders()
          onPress()
        }}
      >
        <TextContainer>
          <DateContainer>
            <DateText>{toMonthDay(order.dateCreated)}</DateText>
            {showSpinner && <ActivityIndicator size="small" color="grey" />}
          </DateContainer>
          <NamesText numberOfLines={1}>{displayNames()}</NamesText>
        </TextContainer>
        <ImagesContainer>{displayPhotos()}</ImagesContainer>
        <Alert
          isOpen={modalOpenState === 'changeVenue'}
          title="Recent order made at another location"
          description={`This order was made at ${
            (venue && venue.name) || 'a different location'
          }. You can only place recent orders from the same location.`}
          buttons={[
            {
              title: 'CHANGE STORE',
              onPress: () => {
                addRecentOrder(true)
              },
            },
          ]}
          onDismiss={closeModal}
          cancelText="Not now"
        />
        <Alert
          isOpen={modalOpenState === 'addonToCurrentOrder'}
          title="Cart already has items"
          description="Do you still want to add this recent order to your current cart?"
          buttons={[{ title: 'ADD TO CART', onPress: addRecentOrder }]}
          onDismiss={closeModal}
        />
        <Alert
          isOpen={modalOpenState === 'itemOutOfStock'}
          title={getOutOfStockTitle()}
          description="Sorry, we can't offer everything in this order. Would you like to continue with the other items in this order?"
          buttons={[
            {
              title: 'CONTINUE TO CHECKOUT',
              onPress: () => {
                addRecentOrder()
                dismissModal()
              },
            },
          ]}
          onDismiss={closeModal}
          cancelText="No thanks"
        />
      </Container>
    </MainContainer>
  )
}

export default connector(RecentOrderItem)
