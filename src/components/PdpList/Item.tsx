import React, { useState, useContext, useCallback } from 'react'
import { Vibration } from 'react-native'
import { SwipeRow } from 'react-native-swipe-list-view'
import { useToast } from 'native-base'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'

import _BookImage from 'src/components/BookImage'
import _RatingStars from 'src/components/Pdp/RatingStars'
import Button from 'src/controls/Button'
import AddToWishListButton from 'src/components/AddPdpToWishList'

import { ResultModel } from 'src/models/SearchModel'
import { icons, nav } from 'assets/images'
import { push, Routes } from 'src/helpers/navigationService'
import { ThemeModel } from 'src/models/ThemeModel'
import { AddItemData, addItemToCart } from 'src/endpoints/atgGateway/cart'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { ErrorMessage } from 'src/models/FormModel'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { PDP_ERROR_MODAL } from 'src/constants/formErrors'
import { GlobalModals } from 'src/constants/globalModals'
import { getSuccessToastStyle } from 'src/constants/layout'
import htmlToText from 'src/helpers/ui/htmlToText'
import { isDigital } from 'src/constants/skutypes'
import { addEventAction, LL_ADD_TO_CART } from 'src/redux/actions/localytics'

const Container = styled.View``

const Overlay = styled.View`
  background-color: ${({ theme }) => theme.palette.white};
`

const Content = styled.TouchableOpacity`
  flex-direction: row;
`

const Description = styled.View`
  flex: 1;
`

const Flex = styled.View`
  flex-direction: row;
  align-items: center;
`

const RatingStars = styled(_RatingStars)`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  align-self: flex-start;
`

const BookImage = styled(_BookImage)`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
`

const ContributorText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

const ListPriceText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
`

const OriginalPriceText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  text-decoration-line: line-through;
`

const FormatText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const AddToCartButton = styled(Button)`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding-top: ${({ theme }) => theme.spacing(0.5)};
  padding-bottom: ${({ theme }) => theme.spacing(0.5)};
  padding-left: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(1)};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
`

const FavIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  tint-color: ${({ theme }) => theme.palette.white};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const SwipeableButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`

const AddContainer = styled.View`
  height: 100%;
  width: ${({ theme }) => theme.spacing(12)};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.primaryGreen};
`

const RemoveContainer = styled.TouchableOpacity`
  width: ${({ theme }) => theme.spacing(12)};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.supportingError};
`

const SwipeText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.white};
  text-transform: uppercase;
  padding-horizontal: ${({ theme }) => theme.spacing(1)};
  text-align: center;
`

interface OwnProps {
  result: ResultModel
  onSwipe?: (ean: string) => void
}

interface DispatchProps {
  refreshCart: () => void
  setError: (error: ErrorMessage) => void
  setActiveGlobalModal: ({ id: string }) => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  refreshCart: () => dispatch(refreshCartAction()),
  setError: (error: ErrorMessage) =>
    dispatch(setformErrorMessagesAction(PDP_ERROR_MODAL, [error])),
  setActiveGlobalModal: (modal: { id: string }) =>
    dispatch(setActiveGlobalModalAction(modal)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = OwnProps & DispatchProps

const PdpListItem = ({
  result,
  onSwipe,
  refreshCart,
  setError,
  setActiveGlobalModal,
  addEvent,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleAddToCart = useCallback(async () => {
    let addData: AddItemData = {
      catalogRefIds: result.ean,
      quantity: 1,
      productId: `prd${result.ean}`,
    }
    setIsLoading(true)
    const response = await addItemToCart(addData)
    if (response.ok) {
      await refreshCart()
      Vibration.vibrate()
      /* @ts-ignore */
      toast.show({
        title: 'Item added to cart',
        ...getSuccessToastStyle(theme),
      })
      if (result) {
        const addToCart = {
          productFormat: result.format,
          productTitle: result.name,
          productId: result.ean,
          price: result.listPrice,
          qty: 1,
        }
        addEvent(LL_ADD_TO_CART, addToCart)
      }
    } else {
      setActiveGlobalModal({ id: GlobalModals.PDP_ERROR })
      setError({
        formFieldId: PDP_ERROR_MODAL,
        error: htmlToText(response.data?.formExceptions[0]?.localizedMessage),
      })
    }
    setIsLoading(false)
  }, [result.ean])

  return (
    <Container>
      <SwipeRow
        leftOpenValue={theme.spacing(13)}
        rightOpenValue={-theme.spacing(13)}
        disableLeftSwipe={!onSwipe}
        directionalDistanceChangeThreshold={8}
      >
        <SwipeableButtonContainer>
          <AddToWishListButton
            ean={result.ean}
            CustomButton={
              <AddContainer>
                <FavIcon source={icons.unfavorite} />
                <SwipeText>Add to list</SwipeText>
              </AddContainer>
            }
          />
          <RemoveContainer
            onPress={() => {
              onSwipe && onSwipe(result.ean)
            }}
          >
            <SwipeText>Remove</SwipeText>
          </RemoveContainer>
        </SwipeableButtonContainer>
        <Overlay>
          <Content
            onPress={() => {
              push(Routes.PDP__MAIN, { ean: result.ean })
            }}
          >
            <BookImage bookOrEan={result.ean} size="medium" />
            <Description>
              <TitleText numberOfLines={2}>{result.name}</TitleText>
              <ContributorText numberOfLines={1}>
                {result.contributor}
              </ContributorText>
              <RatingStars ratingLevel={result.rating} />
              <Flex>
                <ListPriceText>${result.listPrice.toFixed(2)}</ListPriceText>
                {!!result.originalPrice &&
                  result.listPrice !== result.originalPrice && (
                    <OriginalPriceText>
                      ${result.originalPrice.toFixed(2)}
                    </OriginalPriceText>
                  )}
                <FormatText>{result.format}</FormatText>
              </Flex>
              {!isDigital(result.skuType) &&
                !isDigital(result.format) &&
                !result.outOfStock && (
                  <AddToCartButton
                    variant="outlined"
                    icon
                    size="small"
                    onPress={handleAddToCart}
                    showSpinner={isLoading}
                  >
                    <Icon source={nav.tabs.cart} />
                    <ButtonText>Add To Cart</ButtonText>
                  </AddToCartButton>
                )}
            </Description>
          </Content>
        </Overlay>
      </SwipeRow>
    </Container>
  )
}

export default connector(PdpListItem)
