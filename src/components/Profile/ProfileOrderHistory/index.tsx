import React, { useEffect, useContext } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import Button from 'src/controls/Button'
import { toMonthDayYear } from 'src/helpers/dateFormatters'
import {
  OrderHistoryModel,
  OrderDetailsModel,
} from 'src/models/UserModel/AtgAccountModel'
import { RequestStatus } from 'src/models/ApiStatus'
import { ThemeModel } from 'src/models/ThemeModel'
import { navigate, Routes, Params } from 'src/helpers/navigationService'

import BookImage from 'src/components/BookImage'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import { getOrderHistoryAction } from 'src/redux/actions/user/orderHistory'
import {
  orderHistorySelector,
  orderDetailsSelector,
  orderHistoryApiStatus,
} from 'src/redux/selectors/profile/orderHistory'

const Container = styled.View`
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
`

const ContainerItem = styled.TouchableOpacity`
  flex-grow: 1;
  width: 192;
  height: 178;
  background-color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.boxShadow.container};
  border-width: 1;
  border: ${({ theme }) => theme.palette.disabledGrey};
  border-radius: 3;
  overflow: hidden;
`

const TextContainer = styled.View`
  padding-top: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const DateText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const StatusText = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.grey2};
`

const ImageContainer = styled.View`
  flex-direction: row;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Spacing = styled.View`
  width: ${({ theme }) => theme.spacing(2)}; ;
`

interface StateProps {
  orderHistory: OrderHistoryModel[]
  orderDetails: Record<string, OrderDetailsModel>
  orderHistoryStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  orderHistory: orderHistorySelector,
  orderDetails: orderDetailsSelector,
  orderHistoryStatus: orderHistoryApiStatus,
})

interface DispatchProps {
  getOrderHistory: () => void
}

const dispatcher = (dispatch) => ({
  getOrderHistory: () => dispatch(getOrderHistoryAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const MAX_ORDER_NUMBER = 10

const ProfileOrderHistory = ({
  getOrderHistory,
  orderHistory,
  orderDetails,
  orderHistoryStatus,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel

  useEffect(() => {
    getOrderHistory()
  }, [])

  const renderImages = (item) =>
    orderDetails[item.orderNumber]?.groups.map((group) => {
      return group.items.map((item) => (
        <BookImage key={item.ean} bookOrEan={item.ean} size="medium" />
      ))
    })

  const renderItem = (item) => {
    return (
      <ContainerItem
        onPress={() => {
          navigate(Routes.ACCOUNT_ORDER_DETAILS, {
            [Params.ORDER_ID]: item.orderNumber,
          })
        }}
      >
        <TextContainer>
          <DateText>{toMonthDayYear(item.orderDate)}</DateText>
          <StatusText numberOfLines={1}>{item.orderStatus}</StatusText>
        </TextContainer>
        <LoadingIndicator
          isLoading={!orderDetails[item.orderNumber]}
          color={theme.palette.disabledGrey}
        />
        <ImageContainer>{renderImages(item)}</ImageContainer>
      </ContainerItem>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderText>Order History</HeaderText>
        <Button
          onPress={() => {
            navigate(Routes.ACCOUNT__ORDER_HISTORY, {
              [Params.ACCOUNT_ORDER]: orderHistory,
            })
          }}
          linkGreen
        >
          See all
        </Button>
      </Header>
      {orderHistoryStatus === RequestStatus.FETCHING ? (
        <LoadingIndicator
          isLoading={orderHistoryStatus === RequestStatus.FETCHING}
          color={theme.palette.disabledGrey}
        />
      ) : (
        <>
          {orderHistory.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={orderHistory.slice(0, MAX_ORDER_NUMBER)}
              keyExtractor={(item) => item.orderNumber}
              renderItem={({ item }) => renderItem(item)}
              ItemSeparatorComponent={Spacing}
            />
          ) : null}
        </>
      )}
    </Container>
  )
}

export default connector(ProfileOrderHistory)
