import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Container from 'src/controls/layout/ScreenContainer'
import CafeCategoryList from 'src/components/Cafe/CategoryList'
import _SelectedVenueHeader from 'src/components/Cafe/SelectedVenueHeader'

import { getScrollVerticalPadding, getScrollHorizontalPadding, useResponsiveDimensions } from 'src/constants/layout'

import { currentCafeCategoryIdsSelector } from 'src/redux/selectors/listings/cafeSelector'
import { fetchCafeCategoriesAction } from 'src/redux/actions/cafe/categoriesAction'

interface CurrentWidthProps {
  currentWidth: number
}

const SelectedVenueHeader = styled(_SelectedVenueHeader)<CurrentWidthProps>`
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
  margin-horizontal: ${({ theme, currentWidth }) => getScrollHorizontalPadding(theme, currentWidth)};
`
const Separator = styled.View`
  height:1;
  background-color: ${({ theme }) => theme.palette.grey4};
  width:${({ currentWidth }) => currentWidth};
  margin-top: ${({ theme }) => getScrollVerticalPadding(theme)};
`



interface StateProps {
  cafeCategoriesId: string[];
}

const selector = createStructuredSelector({
  cafeCategoriesId: currentCafeCategoryIdsSelector,
})

interface DispatchProps {
  fetchCafeCategories: () => void;
}

const dispatcher = dispatch => ({
  fetchCafeCategories: () => dispatch(fetchCafeCategoriesAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const CafeCategoriesScreen = ({ cafeCategoriesId, fetchCafeCategories }: Props) => {
  useEffect(() => {
    fetchCafeCategories()
  }, [])

  const { width } = useResponsiveDimensions()

  return (
    <Container>
      <SelectedVenueHeader currentWidth={ width } />
      <Separator currentWidth={ width } />
      <CafeCategoryList categoryIds={ cafeCategoriesId } />
    </Container>
  )
}

export default connector(CafeCategoriesScreen)
