import React, { useCallback, useMemo } from 'react'
import { FlatList, StyleProp, ViewStyle } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import CouponListItem from './Item'

import { CouponModel } from 'src/models/StoreModel/CouponModel'
import { filterCouponsByIdsSelector } from 'src/redux/selectors/myBn/couponSelector'

import countLabelText from 'src/helpers/countLabelText'

const Spacing = styled.View`
  height: ${({ theme }) => theme.spacing(3)};
`

const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-horizontal: ${({ theme }) => theme.spacing(0.5)};
`

const Text = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey1};
  text-align: center;  
`

interface OwnProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  fetching?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

interface StateProps {
  coupons: CouponModel[];
}


const selector = createStructuredSelector({
  coupons: (state, ownProps) => {
    const ids = ownProps.couponIds
    return filterCouponsByIdsSelector(state, { ids })
  },
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const CouponsList = ({ coupons, fetching, onRefresh, onEndReached, style, contentContainerStyle }: Props) => {
  const renderItem = useCallback(({ item }) => (
    <CouponListItem coupon={ item } />
  ), [])

  const keyExtractor = useCallback(item => (
    item.id
  ), [])

  const listHeader = useMemo(() => (
    <HeaderContainer>
      <Text>
        {`${countLabelText(coupons.length || 0, 'offer', 'offers')}`}
      </Text>
    </HeaderContainer>
  ), [coupons.length])

  return (
    <FlatList
      style={ style }
      contentContainerStyle={ contentContainerStyle }
      ListHeaderComponent={ listHeader }
      data={ coupons }
      refreshing={ fetching }
      onRefresh={ onRefresh }
      onEndReached={ onEndReached }
      keyExtractor={ keyExtractor }
      renderItem={ renderItem }
      ItemSeparatorComponent={ Spacing }
    />
  )
}

export default connector(CouponsList)
