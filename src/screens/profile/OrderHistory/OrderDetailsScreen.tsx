import React, { useEffect, useState, useContext } from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import moment from 'moment'
import styled, { ThemeContext } from 'styled-components/native'

import MapsAlert from 'src/components/MapsAlert'
import Routes, { Params } from 'src/constants/routes'
import { icons } from 'assets/images'
import Button from 'src/controls/Button'
import Header from 'src/controls/navigation/Header'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import {
  getBooksDetails,
  normalizeAtgBookDetailsToBookModelArray,
} from 'src/endpoints/atgGateway/pdp/booksDetails'
import { toDayMonthCommaYear } from 'src/helpers/dateFormatters'
import { paymentCardIconParser, paymentCardType } from 'src/helpers/paymentCard'
import { BookModel } from 'src/models/BookModel'
import { StoreModel } from 'src/models/StoreModel'
import { OrderDetailsModel } from 'src/models/UserModel/AtgAccountModel'
import { ThemeModel } from 'src/models/ThemeModel'

import { fetchStoreDetailsAction } from 'src/redux/actions/store/storeDetails'
import { storesSelector } from 'src/redux/selectors/myBn/storeSelector'
import { orderDetailsSelector } from 'src/redux/selectors/profile/orderHistory'
import { accountEmailSelector } from 'src/redux/selectors/userSelector'
import SubmittedOrderSummary from 'src/screens/cart/OrderSubmitted/SubmittedOrderSummary'
import OrderDetailsGroup from './OrderDetailsGroup'
import OrderDetailsProgressBar from './OrderDetailsProgressBar'

const HeaderContainer = styled.View`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  shadow-radius: 6px;
  shadow-color: black;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-left: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const OrderNumber = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 16;
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const OrderDate = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const PickupTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`
const PickupAt = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 16;
  line-height: 18;
  letter-spacing: 0.4;
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const PickupContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)}; ;
`

const GroupsContainer = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`

const PickupButtonsContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
`

const StoreButton = styled(Button)`
  margin: 0 ${({ theme }) => theme.spacing(1)}px;
  height: 40;
`

const ButtonIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.white};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.white};
  padding-left: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
`

const OrderGroupContainer = styled.View`
  border-bottom-width: 1;
  border-top-width: 1;
  border-bottom-color: ${({ theme }) => theme.palette.lightDisabledGrey};
  border-top-color: ${({ theme }) => theme.palette.lightDisabledGrey};
`

const ShadowSpacer = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.palette.lightGrey};
  shadow-radius: 6px;
  shadow-color: black;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.18;
`

const DescriptionContainer = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  line-height: 16;
  letter-spacing: 0.4;
`

const AddressContainer = styled.View`
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
  margin-vertical: ${({ theme }) => theme.spacing(2)};
`

const Separator = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.palette.grey5};
  margin-horizontal: ${({ theme, compact }) =>
    compact ? 0 : theme.spacing(2)};
`

const AddressTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
`

const Container = styled.ScrollView`
  background-color: ${({ theme }) => theme.palette.lightGrey};
`

const PaymentInfo = styled.View`
  flex-direction: row;
`

const PaymentCardIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const PaymentDetailsDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
  line-height: 16;
  letter-spacing: 0.4;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const OrderTrackingContainer = styled.View`
  margin: ${({ theme }) => theme.spacing(2)}px;
`

interface DispatchProps {
  fetchStoreDetails: (storeId: string) => void
}

interface StateProps {
  orderDetails: Record<string, OrderDetailsModel>
  stores: Record<string, StoreModel>
  email: string
}

const dispatcher = (dispatch) => ({
  fetchStoreDetails: (storeId) => dispatch(fetchStoreDetailsAction(storeId)),
})

const selector = createStructuredSelector({
  orderDetails: orderDetailsSelector,
  stores: storesSelector,
  email: accountEmailSelector,
})

export interface BookViewModel {
  author: string
  format: string
}

const getTrackingBarStep = (isElectronic: boolean, label: string) => {
  if (isElectronic) {
    return labelsElectronicMapping[label] || 1
  }
  return labelsMapping[label] || 1
}

const getTrackingBarMaxStep = (isElectronic: boolean, label: string) => {
  if (isElectronic) {
    return 2
  }
  if (label === 'Cancelled' || label === 'Canceled') {
    //Sometimes this typo seems to appear
    return 2
  }
  return 3
}

const labelsMapping = {
  Open: 1,
  Completed: 3,
  Cancelled: 2,
  Processing: 1,
  Verifying: 1,
  'Back Ordered': 1,
  'Preparing Shipment': 2,
  'Partially Shipped': 3,
  Shipped: 3,
  Canceled: 2,
}

const labelsElectronicMapping = {
  Open: 1,
  Completed: 2,
  Cancelled: 2,
  Processing: 1,
  Verifying: 1,
  'Back Ordered': 1,
  'Preparing Shipment': 1,
  'Partially Shipped': 1,
  Shipped: 2,
  Canceled: 2,
}

type Props = StateProps & DispatchProps & NavigationInjectedProps

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const OrderDetailsScreen = ({
  navigation,
  orderDetails,
  stores,
  fetchStoreDetails,
  email,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const orderId = navigation.getParam(Params.ORDER_ID)

  const [booksInfo, setBooksInfo] = useState<Record<string, BookViewModel>>()
  const [loading, setLoading] = useState(false)

  const currentOrderDetails: OrderDetailsModel = orderDetails[orderId]
  const [products, setProducts] = useState<BookModel[]>()

  const [isMapsModalOpen, setIsMapsModalOpen] = useState(false)

  const storeId = currentOrderDetails?.groups?.find((group) => !!group.storeId)
    ?.storeId

  useEffect(() => {
    if (currentOrderDetails) {
      fetchOrderData()
    }
  }, [orderId])

  useEffect(() => {
    if (storeId) {
      fetchStoreDetails(storeId)
    }
  }, [storeId])

  const fetchOrderData = async () => {
    setLoading(true)

    let hasBopis = false
    let allEans: string[] = []
    orderDetails[orderId].groups.forEach((group) => {
      hasBopis = hasBopis || group.bopis
      group.items.forEach((item) => {
        allEans.push(item.ean)
      })
    })
    const productDetailsResponse = await getBooksDetails(allEans)
    let booksData = {}
    if (productDetailsResponse.ok) {
      const allProducts = normalizeAtgBookDetailsToBookModelArray(
        productDetailsResponse.data,
      )
      setProducts(allProducts)
      // eslint-disable-next-line no-unused-expressions
      productDetailsResponse.data.response.productDetails?.forEach(
        (product) => {
          const data: BookViewModel = {
            author: product.contributors[0]?.name,
            format: product.parentFormat,
          }
          booksData[product.eanChar] = data
          setBooksInfo(booksData)
        },
      )
    }

    setLoading(false)
  }

  const getOrderFinishDate = () => {
    let latestDate = moment(0)
    currentOrderDetails.groups.forEach((group) => {
      for (let index = 0; index < group.items.length; index++) {
        const item = group.items[index]
        if (moment(item.deliveryDate) > latestDate) {
          latestDate = moment(item.deliveryDate)
        }
      }
    })
    return latestDate.format('MMM. D')
  }

  if (loading) {
    return (
      <Container>
        <HeaderContainer>
          <TitleText>Order Details</TitleText>
          <OrderDate>
            Order Date: {toDayMonthCommaYear(currentOrderDetails?.orderDate)}
          </OrderDate>
          <OrderNumber>Order Number: {orderId}</OrderNumber>
          <LoadingIndicator isLoading color={theme.palette.disabledGrey} />
        </HeaderContainer>
      </Container>
    )
  }
  if (!currentOrderDetails) {
    return (
      <Container>
        <HeaderContainer>
          <TitleText>Order Details</TitleText>
          <OrderNumber>Order Number: {orderId}</OrderNumber>
          <OrderNumber>An error occured.</OrderNumber>
        </HeaderContainer>
      </Container>
    )
  }

  return (
    <Container>
      <HeaderContainer>
        <TitleText>Order Details</TitleText>
        <OrderDate>
          Order Date: {toDayMonthCommaYear(currentOrderDetails?.orderDate)}
        </OrderDate>
        <OrderNumber>Order Number: {orderId}</OrderNumber>
        {currentOrderDetails?.summary.pickUpInStore &&
          storeId &&
          stores[storeId] && (
            <PickupContainer>
              <PickupTitle>You have an order ready for pickup.</PickupTitle>
              <PickupAt>Go to checkout at {stores[storeId].name}.</PickupAt>
              <PickupButtonsContainer>
                <StoreButton
                  icon={icons.direction}
                  variant="contained"
                  flex
                  maxWidth
                  onPress={() => {
                    setIsMapsModalOpen(true)
                  }}
                >
                  <ButtonIcon source={icons.direction} />
                  <ButtonText>Directions</ButtonText>
                </StoreButton>
                <StoreButton
                  icon={icons.direction}
                  variant="contained"
                  flex
                  maxWidth
                  onPress={() => {
                    navigation.navigate(Routes.HOME__STORE_DETAILS, {
                      [Params.STORE_ID]: storeId,
                    })
                  }}
                >
                  <ButtonIcon source={icons.storeInfo} />
                  <ButtonText>Store Info</ButtonText>
                </StoreButton>
              </PickupButtonsContainer>
            </PickupContainer>
          )}
        <OrderTrackingContainer>
          <OrderDetailsProgressBar
            isCancelled={
              currentOrderDetails.orderStatus === 'Cancelled' ||
              currentOrderDetails.orderStatus === 'Canceled'
            }
            stepDate={getOrderFinishDate()}
            totalSteps={getTrackingBarMaxStep(
              !currentOrderDetails.groups.some((group) => !group.electronic),
              currentOrderDetails.orderStatus,
            )}
            currentStep={getTrackingBarStep(
              !currentOrderDetails.groups.some((group) => !group.electronic),
              currentOrderDetails.orderStatus,
            )}
            label={currentOrderDetails.orderStatus}
          />
        </OrderTrackingContainer>
      </HeaderContainer>

      <GroupsContainer>
        {currentOrderDetails?.groups.map((group, index) => {
          const deliveryGroups = orderDetails[orderId].groups.filter(
            (group) => !group.bopis && !group.electronic,
          )
          const deliveryIndex = deliveryGroups.indexOf(group)
          return (
            <>
              <OrderGroupContainer>
                <OrderDetailsGroup
                  showWriteReview={(products && products.length > 0) || false}
                  onPressWriteReview={(ean) => {
                    const correspondingProduct = products?.find(
                      (product) => product.ean === ean,
                    )
                    if (correspondingProduct) {
                      navigation.navigate(Routes.PDP__WRITE_REVIEW, {
                        product: correspondingProduct,
                        publisher: correspondingProduct?.publisher,
                      })
                    }
                  }}
                  booksData={booksInfo || {}}
                  orderDetails={group}
                  isDelivery={!group.bopis && !group.electronic}
                  deliveryIndex={deliveryIndex}
                  deliveryCount={deliveryGroups.length}
                />
              </OrderGroupContainer>
              {index !== orderDetails[orderId]?.groups.length - 1 && (
                <ShadowSpacer />
              )}
            </>
          )
        })}
      </GroupsContainer>
      {currentOrderDetails?.shippingAddress && (
        <AddressContainer>
          <AddressTitle>Shipping Address</AddressTitle>
          <DescriptionContainer>
            <DescriptionText>
              {currentOrderDetails.shippingAddress.firstName}{' '}
              {currentOrderDetails.shippingAddress.lastName}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.shippingAddress.address1}
              {currentOrderDetails.shippingAddress.address2}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.shippingAddress.city},{' '}
              {currentOrderDetails.shippingAddress.state}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.shippingAddress.postalCode}
            </DescriptionText>
          </DescriptionContainer>
        </AddressContainer>
      )}
      <Separator />
      {currentOrderDetails?.billingAddress && (
        <AddressContainer>
          <AddressTitle>Billing Information</AddressTitle>

          <DescriptionContainer>
            <PaymentInfo>
              <PaymentCardIcon
                source={paymentCardIconParser(
                  currentOrderDetails.cardType || '',
                )}
              />
              <PaymentDetailsDescriptionText>
                {`${paymentCardType(currentOrderDetails.cardType || '')} *${
                  currentOrderDetails.cardLastDigits
                }`}
              </PaymentDetailsDescriptionText>
            </PaymentInfo>
            <DescriptionText>
              {currentOrderDetails.billingAddress.firstName}{' '}
              {currentOrderDetails.billingAddress.lastName}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.billingAddress.address1}
              {currentOrderDetails.billingAddress.address2}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.billingAddress.city},{' '}
              {currentOrderDetails.billingAddress.state}
            </DescriptionText>
            <DescriptionText>
              {currentOrderDetails.billingAddress.postalCode}
            </DescriptionText>
          </DescriptionContainer>
        </AddressContainer>
      )}
      <Separator compact />
      {currentOrderDetails && currentOrderDetails.summary && (
        <SubmittedOrderSummary orderSummary={currentOrderDetails.summary} />
      )}
      {storeId && stores[storeId] && (
        <MapsAlert
          isOpen={isMapsModalOpen}
          setIsOpen={setIsMapsModalOpen}
          destination={stores[storeId]}
        />
      )}
    </Container>
  )
}

OrderDetailsScreen.navigationOptions = ({ navigation }) => ({
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(OrderDetailsScreen)
