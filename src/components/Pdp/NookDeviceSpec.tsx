import React, { useCallback, useContext, useEffect, useState } from 'react'
import { createStructuredSelector } from 'reselect'
import { nookDeviceSpecSelector } from 'src/redux/selectors/pdpSelector'
import { connect } from 'react-redux'
import Header from 'src/controls/navigation/Header'
import Button from 'src/controls/Button'
import { getNookDeviceSpecificationsAction } from 'src/redux/actions/pdp/nookDeviceSpec'
import CqContent from '../CqContent'
import ScrollContainer from 'src/controls/layout/ScrollContainer'
import styled, { ThemeContext } from 'styled-components/native'
import { nav } from 'assets/images'
import { NavigationInjectedProps } from 'react-navigation'
import { AddItemData, addItemToCart } from 'src/endpoints/atgGateway/cart'
import { refreshCartAction } from 'src/redux/actions/shop/cartAction'
import { Vibration } from 'react-native'
import { useToast } from 'native-base'
import { getSuccessToastStyle } from 'src/constants/layout'
import { ThemeModel } from 'src/models/ThemeModel'
import { setActiveGlobalModalAction } from 'src/redux/actions/modals/globalModals'
import { GlobalModals } from 'src/constants/globalModals'
import { ErrorMessage } from 'src/models/FormModel'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { PDP_ERROR_MODAL } from 'src/constants/formErrors'
import htmlToText from 'src/helpers/ui/htmlToText'
import { addEventAction, LL_ADD_TO_CART } from 'src/redux/actions/localytics'

import { Params } from 'src/constants/routes'

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  tint-color: white;
`

const IconContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing(0.5)};
`

const AddToCartButton = styled(Button)``

interface StateProps {
  nookDeviceSpecifications: string
}

const selector = createStructuredSelector({
  nookDeviceSpecifications: nookDeviceSpecSelector,
})

interface DispatchProps {
  refreshCart: () => void
  getNookDeviceSpec: (ean: string) => void
  setError: (error: ErrorMessage) => void
  setActiveGlobalModal: ({ id: string }) => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  refreshCart: () => dispatch(refreshCartAction()),
  setActiveGlobalModal: (modal: { id: string }) =>
    dispatch(setActiveGlobalModalAction(modal)),
  setError: (error: ErrorMessage) =>
    dispatch(setformErrorMessagesAction(PDP_ERROR_MODAL, [error])),
  getNookDeviceSpec: (ean) => dispatch(getNookDeviceSpecificationsAction(ean)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const NookDeviceSpec = ({
  navigation,
  nookDeviceSpecifications,
  refreshCart,
  setError,
  setActiveGlobalModal,
  getNookDeviceSpec,
  addEvent,
}: Props) => {
  const toast = useToast()
  const theme = useContext(ThemeContext) as ThemeModel
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const product = navigation.getParam(Params.PRODUCT)

  useEffect(() => {
    getNookDeviceSpec(navigation.getParam('ean'))
  }, [])

  const handleAddToCart = useCallback(async () => {
    let addData: AddItemData = {
      catalogRefIds: navigation.getParam('ean'),
      quantity: 1,
      productId: `prd${navigation.getParam('ean')}`,
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
      if (product) {
        const addToCart = {
          productFormat: product.parentFormat,
          productTitle: product.name,
          productId: navigation.getParam('ean'),
          price: product.salePrice,
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
  }, [navigation.getParam('ean')])

  return (
    <React.Fragment>
      <ScrollContainer>
        <Title>Features & Specs</Title>
        <CqContent cqContent={{ markdown: nookDeviceSpecifications }} />
      </ScrollContainer>
      <AddToCartButton
        onPress={handleAddToCart}
        variant="contained"
        maxWidth
        isAnchor
        center
        showSpinner={isLoading}
      >
        <IconContainer>
          <Icon source={nav.tabs.cart} />
        </IconContainer>
        Add To Cart
      </AddToCartButton>
    </React.Fragment>
  )
}

NookDeviceSpec.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('_title'),
    header: (headerProps) => <Header headerProps={headerProps} />,
  }
}

export default connector(NookDeviceSpec)
