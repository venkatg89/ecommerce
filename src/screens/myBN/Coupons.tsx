import React, { useState, useCallback, useEffect, useContext, createContext } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import _CouponsList from 'src/components/MyBnStore/CouponsList'
import CouponDetailsModal from 'src/components/MyBnStore/CouponDetailsModal'

import { RequestStatus } from 'src/models/ApiStatus'

import { fetchCouponsAction, fetchMoreCouponsAction } from 'src/redux/actions/store/coupons'
import { couponListingSelector } from 'src/redux/selectors/listings/storeSelector'
import { couponsApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/store'

import Images from 'assets/images'
import { isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { ThemeModel } from 'src/models/ThemeModel'

const EMPTY_STATE_LOGGED_IN_USER_TITLE = 'No new offers available'
const EMPTY_STATE_LOGGED_IN_USER_TEXT = 'Check back in regularly for great deals.'
const EMPTY_STATE_GUEST_USER_TITLE = 'Coupons are unavailable to guests'
const EMPTY_STATE_GUEST_USER_TEXT = 'Please create an account to get great deals'
const CouponsList = styled(_CouponsList)`
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const EmptyContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  flex: 1;
`

const EmptyImage = styled.Image`
  width: 199;
  height: 199;
`

const EmptyTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const EmptyText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface ContextProps {
  openCouponDetailsModalCallback: (couponId: string) => void;
}

export const CouponDetailsContext = createContext<ContextProps>({ openCouponDetailsModalCallback: () => {} })

interface StateProps {
  couponIds: string[];
  couponsApiRequestStatus: Nullable<RequestStatus>;
  isUserLoggedIn: boolean
}

const selector = createStructuredSelector({
  couponIds: couponListingSelector,
  couponsApiRequestStatus: couponsApiRequestStatusSelector,
  isUserLoggedIn: isUserLoggedInSelector,
})

interface DispatchProps {
  fetchCoupons: () => void;
  fetchMoreCoupons: () => void;
}

const dispatcher = dispatch => ({
  fetchCoupons: () => dispatch(fetchCouponsAction()),
  fetchMoreCoupons: () => dispatch(fetchMoreCouponsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const CouponsScreen = ({ couponIds, fetchCoupons, fetchMoreCoupons, couponsApiRequestStatus, isUserLoggedIn }: Props) => {
  const [couponModalIdState, setCouponModalIdState] = useState<string>('')

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchCoupons()
    }
  }, [isUserLoggedIn])

  const theme = useContext(ThemeContext) as ThemeModel

  const openCouponDetails = useCallback((couponId: string) => {
    setCouponModalIdState(couponId)
  }, [])

  const closeModal = useCallback(() => {
    setCouponModalIdState('')
  }, [])

  if (couponIds.length < 1) {
    return (
      <EmptyContainer>
        <EmptyImage source={ Images.coupons } />
        <EmptyTitle>{isUserLoggedIn ? EMPTY_STATE_LOGGED_IN_USER_TITLE : EMPTY_STATE_GUEST_USER_TITLE}</EmptyTitle>
        <EmptyText>{isUserLoggedIn ? EMPTY_STATE_LOGGED_IN_USER_TEXT : EMPTY_STATE_GUEST_USER_TEXT}</EmptyText>
      </EmptyContainer>
    )
  }

  return (
    <Container>
      <CouponDetailsContext.Provider
        value={ {
          openCouponDetailsModalCallback: openCouponDetails,
        } }
      >
        <CouponsList
          contentContainerStyle={ { paddingVertical: theme.spacing(3) } }
          couponIds={ couponIds }
          fetching={ couponsApiRequestStatus === RequestStatus.FETCHING }
          onRefresh={ fetchCoupons }
          onEndReached={ fetchMoreCoupons }
        />
      </CouponDetailsContext.Provider>
      <CouponDetailsModal
        isOpen={ !!couponModalIdState }
        onDismiss={ closeModal }
        couponId={ couponModalIdState }
      />
    </Container>
  )
}

CouponsScreen.navigationOptions = () => ({
  title: 'Coupons',
})

export default connector(CouponsScreen)
