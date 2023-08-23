import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import Button from 'src/controls/Button'
import { getSubmittedOrder } from 'src/endpoints/atgGateway/cart'
import ShippingGroup from './OrderSubmitted/ShippingGroup'
import { getBooksDetails } from 'src/endpoints/atgGateway/pdp/booksDetails'
import SubmittedOrderSummary, {
  OrderSummary,
} from './OrderSubmitted/SubmittedOrderSummary'
import Header from 'src/controls/navigation/Header'
import { createStructuredSelector } from 'reselect'
import {
  accountEmailSelector,
  isUserLoggedInSelector,
} from 'src/redux/selectors/userSelector'
import { connect } from 'react-redux'
import { NavigationTabScreenProps } from 'react-navigation-tabs'
import Routes from 'src/constants/routes'
import navigationService from 'src/helpers/navigationService'

const Container = styled.View`
  background-color: #fafafa;
  flex: 1;
`

const ScrollContainer = styled.ScrollView`
  flex: 1;
`

const Divider = styled.View`
  border-bottom-width: 1;
  border-bottom-color: #c2cbd1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const RefreshContainer = styled.View`
  background-color: #fafafa;
  flex: 1;
  align-items: center;
`

const ContinueButton = styled(Button)`
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
`
const OrderSummaryContainer = styled.View`
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(12)};
`

const GuestHeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const GuestHeaderContainer = styled.View`
  align-items: center;
`

const CreateAccountButton = styled(Button)`
  padding-horizontal: ${({ theme }) => theme.spacing(4)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const GreetingHeader = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

interface ItemDetails {
  ean: string
  deliveryDate: string
  quantity: number
  preordered: boolean
}

export interface ItemGroup {
  shipping?: boolean
  bopis?: boolean
  electronic?: boolean
  heading: string
  items: ItemDetails[]
  address: {
    lastName: string
    state: string
    address1: string
    companyName: string
    city: string
    country: string
    postalCode: string
    phoneNumber: string
    email: string
    firstName: string
  }
  proxyPickupName: string
}

const OrderNumber = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

interface StateProps {
  isLoggedIn: boolean
  email: string
}

type Props = StateProps & NavigationTabScreenProps

const selector = createStructuredSelector<any, StateProps>({
  email: accountEmailSelector,
  isLoggedIn: isUserLoggedInSelector,
})

const connector = connect<StateProps, any, {}>(selector)

const OrderSubmittedScreen = ({ email, navigation, isLoggedIn }: Props) => {
  const orderId = navigation.getParam('orderId')

  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([])
  const [summary, setSummary] = useState<OrderSummary | undefined>(undefined)

  useEffect(() => {
    fetchOrderData()
  }, [])

  const fetchOrderData = async () => {
    const response = await getSubmittedOrder(email, orderId)
    if (response.ok) {
      const orderDetails = response.data?.response?.maOrderDetails
      const shippingGroups = orderDetails?.BNOrderShippingGroup

      let allEans: string[] = []
      shippingGroups.forEach((group) => {
        group.BNOrderLineItem.forEach((item) => {
          allEans.push(item.eanItemId)
        })
      })
      const productDetailsResponse = await getBooksDetails(allEans)
      let allPreorders: any[] = []
      if (productDetailsResponse.ok) {
        // eslint-disable-next-line no-unused-expressions
        productDetailsResponse.data.response.productDetails?.forEach(
          (product) => {
            allPreorders[product.eanChar] =
              product.availabilityStatus === 'preorder'
          },
        )
      }

      let hasBopis = false

      let groups: ItemGroup[] = shippingGroups?.map((group) => {
        hasBopis = hasBopis || group.bopis
        return {
          shipping: group.shipVia !== 'NXD',
          bopis: group.bopis,
          electronic: group.electronic,
          heading: group.shippingGroupHeading,
          address: group.BNOrderAddress,
          proxyPickupName: group.proxyCustFullName,
          items: group.BNOrderLineItem?.map((lineItem) => ({
            ean: lineItem.eanItemId,
            deliveryDate: lineItem.promisedDeliveryDate,
            quantity: lineItem.quantity,
            preordered: allPreorders[lineItem.eanItemId],
          })),
        }
      })
      const summary: OrderSummary = {
        itemCount: allEans.length,
        subtotal: orderDetails.orderSubtotal,
        total: orderDetails.orderTotal,
        discountAmount: orderDetails.orderdiscount,
        shippingAmount: orderDetails.ordershippingCost,
        taxAmount: orderDetails.orderTax,
        giftWrapAmount: orderDetails.orderGiftWarpcharges,
        pickUpInStore: hasBopis,
      }
      setSummary(summary)
      setItemGroups(groups)
    }
  }
  return (
    <Container>
      <ScrollContainer>
        <GreetingHeader>Thank you for your order.</GreetingHeader>
        {!isLoggedIn && (
          <GuestHeaderContainer>
            <GuestHeaderText>
              Save time on your next purchase. Create a Barnes & Noble account
              now and save your payment and shipping infromation.
            </GuestHeaderText>
            <CreateAccountButton
              onPress={() => {
                navigationService.pop()
                navigation.navigate(Routes.MODAL__SIGNUP)
              }}
              variant="contained"
            >
              Create a B&N account
            </CreateAccountButton>
          </GuestHeaderContainer>
        )}
        {itemGroups.length === 0 && (
          <RefreshContainer>
            <OrderNumber>
              It may take up to 5 minutes for your order information to appear.
              Click the button below to refresh. This will not appear in
              production.
            </OrderNumber>
            <ContinueButton variant="contained" onPress={fetchOrderData}>
              REFRESH
            </ContinueButton>
          </RefreshContainer>
        )}
        <OrderNumber>Order number: {orderId}</OrderNumber>
        {itemGroups.map((item) => (
          <>
            <ShippingGroup group={item} />
            <Divider />
          </>
        ))}
        {summary && (
          <OrderSummaryContainer>
            <SubmittedOrderSummary orderSummary={summary} />
          </OrderSummaryContainer>
        )}
      </ScrollContainer>
      <ContinueButton
        variant="contained"
        isAnchor
        onPress={() => {
          navigationService.pop()
          navigation.navigate({ routeName: Routes.HOME_TAB })
        }}
      >
        CONTINUE SHOPPING
      </ContinueButton>
    </Container>
  )
}

OrderSubmittedScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(OrderSubmittedScreen)
