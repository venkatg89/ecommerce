import React, { useMemo, useEffect } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import OrderItem from './Item'

import {
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { CafeRecentOrder } from 'src/models/CafeModel/OrderModel'

import { fetchRecentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import {
  recentOrdersSelector,
  checkedInVenueIdSelector,
} from 'src/redux/selectors/cafeSelector'

const Container = styled.View``

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Spacing = styled.View`
  width: 8;
`

const EmptyText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`

interface OwnProps {
  style?: any
  disable: boolean
}

interface StateProps {
  checkedInVenue?: string
  recentOrders: Record<string, CafeRecentOrder>
}

const selector = createStructuredSelector({
  recentOrders: recentOrdersSelector,
  checkedInVenue: checkedInVenueIdSelector,
})

interface DispatchProps {
  fetchRecentOrders: () => void
}

const dispatcher = (dispatch) => ({
  fetchRecentOrders: () => dispatch(fetchRecentOrdersAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const RecentOrderCarousel = ({
  style,
  recentOrders,
  disable,
  checkedInVenue,
  fetchRecentOrders,
}: Props) => {
  const recentOrdersArray = useMemo(
    () =>
      Object.values(recentOrders).sort(
        (a, b) =>
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      ),
    [recentOrders],
  )

  const { width } = useResponsiveDimensions()
  const styles = useMemo(
    () => ({
      container: {
        marginHorizontal: -CONTENT_HORIZONTAL_PADDING(width),
      },
      contentContainer: {
        paddingHorizontal: CONTENT_HORIZONTAL_PADDING(width),
        paddingBottom: CONTENT_HORIZONTAL_PADDING(width),
      },
    }),
    [width],
  )

  useEffect(() => {
    fetchRecentOrders()
  }, [])

  return (
    <Container style={style}>
      <HeaderText accessibilityRole="header">Recent Orders</HeaderText>
      {recentOrdersArray.length && !disable ? (
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recentOrdersArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderItem order={item} />}
          ItemSeparatorComponent={Spacing}
        />
      ) : (
        <EmptyText>Your past orders will show up here</EmptyText>
      )}
    </Container>
  )
}

export default connector(RecentOrderCarousel)
