import { Text } from 'react-native'
import React from 'react'
import Button from 'src/controls/Button'
import styled from 'styled-components/native'
import BookImage from 'src/components/BookImage'
import { OrderDetailsItemGroup } from 'src/models/UserModel/AtgAccountModel'
import { BookViewModel } from './OrderDetailsScreen'

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const Ordering = styled.Text`
  ${({ theme }) => theme.typography.body2};
`

const Tracking = styled.Text`
  ${({ theme }) => theme.typography.subtitle2};
  font-size: 12;
`

const Container = styled.View`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const TopContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`

const SubBodyContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ReviewSubmitDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const ReviewSubmitSalePriceDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const ReviewSubmitHardCoverDescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-left: ${({ theme }) => theme.spacing(2)};
`

const RowContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const MarginBodyContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  onPressWriteReview: (ean: string) => void
  showWriteReview: boolean
  booksData: Record<string, BookViewModel>
  orderDetails: OrderDetailsItemGroup
  deliveryIndex: number
  deliveryCount: number
  isDelivery: boolean
}

const OrderDetailsGroup = ({
  showWriteReview,
  onPressWriteReview,
  deliveryIndex,
  deliveryCount,
  orderDetails,
  booksData,
  isDelivery,
}: Props) => {
  return (
    <Container>
      <TopContainer>
        {deliveryCount > 0 && isDelivery ? (
          <Text>
            <Title>Delivery </Title>
            <Ordering>
              ({deliveryIndex + 1} of {deliveryCount})
            </Ordering>
          </Text>
        ) : (
          <Text>
            <Title>{orderDetails.electronic ? 'Electronic' : 'Pick Up'} </Title>
            <Ordering>({orderDetails.items.length} items)</Ordering>
          </Text>
        )}
        {orderDetails.trackingNumber && (
          <Button
            variant="default"
            linkGreen
            onPress={() => {
              // TODO get tracking URL and open tracking web page
            }}
          >
            <Tracking>View Tracking</Tracking>
          </Button>
        )}
      </TopContainer>

      {/* TODO get all shipment states and process them into the progress bar
       <OrderDetailsProgressBar
        isCancelled
        stepDate="Dec. 11"
        totalSteps={2}
        currentStep={2}
        label="Cancelled"
      /> */}
      {orderDetails.items.length > 0 && (
        <>
          {orderDetails.items.map((item) => (
            <>
              <SubBodyContainer>
                <BookImage size="medium" bookOrEan={item.ean} />
                <StoreContainer>
                  <MarginBodyContainer>
                    <NameText>{item.name}</NameText>
                    {booksData && booksData[item.ean]?.author && (
                      <ReviewSubmitDescriptionText>
                        {booksData[item.ean].author}
                      </ReviewSubmitDescriptionText>
                    )}
                  </MarginBodyContainer>
                  <RowContainer>
                    <ReviewSubmitSalePriceDescriptionText>
                      ${item.itemPrice?.toFixed(2)}
                    </ReviewSubmitSalePriceDescriptionText>
                    {booksData && booksData[item.ean]?.format && (
                      <ReviewSubmitHardCoverDescriptionText>
                        {booksData[item.ean].format}
                      </ReviewSubmitHardCoverDescriptionText>
                    )}
                  </RowContainer>

                  <MarginBodyContainer>
                    <ReviewSubmitDescriptionText>
                      Qty: {item.quantity}
                    </ReviewSubmitDescriptionText>
                  </MarginBodyContainer>
                  {showWriteReview && (
                    <Button
                      variant="default"
                      linkGreen
                      onPress={() => {
                        onPressWriteReview(item.ean)
                      }}
                    >
                      <Tracking>Write a review</Tracking>
                    </Button>
                  )}
                </StoreContainer>
              </SubBodyContainer>
            </>
          ))}
        </>
      )}
    </Container>
  )
}

export default OrderDetailsGroup
