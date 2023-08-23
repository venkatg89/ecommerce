import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps } from 'react-navigation'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import CafeItemList from 'src/components/Cafe/ItemList'
import _SelectedVenueHeader from 'src/components/Cafe/SelectedVenueHeader'

import { CafeCategory } from 'src/models/CafeModel/CategoryModel'
import { Params } from 'src/constants/routes'
import {
  getScrollVerticalPadding,
  getScrollHorizontalPadding,
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'

import { fetchCafeItemsAction } from 'src/redux/actions/cafe/itemsAction'
import { cafeItemIdsFromCategoryIdSelector } from 'src/redux/selectors/listings/cafeSelector'
import { cafeCategorySelector } from 'src/redux/selectors/cafeSelector'

const PAGE_HEADER_KEY = 'cafe_item_header-key'

interface CurrentWidthProps {
  currentWidth: number
}

const SelectedVenueHeader = styled(_SelectedVenueHeader)<CurrentWidthProps>`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme, currentWidth }) =>
    getScrollHorizontalPadding(theme, currentWidth)};
`

const ItemHeader = styled.Text<CurrentWidthProps>`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-left: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
  margin-right: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
`

const Separator = styled.View`
  height: 1;
  background-color: ${({ theme }) => theme.palette.grey4};
  width: ${({ currentWidth }) => currentWidth};
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
`

interface StateProps {
  cafeItemIds: string[]
  category: CafeCategory
}

const selector = createStructuredSelector({
  cafeItemIds: (state, ownProps) => {
    const categoryId = ownProps.navigation.getParam(Params.CAFE_CATEGORY_ID)
    return cafeItemIdsFromCategoryIdSelector(state, { categoryId })
  },
  category: (state, ownProps) => {
    const categoryId = ownProps.navigation.getParam(Params.CAFE_CATEGORY_ID)
    return cafeCategorySelector(state, { categoryId })
  },
})

interface DispatchProps {
  fetchCafeItems: (categoryId: string) => void
}

const dispatcher = (dispatch) => ({
  fetchCafeItems: (categoryId) => dispatch(fetchCafeItemsAction(categoryId)),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps & NavigationInjectedProps

const CafeItemsScreen = ({
  navigation,
  fetchCafeItems,
  category,
  cafeItemIds,
}: Props) => {
  const categoryId = navigation.getParam(Params.CAFE_CATEGORY_ID)
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    fetchCafeItems(categoryId)
  }, [])

  useEffect(() => {
    navigation.setParams({ [PAGE_HEADER_KEY]: category.name })
  }, [category])

  return (
    <Container>
      <SelectedVenueHeader currentWidth={width} />
      <ItemHeader currentWidth={width}>{category.name}</ItemHeader>
      <Separator currentWidth={width} />
      <CafeItemList
        itemIds={cafeItemIds}
        itemType={navigation.getParam(PAGE_HEADER_KEY)}
      />
    </Container>
  )
}

CafeItemsScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.getParam(PAGE_HEADER_KEY),
})

export default connector(CafeItemsScreen)
