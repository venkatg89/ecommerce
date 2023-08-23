import React, { useCallback, useEffect, useState } from 'react'
import { createStructuredSelector } from 'reselect'
import Button from 'src/controls/Button'
import { ShopCartItemModel } from 'src/models/ShopModel/CartModel'
import styled from 'styled-components/native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Routes from 'src/constants/routes'
import {
  setItemShippingStatusAction,
  ShippingStatusParams,
} from 'src/redux/actions/shop/cartAction'
import { addItemToSaveForLaterListAction } from 'src/redux/actions/saveForLaterList/saveForLaterAction'
import { fetchFavoriteStoreAction } from 'src/redux/actions/store/favorite'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'
import { StoreModel } from 'src/models/StoreModel'
import { addEventAction, LL_SAVE_FOR_LATER } from 'src/redux/actions/localytics'

import RButton from 'src/controls/Button/RadioButton'
import BookImage from '../BookImage'
import QuantityControl from './QuantityControl'

const MainContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`
import { connect } from 'react-redux'
import { setBopisStoreAction } from 'src/redux/actions/pdp/bopisStore'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'

const BookInfoContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  flex: 1;
`
const TextsContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  flex: 1;
  justify-content: flex-start;
`
const PurchaseOptionsContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-weight: bold;
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const AuthorText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const PriceAndTypeContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  flex: 1;
  flex-direction: row;
`

const BottomContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  flex: 1;
  flex-direction: row;
`

const OriginalPriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(0.5)};
  text-decoration: line-through;
`

const PriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  font-weight: bold;
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const TypeText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  flex: 1;
`

const DiscountText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  color: ${({ theme }) => theme.palette.linkGreen};
  text-transform: uppercase;
`
const ShipText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: left;
`

const StoreText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(4)};
  font-weight: bold;
  text-align: left;
  flex-shrink: 1;
  width: 50%;
`

const Row = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`
const PickupRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
`

const RadioButton = styled(RButton)`
  padding-top: ${({ theme }) => theme.spacing(2)};
  flex: 1;
`
const PickupContainer = styled.View`
  flex: 1;
  flex-direction: row;
  max-width: 150;
  align-items: center;
`

const TouchableContainer = styled.TouchableOpacity``

interface StateProps {
  favoriteStore?: StoreModel
}

interface Props {
  item: ShopCartItemModel
  pickupStore: StoreModel | undefined
  onIncrementQuantity: () => void
  onDecrementQuantity: () => void
  onRemove: () => void
  goToPdp: (string) => void
  isAddPending: boolean
  isMinusPending: boolean
}

interface DispatchProps {
  setItemShippingStatusAction: (params: ShippingStatusParams) => void
  getFavoriteStore: () => void
  addItemToSaveForLaterList: (params) => void
  addEvent: (name, attributes) => void
  setBopisStore: (store: StoreModel) => void
  checkUserLoggedinToBreak: () => boolean
}

const dispatcher = (dispatch) => ({
  setItemShippingStatusAction: (params: ShippingStatusParams) =>
    dispatch(setItemShippingStatusAction(params)),
  getFavoriteStore: () => dispatch(fetchFavoriteStoreAction()),
  addItemToSaveForLaterList: (params) =>
    dispatch(addItemToSaveForLaterListAction(params)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
  setBopisStore: (store: StoreModel) => dispatch(setBopisStoreAction(store)),
  checkUserLoggedinToBreak: () => dispatch(checkIsUserLoggedOutToBreakAction()),
})

const selector = createStructuredSelector<any, StateProps>({
  favoriteStore: favoriteStoreSelector,
})

const connector = connect<StateProps, DispatchProps, Props>(
  selector,
  dispatcher,
)

const CartItem = ({
  goToPdp,
  item,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemove,
  isAddPending,
  isMinusPending,
  navigation,
  setItemShippingStatusAction,
  getFavoriteStore,
  favoriteStore,
  addItemToSaveForLaterList,
  addEvent,
  pickupStore,
  setBopisStore,
  checkUserLoggedinToBreak,
}: Props & NavigationInjectedProps & DispatchProps & StateProps) => {
  const selectStore = () => {
    const navParams = {
      cartItemId: item.id,
    }
    navigation.navigate(Routes.CART__SELECT_STORE, navParams)
  }

  const shipItem = () => {
    setItemShippingStatusAction({ itemId: item.id, status: true })
  }

  const pickUpItem = useCallback(async () => {
    if (pickupStore) {
      await setBopisStore(pickupStore)
      setItemShippingStatusAction({ itemId: item.id, status: false })
    }
  }, [pickupStore])

  useEffect(() => {
    getFavoriteStore()
  }, [])

  const [hasPickupStore, setHasPickupStore] = useState<boolean>(
    !!(item.storePickUp || pickupStore?.id),
  )
  useEffect(() => {
    setHasPickupStore(!!(item.storePickUp || pickupStore?.id))
  }, [item.storePickUp, pickupStore?.id])

  return (
    <MainContainer>
      <BookInfoContainer>
        <TouchableContainer onPress={() => goToPdp(item.ean)}>
          <BookImage size="medium" bookOrEan={item.ean} />
        </TouchableContainer>
        <TextsContainer>
          <TouchableContainer onPress={() => goToPdp(item.ean)}>
            <TitleText>{item.displayName}</TitleText>
            <AuthorText>{item.displayAuthor}</AuthorText>
          </TouchableContainer>

          <PriceAndTypeContainer>
            {item.salePrice &&
            item.listPrice &&
            item.unitAmount !== item.listPrice ? (
              <>
                <PriceText>
                  $
                  {item.salePrice === item.listPrice
                    ? item.unitAmount.toFixed(2)
                    : item.salePrice?.toFixed(2)}
                </PriceText>
                <OriginalPriceText>
                  {'$' + item.listPrice?.toFixed(2)}
                </OriginalPriceText>
              </>
            ) : (
              <PriceText>{'$' + item.listPrice?.toFixed(2)}</PriceText>
            )}

            <TypeText>{item.secondaryFormat}</TypeText>
          </PriceAndTypeContainer>
          {item.discounted && (
            <DiscountText>
              Discount{' '}
              {item.salePrice === item.listPrice
                ? Math.round(
                    ((item.listPrice - item.unitAmount) / item.listPrice) * 100,
                  )
                : Math.round(
                    ((item.listPrice - item.salePrice) / item.listPrice) * 100,
                  )}
              % applied
            </DiscountText>
          )}
        </TextsContainer>
      </BookInfoContainer>
      <BottomContainer>
        <QuantityControl
          count={item.quantity}
          isAddPending={isAddPending}
          isMinusPending={isMinusPending}
          onPressMinus={onDecrementQuantity}
          onPressAdd={onIncrementQuantity}
          onPressDelete={onRemove}
        />
        <ButtonsContainer>
          {/* TODO: implement save for later; separate tickets */}
          <Button
            onPress={async () => {
              if (!checkUserLoggedinToBreak()) {
                await addItemToSaveForLaterList({ itemIds: [item.id] })
                const saveForLater = {
                  productFormat: item.parentFormat,
                  productTitle: item.displayName,
                  productID: item.ean,
                  price: item.salePrice,
                }
                addEvent(LL_SAVE_FOR_LATER, saveForLater)
              }
            }}
            size={'regular'}
          >
            <ButtonText>Save for later</ButtonText>
          </Button>
          <Button
            onPress={!(isAddPending || isMinusPending) ? onRemove : () => {}}
            size={'small'}
          >
            <ButtonText>Remove</ButtonText>
          </Button>
        </ButtonsContainer>
      </BottomContainer>
      <PurchaseOptionsContainer>
        <PickupRow>
          <RadioButton
            disabled={false}
            selected={item.shipItem}
            onPress={shipItem}
            checkboxStyle={false}
          >
            <ShipText>Ship this item</ShipText>
          </RadioButton>
        </PickupRow>
        <PickupRow>
          <RadioButton
            disabled={false}
            selected={!item.shipItem}
            onPress={pickUpItem}
            checkboxStyle={false}
            style={{ flex: 1 }}
          >
            <Row>
              <PickupContainer>
                <ShipText>
                  {hasPickupStore
                    ? 'Pick up at '
                    : 'Buy Online Pick Up In Store'}
                </ShipText>
              </PickupContainer>
              <Button onPress={selectStore}>
                <ButtonText>
                  {hasPickupStore ? 'Change Store' : 'Select Store'}
                </ButtonText>
              </Button>
            </Row>
          </RadioButton>
        </PickupRow>
        {hasPickupStore && (
          <StoreText>
            {pickupStore?.name ? pickupStore?.name : item.storePickUp}
          </StoreText>
        )}
      </PurchaseOptionsContainer>
    </MainContainer>
  )
}

export default withNavigation(connector(CartItem))
