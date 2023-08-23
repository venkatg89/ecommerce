import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'

import { toShortMonthDayYear } from 'src/helpers/dateFormatters'
import {
  OrderHistoryModel,
  OrderDetailsModel,
} from 'src/models/UserModel/AtgAccountModel'

import BookImage from 'src/components/BookImage'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import { ThemeModel } from 'src/models/ThemeModel'

const ContainerItem = styled.TouchableOpacity`
  flex-grow: 1;
  background-color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.boxShadow.container};
  border-width: 1;
  border: ${({ theme }) => theme.palette.disabledGrey};
  border-radius: 4;
  overflow: hidden;
`

const HeaderContainer = styled.View`
  padding-vertical: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const StatusText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`
const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const DateText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
`

const PriceText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
`

const BookContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(2)};
`
const BookDetails = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
`

const ImageContainer = styled(BookImage)`
  flex-direction: row;
`

const BookTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
`

const BookEstimation = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
`

const BookStatus = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Loading = styled(LoadingIndicator)`
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

interface Props {
  orderHistory: OrderHistoryModel
  orderDetails: Record<string, OrderDetailsModel>
  onPress: (id: string) => void
}

const OrderHistoryItem = ({ orderHistory, orderDetails, onPress }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const renderItem = (item) => (
    <BookContainer key={item.ean}>
      <ImageContainer bookOrEan={item.ean} size="medium" />
      <BookDetails>
        <BookTitle>{item.name} </BookTitle>
        <BookEstimation>Estimated arrival {item.deliveryDate}</BookEstimation>
        <BookStatus>{item.orderStatus}</BookStatus>
      </BookDetails>
    </BookContainer>
  )

  return (
    <ContainerItem onPress={() => onPress(orderHistory.orderNumber)}>
      <HeaderContainer>
        <StatusText>{orderHistory.orderStatus}</StatusText>
        <DetailsContainer>
          <DateText>
            Ordered {toShortMonthDayYear(orderHistory.orderDate)}
          </DateText>
          <PriceText>${orderHistory.orderTotal}</PriceText>
        </DetailsContainer>
      </HeaderContainer>
      {/* TODO add this back once proper solution for getting multiple order details is implemented; */}
      <Loading
        isLoading={
          orderDetails[orderHistory.orderNumber] === undefined ||
          orderDetails[orderHistory.orderNumber] === null
        }
        color={theme.palette.disabledGrey}
      />
      {orderDetails[orderHistory.orderNumber]?.groups.map((group) => {
        return group.items.map((item) => renderItem(item))
      })}
    </ContainerItem>
  )
}

export default OrderHistoryItem
