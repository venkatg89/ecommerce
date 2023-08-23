import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { Routes } from 'src/helpers/navigationService'

import CollapsableContainer from 'src/controls/layout/CollapsableContainer'
import StoreList from 'src/components/Cart/StoreList'
import StoreMap, {
  searchBarHeight,
} from 'src/components/MyBnStore/SearchStore/StoreMap'
import IMAGES from 'assets/images'

import { PositionRegion } from 'src/models/MapModel'
import { StoreModel } from 'src/models/StoreModel'

import { storeSearchResultsSelector } from 'src/redux/selectors/listings/storeSelector'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'

const Container = styled.View`
  position: relative;
  flex: 1;
`

const Content = styled.View`
  flex: 1;
  width: 100%;
  padding-bottom: ${searchBarHeight};
`

const EmptyStateContent = styled.View`
  align-items: center;
  height: 100%;
  justify-content: flex-start;
`

const Image = styled.Image`
  height: 200;
  width: 200;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1}
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  text-align: center;
`

interface OwnProps {
  userLocation?: PositionRegion
  isSearchingNearby: boolean
  isPreviousSearchState: boolean
  isForPdp?: boolean
  isForCart?: boolean
}

interface StateProps {
  storeResults: StoreModel[]
  favoriteStore?: StoreModel
}

const selector = createStructuredSelector({
  storeResults: storeSearchResultsSelector,
  favoriteStore: favoriteStoreSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const StoreSearchResult = ({
  storeResults,
  userLocation,
  isSearchingNearby,
  isPreviousSearchState,
  favoriteStore,
  isForPdp,
  isForCart,
}: Props) => {
  const [centerLocationState, setCenterLocationState] = useState<
    PositionRegion | undefined
  >(undefined)
  useEffect(() => {
    if (!isPreviousSearchState) {
      // if using previous search state, don't set a center and use expanded map
      setCenterLocationState(userLocation)
    }
  }, [userLocation])

  const centerOnStore = useCallback((position: PositionRegion) => {
    setCenterLocationState(position)
  }, [])
  return (
    <Container>
      <StoreMap
        stores={storeResults}
        favoriteStore={storeResults.length > 0 ? favoriteStore : undefined}
        centerPosition={centerLocationState}
        isSearchingNearby={isSearchingNearby}
        stack={Routes.CART_TAB}
      />
      <CollapsableContainer topMargin={50}>
        {storeResults.length > 0 ? (
          <Content>
            <StoreList
              isForCart={isForCart}
              isForPdp={isForPdp}
              customTopMargin={50}
              stores={storeResults}
              userLocation={userLocation}
              isSearchingNearby={isSearchingNearby}
              centerOnStore={centerOnStore}
            />
          </Content>
        ) : (
          <EmptyStateContent>
            <Image source={IMAGES.emptyStoreList} />
            <HeaderText>Find your nearby Barnes & Noble Store</HeaderText>
            <DescriptionText>
              Search by city, state, zip code, or store name; or use geolocation
              to find your nearest store.
            </DescriptionText>
          </EmptyStateContent>
        )}
      </CollapsableContainer>
    </Container>
  )
}

export default connector(StoreSearchResult)
