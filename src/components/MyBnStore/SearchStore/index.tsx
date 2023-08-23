import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import StoreList from 'src/components/MyBnStore/StoreList'
import StoreMap from './StoreMap'

import { PositionRegion } from 'src/models/MapModel'
import { StoreModel } from 'src/models/StoreModel'

import { storeSearchResultsSelector } from 'src/redux/selectors/listings/storeSelector'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'

import IMAGES from 'assets/images'

const Container = styled.View`
  flex: 1;
`

const Section = styled.View`
  height: 50%;
  background-color: ${({ theme }) => theme.palette.white};
`

const EmptyStateContent = styled.View`
  align-items: center;
  height: 100%;
  justify-content: flex-start;
  top: 5%;
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
      <Section>
        <StoreMap
          stores={storeResults}
          favoriteStore={storeResults.length > 0 ? favoriteStore : undefined}
          centerPosition={centerLocationState}
          isSearchingNearby={isSearchingNearby && !isPreviousSearchState}
          halfScreen
        />
      </Section>
      <Section>
        {storeResults.length > 0 ? (
          <StoreList
            stores={storeResults}
            userLocation={userLocation}
            isSearchingNearby={isSearchingNearby}
            centerOnStore={centerOnStore}
          />
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
      </Section>
    </Container>
  )
}

export default connector(StoreSearchResult)
