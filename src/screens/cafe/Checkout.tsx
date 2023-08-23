import React, {
  useCallback,
  useMemo,
  useContext,
  useState,
  useEffect,
  createContext,
} from 'react'
import { ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import Button from 'src/controls/Button'
import _ScrollContainer from 'src/controls/KeyboardAwareScrollView'

import _LocationDetails from 'src/components/Cafe/LocationDetails'
import _CartOrderSummary from 'src/components/Cafe/CartOrderSummary'
import _SelectedVenueHeader from 'src/components/Cafe/SelectedVenueHeader'

import { CartSummary } from 'src/models/CafeModel/CartModel'
import { PaymentCard } from 'src/models/PaymentModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'

import { Routes, Params, reset } from 'src/helpers/navigationService'
import {
  getContentContainerStyleWithAnchor,
  useResponsiveDimensions,
} from 'src/constants/layout'

import {
  fetchCartAction,
  submitCafeOrderAction,
} from 'src/redux/actions/cafe/cartAction'
import {
  fetchPaymentCardsAction,
  deleteTempPaymentCardAction,
} from 'src/redux/actions/cafe/paymentsAction'
import { openCafeOrderProgressModalAction } from 'src/redux/actions/modals/cafeOrderProgress'
import {
  getSelectedPaymentCardSelector,
  cafeCartSelector,
  checkedInVenueIdSelector,
} from 'src/redux/selectors/cafeSelector'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'
import { submitOrderApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import { ThemeModel } from 'src/models/ThemeModel'
import { NavigationActions, NavigationEvents } from 'react-navigation'
import { getCafeProfileData } from 'src/data/cafe/profile'
import { CafeProfileModel } from 'src/models/CafeModel/ProfileModel'
import {
  addEventAction,
  LL_CAFE_ITEMS_PURCHASED,
  LL_CAFE_CHECKOUT_COMPLETE,
} from 'src/redux/actions/localytics'

const ScrollContainer = styled(_ScrollContainer)`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.palette.grey5};
`

const SelectedVenueHeader = styled(_SelectedVenueHeader)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const CartOrderSummary = styled(_CartOrderSummary)`
  margin-bottom: 16;
`

const LocationDetails = styled(_LocationDetails)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const PlaceOrderButton = styled(Button)``

interface ContextProps {
  getCafeProfile: () => void
}

export const CafeCheckoutVerifyPhoneContext = createContext<ContextProps>({
  getCafeProfile: () => {},
})

interface StateProps {
  venueId?: string
  cart: CartSummary
  selectedPaymentCard?: PaymentCard
  submitOrderApiRequestStatus: Nullable<RequestStatus>
  atgAccount?: AtgAccountModel
}

const selector = createStructuredSelector({
  venueId: checkedInVenueIdSelector,
  cart: cafeCartSelector,
  selectedPaymentCard: getSelectedPaymentCardSelector,
  submitOrderApiRequestStatus: submitOrderApiRequestStatusSelector,
  atgAccount: myAtgAccountSelector,
})

interface DispatchProps {
  fetchCart: () => void
  fetchPaymentCards: () => void
  submitOrder: () => boolean
  openCafeOrderProgressModal: () => void
  deleteTempPaymentCards: () => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  fetchCart: () => dispatch(fetchCartAction()),
  deleteTempPaymentCards: () => dispatch(deleteTempPaymentCardAction()),
  fetchPaymentCards: () => dispatch(fetchPaymentCardsAction()),
  submitOrder: () => dispatch(submitCafeOrderAction()),
  openCafeOrderProgressModal: () =>
    dispatch(openCafeOrderProgressModalAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const CheckoutScreen = ({
  venueId,
  cart,
  selectedPaymentCard,
  submitOrderApiRequestStatus,
  fetchCart,
  fetchPaymentCards,
  submitOrder,
  openCafeOrderProgressModal,
  deleteTempPaymentCards,
  addEvent,
  atgAccount,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()
  const [isFetching, setIsFetching] = useState(true)
  const [cafeProfile, setCafeProfile] = useState<CafeProfileModel | undefined>(
    undefined,
  )

  async function fetchApi() {
    setIsFetching(true)
    await Promise.all([fetchCart(), fetchPaymentCards()]).then(() =>
      setIsFetching(false),
    )
  }

  const showSpinner = useMemo(() => isFetching, [isFetching])

  const onSubmitOrder = useCallback(async () => {
    const orderId = await submitOrder()
    deleteTempPaymentCards()
    if (orderId) {
      reset(0, [
        NavigationActions.navigate({
          routeName: Routes.CAFE__ORDERS,
          params: { [Params.CAFE_CURRENT_ORDER_ID]: orderId },
        }),
      ])
    }
  }, [])

  const contentContainerStyle = useMemo(
    () => getContentContainerStyleWithAnchor(theme, width),
    [theme, width],
  )

  const getCafeProfile = async () => {
    const response = await getCafeProfileData()
    if (response) {
      setCafeProfile(response)
    }
  }

  useEffect(() => {
    getCafeProfile()
  }, [])

  const totalAmount = cart.items
    .map((cartItem) => cartItem.totalAmount)
    .reduce((a, b) => a + b, 0)

  const totalCount = cart.items
    .map((cartItem) => cartItem.count)
    .reduce((a, b) => a + b, 0)

  return (
    <CafeCheckoutVerifyPhoneContext.Provider value={{ getCafeProfile }}>
      <Container>
        <NavigationEvents onWillFocus={() => fetchApi()} />
        <SelectedVenueHeader />
        {showSpinner ? (
          <ActivityIndicator
            size="large"
            animating={showSpinner}
            color="grey"
          />
        ) : (
          <>
            <ScrollContainer contentContainerStyle={contentContainerStyle}>
              {(!!cart.items.length && !isFetching && (
                <LocationDetails venueId={venueId} />
              )) ||
                undefined}
              {!isFetching && (
                <CartOrderSummary cart={cart} cafeProfile={cafeProfile} />
              )}
            </ScrollContainer>
            <PlaceOrderButton
              variant="contained"
              onPress={async () => {
                await onSubmitOrder()
                cart.items.map((item) => {
                  const cafeItemPurchased = {
                    qty: item.count,
                    orderTotal: (item.totalAmount / 100).toFixed(2),
                    productType: 'No Value Set',
                    productTitle: item.item.name,
                  }

                  addEvent(LL_CAFE_ITEMS_PURCHASED, cafeItemPurchased)
                })

                const usingMemberships =
                  atgAccount?.membership?.bnMembership ||
                  atgAccount?.membership?.educator ||
                  atgAccount?.membership?.employee ||
                  atgAccount?.membership?.kidsClub

                const cafeCheckoutComplete = {
                  totalCount: totalCount,
                  orderTotal: (totalAmount / 100).toFixed(2),
                  productType: 'No Value Set',
                  productTitle: 'No Value Set',
                  coupon: cart.promoCode?.code ? 'yes' : 'no',
                  membershipLinked: usingMemberships ? 'yes' : 'no',
                }
                addEvent(LL_CAFE_CHECKOUT_COMPLETE, cafeCheckoutComplete)
              }}
              disabled={
                !selectedPaymentCard ||
                submitOrderApiRequestStatus === RequestStatus.FETCHING ||
                cart.items.length === 0 ||
                !cafeProfile?.isVerified
              }
              isAnchor
              showSpinner={
                submitOrderApiRequestStatus === RequestStatus.FETCHING
              }
            >
              Place order
              {cart.items.length ? ` - $${(totalAmount / 100).toFixed(2)}` : ''}
            </PlaceOrderButton>
          </>
        )}
      </Container>
    </CafeCheckoutVerifyPhoneContext.Provider>
  )
}

export default connector(CheckoutScreen)
