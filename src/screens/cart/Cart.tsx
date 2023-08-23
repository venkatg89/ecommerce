import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import Container from 'src/controls/layout/ScreenContainer'
import { NavigationEvents, NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CartItem from 'src/components/Cart/Item'
import ShippingDetailsComponent from 'src/components/Cart/ShippingDetailsComponent'
import BookCarouselHorizontalRow from 'src/components/BookCarousel/HorizontalRow'
import UndoItem from 'src/components/Cart/UndoItem'
import Button from 'src/controls/Button'
import {
  ShopCartItemModel,
  ShopCartModel,
} from 'src/models/ShopModel/CartModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { ShopOrderSummaryModel } from 'src/models/ShopModel/CheckoutModel'
import {
  ModifyCartAction,
  ModifyCartParams,
  SafeRemoveItemAction,
  SafeRemoveItemParams,
  refreshCartWithNewPriceAction,
  CheckoutAction,
  removeDigitalItemMessage,
  sendCartAsGiftAction,
  cartGiftApiStatusActions,
  getShopOrderSummaryAction,
} from 'src/redux/actions/shop/cartAction'
import {
  shopCartSelector,
  cartOrderSummarySelector,
} from 'src/redux/selectors/shopSelector'
import EnterDiscounts from 'src/components/Cart/EnterDiscounts'
import { itemsNoReducer } from 'src/helpers/cart'
import { cloneDeep } from 'lodash'
import Routes from 'src/constants/routes'
import OrderSummary from 'src/components/Cart/Checkout/OrderSummary'
import SaveForLater from 'src/components/Cart/Checkout/SaveForLater'
import { recentlyViewedSelector } from 'src/redux/selectors/pdpSelector'
import { getRecentlyViewedAction } from 'src/redux/actions/pdp/recentlyViewed'
import { Vibration } from 'react-native'
import { GlobalModals } from 'src/constants/globalModals'
import { PDP_ERROR_MODAL } from 'src/constants/formErrors'
import htmlToText from 'src/helpers/ui/htmlToText'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { ErrorMessage } from 'src/models/FormModel'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { getSuccessToastStyle } from 'src/constants/layout'
import { AddItemData, addItemToCart } from 'src/endpoints/atgGateway/cart'
import { ThemeModel } from 'src/models/ThemeModel'
import { useToast } from 'native-base'
import countLabelText from 'src/helpers/countLabelText'
import { usePrevious } from 'src/helpers/usePrevious'
import ListEmptyState from 'src/controls/EmptyState/ListEmptyState'

import { push } from 'src/helpers/navigationService'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { StoreModel } from 'src/models/StoreModel'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'
import { bopisStoreSelector } from 'src/redux/selectors/bopisStore'
import { setBopisStoreAction } from 'src/redux/actions/pdp/bopisStore'
import { fetchFavoriteStoreAction } from 'src/redux/actions/store/favorite'
import { myAtgAccountSelector } from 'src/redux/selectors/userSelector'

import {
  fetchNearestStoreAction,
  SearchStoreWithLocationActionParams,
} from 'src/redux/actions/store/search'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'
import {
  addEventAction,
  LL_ADD_TO_CART,
  LL_CHECKOUT_STARTED,
} from 'src/redux/actions/localytics'

import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import { isDigital } from 'src/constants/skutypes'

const DeliveryText = styled.Text`
  ${({ theme }) => theme.typography.title};
  color: ${({ theme }) => theme.palette.grey2};
  font-weight: bold;
`

const EmptyContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const FreeText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey3};
  text-transform: uppercase;
  margin-left: ${({ theme }) => theme.spacing(1)};
`

const DeliveryMethod = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`
const MethodDivider = styled.View`
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.grey5};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const EmptyDivider = styled.View`
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.grey5};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const RecentlyViewedContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const DigitalItemsContainer = styled.View`
  border-bottom-width: 1;
  border-bottom-color: ${({ theme }) => theme.palette.grey5};
`

const DigitalItemsText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const ScrollToTopHelper = styled.ScrollView``

//TODO make toast related components use metrics when updating toast support
const ToastBackground = styled.View`
  flex: 1;
  background: white;
  flex-direction: row;
  border: 1px solid gray;
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: center;
  align-items: center;
  margin-left: 20;
  margin-right: 20;
`
const ToastBody = styled.View`
  justify-content: center;
  align-items: center;
  width: 80%;
`
const ToastCTA = styled.View`
  align-items: center;
`
const ToastBodyText = styled.Text`
  font-size: 14;
  letter-spacing: 0.4;
`
const ButtonText = styled.Text`
  color: #347d56;
  font-size: 12;
  letter-spacing: 1.4;
  font-weight: bold;
`

const ViewBestsellersButton = styled(Button)`
  min-width: ${({ theme }) => theme.spacing(30)};
  padding: ${({ theme }) => theme.spacing(1.5)}px;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  cart: ShopCartModel
  recentlyViewed: string[]
  isUserLoggedIn: boolean
  orderSummary: Nullable<ShopOrderSummaryModel>
  bopisStore?: StoreModel
  favoriteStore?: StoreModel
  atgAccount?: AtgAccountModel
}

interface DispatchProps {
  modifyCart: (params: ModifyCartParams) => void
  safeRemove: (params: SafeRemoveItemParams) => void
  refreshCartWithNewPrice: () => void
  hideDigital: () => void
  checkout: () => boolean
  getRecentlyViewed: () => void
  setActiveGlobalModal: ({ id: string }) => void
  setError: (error: ErrorMessage) => void
  sendCartAsGift: (params) => void
  clearCartGiftApiStatusActions: () => void
  addEvent: (name, attributes) => void
  setBopisStore: (store: StoreModel) => void
  fetchFavoriteStore: () => void
  getNearestStore: (params: SearchStoreWithLocationActionParams) => any
  locationPermissionDenied: () => void
  getShopOrderSummary: () => void
}

const selector = createStructuredSelector<any, StateProps>({
  cart: shopCartSelector,
  recentlyViewed: recentlyViewedSelector,
  isUserLoggedIn: isUserLoggedInSelector,
  orderSummary: cartOrderSummarySelector,
  bopisStore: bopisStoreSelector,
  favoriteStore: favoriteStoreSelector,
  atgAccount: myAtgAccountSelector,
})

const dispatcher = (dispatch) => ({
  modifyCart: (params: ModifyCartParams) => dispatch(ModifyCartAction(params)),
  safeRemove: (params: SafeRemoveItemParams) =>
    dispatch(SafeRemoveItemAction(params)),
  refreshCartWithNewPrice: () => dispatch(refreshCartWithNewPriceAction()),
  hideDigital: () => dispatch(removeDigitalItemMessage()),
  checkout: () => dispatch(CheckoutAction()),
  getRecentlyViewed: () => dispatch(getRecentlyViewedAction()),
  setError: (error: ErrorMessage) =>
    dispatch(setformErrorMessagesAction(PDP_ERROR_MODAL, [error])),
  setActiveGlobalModal: (modal: { id: string }) =>
    dispatch(setActiveGlobalModalAction(modal)),
  sendCartAsGift: (params) => dispatch(sendCartAsGiftAction(params)),
  clearCartGiftApiStatusActions: () =>
    dispatch(cartGiftApiStatusActions.actions.clear),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
  setBopisStore: (store: StoreModel) => dispatch(setBopisStoreAction(store)),
  getNearestStore: (params) => dispatch(fetchNearestStoreAction(params)),
  fetchFavoriteStore: () => dispatch(fetchFavoriteStoreAction()),
  locationPermissionDenied: () => dispatch(permissionDeniedAction('location')),
  getShopOrderSummary: () => dispatch(getShopOrderSummaryAction()),
})

type Props = StateProps & DispatchProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const getModifyParams = (id: string, modifier: number) => ({ id, modifier })
const getSafeRemoveParams = (id: string, remove: boolean) => ({
  id,
  remove,
})

interface CartItemViewModel {
  item: ShopCartItemModel
  isMinusPending: boolean
  isAddPending: boolean
}

const CartScreen = ({
  navigation,
  cart,
  recentlyViewed,
  getRecentlyViewed,
  setError,
  setActiveGlobalModal,
  modifyCart,
  safeRemove,
  refreshCartWithNewPrice,
  hideDigital,
  checkout,
  sendCartAsGift,
  clearCartGiftApiStatusActions,
  isUserLoggedIn,
  addEvent,
  orderSummary,
  setBopisStore,
  fetchFavoriteStore,
  favoriteStore,
  bopisStore,
  getNearestStore,
  locationPermissionDenied,
  atgAccount,
  getShopOrderSummary,
}: Props & NavigationInjectedProps) => {
  const toast = useToast()
  const [itemsAvailable, setItemsAvailable] = useState(
    cart.items.reduce(itemsNoReducer, 0),
  )

  const [shippedItems, setShippedItems] = useState<CartItemViewModel[]>([])
  const [pickedUpItems, setPickedUpItems] = useState<CartItemViewModel[]>([])
  const [giftOptionSelected, setGiftOptionSelected] = useState<boolean>(
    cart.items.some((item) => !!item.giftItem),
  )
  const [checkingOut, setCheckingOut] = useState<boolean>(false)
  const [addToCartDisabled, setAddToCartDisabled] = useState<boolean>(false)
  const theme = useContext(ThemeContext) as ThemeModel
  const prevGiftOptionSelected = usePrevious(giftOptionSelected)
  const scrollRef = useRef<any>(null)

  const [pickupStore, setPickupStore] = useState<StoreModel | undefined>(
    bopisStore || favoriteStore,
  )

  const giftItems = cart.items
    .filter((item) => item.giftItem)
    .map((item) => item.id)

  useEffect(() => {
    let cartGiftItems = []
    if (prevGiftOptionSelected && !giftOptionSelected && giftItems.length > 0) {
      for (let i = 0; i < giftItems.length; i++) {
        cartGiftItems = {
          ...cartGiftItems,
          [giftItems[i]]: {
            isGift: false,
            hasWrap: false,
            message: '',
          },
        }
      }
      sendCartAsGift(cartGiftItems)
      clearCartGiftApiStatusActions()
    }
  }, [prevGiftOptionSelected, giftOptionSelected, giftItems])

  useEffect(() => {
    setShippedItems(
      cart.items
        .filter((item) => item.shipItem)
        .map((item) => ({ item, isMinusPending: false, isAddPending: false })),
    )

    setPickedUpItems(
      cart.items
        .filter((item) => !item.shipItem)
        .map((item) => ({ item, isMinusPending: false, isAddPending: false })),
    )
  }, [cart.items])

  useEffect(() => {
    const _itemsAvailable = cart.items.reduce(itemsNoReducer, 0)

    setItemsAvailable(_itemsAvailable)
    navigation.setParams({
      itemsNo: _itemsAvailable,
      totalPrice: cart.priceInfo.total.toFixed(2),
    })
  }, [cart.items])

  // BOPIS store priority: bopisStore (for this session) -> favorite store -> nearest store
  const getNeededStores = useCallback(async () => {
    if (bopisStore?.id) {
      return
    }
    if (!favoriteStore?.id) {
      await fetchFavoriteStore()
    } else {
      return
    }
  }, [bopisStore, favoriteStore])

  const setupPickupStore = useCallback(async () => {
    if (bopisStore?.id) {
      setPickupStore(bopisStore)
      return
    }
    if (bopisStore?.id === '' && favoriteStore) {
      setPickupStore(favoriteStore)
      return
    }
  }, [bopisStore, favoriteStore])

  useEffect(() => {
    getNeededStores()
  }, [bopisStore])

  useEffect(() => {
    setupPickupStore()
  }, [bopisStore])

  useEffect(() => {
    getNeededStores()
    setupPickupStore()
  }, [bopisStore, favoriteStore])

  useEffect(() => {
    getRecentlyViewed()
  }, [])

  const modifyCartOnPress = async (add: boolean, item: ShopCartItemModel) => {
    let itemToChangeIndex = shippedItems.findIndex(
      (current) => current.item.id === item.id,
    )
    let isShipped = itemToChangeIndex !== -1
    if (!isShipped) {
      itemToChangeIndex = pickedUpItems.findIndex(
        (current) => current.item.id === item.id,
      )
      if (itemToChangeIndex === -1) {
        return
      }
    }

    let newItems: [CartItemViewModel] = isShipped
      ? cloneDeep(shippedItems)
      : cloneDeep(pickedUpItems)

    newItems[itemToChangeIndex].isMinusPending = add ? false : true
    newItems[itemToChangeIndex].isAddPending = add ? true : false
    if (isShipped) {
      setShippedItems(newItems)
    } else {
      setPickedUpItems(newItems)
    }
    modifyCart(getModifyParams(item.id, add ? 1 : -1))
  }

  const fetchPdpData = async (ean) => {
    const productDetailsResponse = await getBooksDetails([ean])
    const normalizedDetails = normalizeAtgBookDetailsToBookModelArray(
      productDetailsResponse.data,
    )
    return normalizedDetails[0]
  }

  const NavigateButton = styled.TouchableOpacity``

  const showRedirectToPdp = async (ean) => {
    toast.show({
      alignSelf: 'center',
      shadow: 1,
      render: () => {
        return (
          <ToastBackground>
            <ToastBody>
              <ToastBodyText>
                This item cannot be purchased in app.
              </ToastBodyText>
              <ToastBodyText>See more formats</ToastBodyText>
            </ToastBody>
            <ToastCTA>
              <NavigateButton
                onPress={() => {
                  push(Routes.PDP__MAIN, { ean: ean })
                }}
              >
                <ButtonText>SEE MORE</ButtonText>
              </NavigateButton>
            </ToastCTA>
          </ToastBackground>
        )
      },
    })
  }

  const handleAddToCartCta = async (ean) => {
    setAddToCartDisabled(true)
    const productDetails = await fetchPdpData(ean)
    if (
      isDigital(productDetails?.skuType) ||
      isDigital(productDetails?.parentFormat as string)
    ) {
      showRedirectToPdp(ean)
      setAddToCartDisabled(false)
    } else {
      handleAddToCart(ean)
    }
  }

  const handleAddToCart = async (ean) => {
    let addData: AddItemData = {
      catalogRefIds: ean,
      quantity: 1,
      productId: `prd${ean}`,
    }
    const response = await addItemToCart(addData)
    setAddToCartDisabled(false)
    if (response.ok) {
      await refreshCartWithNewPrice()

      Vibration.vibrate()
      /* @ts-ignore */
      toast.show({
        title: 'Item added to cart',
        ...getSuccessToastStyle(theme),
      })
      const itemAdded = cart.items.find((item) => item.ean === ean)
      if (itemAdded) {
        const addToCart = {
          productFormat: itemAdded.parentFormat,
          productTitle: itemAdded.displayName,
          productId: ean,
          price: itemAdded.salePrice,
          qty: 1,
        }
        addEvent(LL_ADD_TO_CART, addToCart)
      }
      scrollToTop()
    } else {
      setActiveGlobalModal({ id: GlobalModals.PDP_ERROR })
      setError({
        formFieldId: PDP_ERROR_MODAL,
        error: htmlToText(response.data?.formExceptions[0]?.localizedMessage),
      })
    }
  }

  const goToPdp = (ean) => {
    push(Routes.PDP__MAIN, { ean: ean })
  }

  const scrollToTop = () => {
    scrollRef.current.scrollTo({ y: 0, animated: true })
  }

  const emptyContentContainerStyle = useMemo(
    () => ({ marginTop: theme.spacing(3) }),
    [theme],
  )

  if (itemsAvailable === 0 && cart.itemCount === 0) {
    return (
      <>
        <EmptyContainer>
          <ListEmptyState
            title="You haven’t added anything to your Cart!"
            description="Visit Home or Search below or tap the button to see what readers are loving."
            contentContainerStyle={emptyContentContainerStyle}
          />
        </EmptyContainer>
        <ViewBestsellersButton
          variant="contained"
          onPress={() => {
            push(Routes.HOME__MAIN)
          }}
          size="small"
          center
        >
          View Bestsellers
        </ViewBestsellersButton>
        <ScrollContainer>
          {recentlyViewed.length !== 0 && <EmptyDivider />}
          <RecentlyViewedContainer>
            <BookCarouselHorizontalRow
              header="Recently Viewed"
              eans={recentlyViewed}
              size="large"
              showAddToCartBtn={true}
              addToCartDisabled={addToCartDisabled}
              handleAddToCart={handleAddToCartCta}
            />
          </RecentlyViewedContainer>
        </ScrollContainer>
      </>
    )
  }

  return (
    <Container style={{ backgroundColor: '#fafafa' }}>
      <NavigationEvents
        onWillBlur={() => {
          hideDigital()
        }}
        onDidFocus={() => {
          refreshCartWithNewPrice()
        }}
      />
      <ShippingDetailsComponent
        shippingtText={cart.shippingMessage}
        selected={giftOptionSelected}
        onPress={() => {
          setGiftOptionSelected(!giftOptionSelected)
        }}
      />
      {!!cart.digitalItems && (
        <DigitalItemsContainer>
          <DigitalItemsText>
            {countLabelText(
              cart.digitalItems,
              'digital item was',
              'digital items were',
            )}{' '}
            moved to Save for Later
          </DigitalItemsText>
        </DigitalItemsContainer>
      )}
      {/* logic to be added when we implement address part */}
      {/* TODO: analyze performance for larger number of cart items;
      Flatlist seemed to be messing with the layouts when transitioning from normal to removed state, hence the scroll view */}
      <ScrollToTopHelper ref={scrollRef}>
        <ScrollContainer
          withAnchor
          withoutHorizontalPadding
          onRefresh={() => refreshCartWithNewPrice()}
        >
          {shippedItems.length > 0 && (
            <DeliveryMethod>
              <DeliveryText>Delivery</DeliveryText>
            </DeliveryMethod>
          )}

          {shippedItems.map(({ item, isAddPending, isMinusPending }) => {
            if (item.isSafeDeleted) {
              return (
                <UndoItem
                  key={item.id}
                  item={item}
                  onUndo={() => {
                    safeRemove(getSafeRemoveParams(item.id, false))
                  }}
                />
              )
            }
            return (
              <CartItem
                pickupStore={pickupStore}
                key={item.id}
                item={item}
                isMinusPending={isMinusPending}
                isAddPending={isAddPending}
                onIncrementQuantity={() => {
                  modifyCartOnPress(true, item)
                }}
                onDecrementQuantity={() => {
                  modifyCartOnPress(false, item)
                }}
                onRemove={() => {
                  safeRemove(getSafeRemoveParams(item.id, true))
                }}
                goToPdp={goToPdp}
              />
            )
          })}
          {pickedUpItems.length > 0 && shippedItems.length > 0 && (
            <MethodDivider />
          )}
          {pickedUpItems.length > 0 && (
            <DeliveryMethod>
              <DeliveryText>Pick up</DeliveryText>
              <FreeText>FREE</FreeText>
            </DeliveryMethod>
          )}
          {pickedUpItems.map(({ item, isAddPending, isMinusPending }) => {
            if (item.isSafeDeleted) {
              return (
                <UndoItem
                  key={item.id}
                  item={item}
                  onUndo={() => {
                    safeRemove(getSafeRemoveParams(item.id, false))
                  }}
                />
              )
            }

            return (
              <CartItem
                pickupStore={pickupStore}
                key={item.id}
                item={item}
                isAddPending={isAddPending}
                isMinusPending={isMinusPending}
                onIncrementQuantity={() => {
                  modifyCartOnPress(true, item)
                }}
                onDecrementQuantity={() => {
                  modifyCartOnPress(false, item)
                }}
                onRemove={() => {
                  safeRemove(getSafeRemoveParams(item.id, true))
                }}
                goToPdp={goToPdp}
                //to be adjusted when implementing integration on coupons and discounts apply
              />
            )
          })}

          <EnterDiscounts otherDiscountsVisible={false} />
          <MethodDivider />
          <OrderSummary cart={cart} />
          <SaveForLater />
          <MethodDivider />
          <RecentlyViewedContainer>
            <BookCarouselHorizontalRow
              header="Recently Viewed"
              eans={recentlyViewed}
              size="large"
              showAddToCartBtn={true}
              addToCartDisabled={addToCartDisabled}
              handleAddToCart={handleAddToCartCta}
            />
          </RecentlyViewedContainer>
        </ScrollContainer>
      </ScrollToTopHelper>

      <Button
        variant="contained"
        isAnchor
        showSpinner={checkingOut}
        onPress={async () => {
          if (!isUserLoggedIn) {
            setActiveGlobalModal({ id: GlobalModals.GUEST_USER_CONTINUE })
          }
          setCheckingOut(true)
          const success = await checkout()
          setCheckingOut(false)
          const navParams = {
            orderId: cart.id,
          }
          if (success) {
            giftOptionSelected
              ? push(Routes.CART__GIFT_OPTIONS, navParams)
              : push(Routes.CART__CHECKOUT, navParams)
          }

          if (cart && orderSummary) {
            const giftCard =
              Object.keys(orderSummary.appliedGiftCardDetails).length > 0
                ? 'yes'
                : 'no'
            const gift = cart.items.some((item) => !!item.giftItem)
              ? 'yes'
              : 'no'
            const usingMemberships =
              atgAccount?.membership?.bnMembership ||
              atgAccount?.membership?.educator ||
              atgAccount?.membership?.employee ||
              atgAccount?.membership?.kidsClub

            const checkoutStarted = {
              qty: cart.itemCount,
              orderTotal: orderSummary.total,
              gift: gift,
              giftCard: giftCard,
              coupon: orderSummary.discountAmount ? 'yes' : 'no',
              membershipLinked: usingMemberships ? 'yes' : 'no',
            }

            addEvent(LL_CHECKOUT_STARTED, checkoutStarted)
          }
        }}
        disabled={itemsAvailable === 0}
      >
        Check out {itemsAvailable > 0 ? `(${itemsAvailable})` : ''}
      </Button>
    </Container>
  )
}

export default connector(CartScreen)
