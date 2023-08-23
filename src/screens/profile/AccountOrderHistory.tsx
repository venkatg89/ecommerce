import React, { useCallback, useState, useEffect, useContext } from 'react'
import { FlatList } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'

import _Container from 'src/controls/layout/ScreenContainer'
import Header from 'src/controls/navigation/Header'
import _SearchInput from 'src/controls/form/SearchInput'
import Routes, { Params } from 'src/constants/routes'
import {
  OrderDetailsModel,
  OrderHistoryModel,
  SearchOrderNumber,
} from 'src/models/UserModel/AtgAccountModel'
import { ThemeModel } from 'src/models/ThemeModel'

import OrderHistoryItem from 'src/components/Profile/ProfileOrderHistory/OrderHistoryItem'
import LoadingIndicator from 'src/controls/progress/LoadingIndicator'

import {
  getOrderDetailsAction,
  searchOrderHistoryAction,
} from 'src/redux/actions/user/orderHistory'
import { orderDetailsSelector } from 'src/redux/selectors/profile/orderHistory'
import { accountEmailSelector } from 'src/redux/selectors/userSelector'

const Container = styled(_Container)`
  background-color: ${({ theme }) => theme.palette.lightGrey};
`
const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`
const SearchInput = styled(_SearchInput)`
  margin-vertical: ${({ theme }) => theme.spacing(3)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const Spacing = styled.View`
  width: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const ContainerCarousel = styled.View`
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const MessageText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;
`

interface StateProps {
  orderDetails: Record<string, OrderDetailsModel>
  email: string
}

const selector = createStructuredSelector({
  orderDetails: orderDetailsSelector,
  email: accountEmailSelector,
})

interface DispatchProps {
  getOrderDetails: (orderHistory, email, MAX_NUMBER) => void
  searchOrderNumber: (orderNumber) => SearchOrderNumber
}

const dispatcher = (dispatch) => ({
  getOrderDetails: (orderHistory, email, MAX_NUMBER) =>
    dispatch(getOrderDetailsAction(orderHistory, email, MAX_NUMBER)),
  searchOrderNumber: (orderNumber: string) =>
    dispatch(searchOrderHistoryAction(orderNumber)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const AccountOrderHistory = ({
  navigation,
  getOrderDetails,
  orderDetails,
  searchOrderNumber,
  email,
}: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel

  const [orderNumber, setOrderNumber] = useState<string>('')
  const [orderHistory, setOrderHistory] = useState<OrderHistoryModel[]>(
    navigation.getParam(Params.ACCOUNT_ORDER),
  )
  const [orderDetailsSearch, setOrderDetailsSearch] = useState<
    Record<string, OrderDetailsModel>
  >({})
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    getOrderDetails(orderHistory, email, orderHistory.length)
  }, [])

  const getSearchOrderNumber = async () => {
    setIsSearch(true)
    setIsError(false)
    setIsLoading(true)
    const searchResponse = await searchOrderNumber(orderNumber)
    setIsLoading(false)
    if (searchResponse !== undefined) {
      setOrderHistory([searchResponse.orderHistory])
      setOrderDetailsSearch({
        [searchResponse.orderHistory.orderNumber]: searchResponse.orderDetails,
      })
    } else {
      setIsError(true)
    }

    setIsSearch(false)
  }

  const handleChangeText = useCallback(
    (text) => {
      if (!text) {
        resetSearch()
      }
      setOrderNumber(text)
    },
    [orderNumber],
  )

  const resetSearch = () => {
    setIsSearch(false)
    setIsLoading(false)
    setIsError(false)
    setOrderNumber('')
    setOrderHistory(navigation.getParam(Params.ACCOUNT_ORDER))
  }

  return (
    <Container>
      <HeaderText>Order History</HeaderText>
      <SearchInput
        value={orderNumber}
        onChange={handleChangeText}
        onReset={resetSearch}
        placeholder="Search by order number"
        noScanner
        onSubmit={getSearchOrderNumber}
      />
      {isLoading ? (
        <LoadingIndicator
          isLoading={isLoading}
          color={theme.palette.disabledGrey}
        />
      ) : (
        <>
          {!isError ? (
            <ContainerCarousel>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={orderHistory}
                keyExtractor={(item) => item.orderNumber}
                renderItem={({ item }) => (
                  <OrderHistoryItem
                    orderHistory={item}
                    orderDetails={isSearch ? orderDetailsSearch : orderDetails}
                    onPress={(orderId) => {
                      navigation.navigate(Routes.ACCOUNT_ORDER_DETAILS, {
                        [Params.ORDER_ID]: orderId,
                      })
                    }}
                  />
                )}
                ItemSeparatorComponent={Spacing}
              />
            </ContainerCarousel>
          ) : (
            <MessageText>We could not find any orders.</MessageText>
          )}
        </>
      )}
    </Container>
  )
}

AccountOrderHistory.navigationOptions = () => ({
  title: 'Account',
  header: (headerProps) => <Header headerProps={headerProps} />,
})

export default connector(AccountOrderHistory)
