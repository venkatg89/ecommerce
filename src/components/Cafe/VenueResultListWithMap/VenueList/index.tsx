import React, { useCallback, useRef, useContext, useEffect } from 'react'
import { SectionList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled, { ThemeContext } from 'styled-components/native'

import VenueListItem from './Item'
import { CollapseContext } from 'src/controls/layout/CollapsableContainer'

import { fetchFavoriteCafeStoreAction } from 'src/redux/actions/store/favorite'
import { CafeVenue } from 'src/models/CafeModel/VenueModel'
import { PositionRegion } from 'src/models/MapModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { cafeSearchVenueResultListSelector } from 'src/redux/selectors/listings/cafeSelector'
import { searchVenuesApiRequestStatusSelector } from 'src/redux/selectors/apiStatus/cafe'
import { favoriteCafeVenueSelector } from 'src/redux/selectors/listings/cafeSelector'

import IMAGES from 'assets/images'

const VenueListSectionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.white};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const SectionText = styled.Text`
  flex: 1;
  text-align: center;
  ${({ theme }) => theme.typography.subTitle1}
  color: ${({ theme }) => theme.palette.grey2};
`

const SectionSpacing = styled.View``

const ItemSpacing = styled.View`
  height: 20;
`
const NoFavoriteStoreText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey3};
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
  currentPosition: PositionRegion
  onEndReached?: () => void
  setPositionOnVenue: (position: PositionRegion) => void
  isSearchingNearby: boolean
}

interface StateProps {
  nearbyVenueList: CafeVenue[]
  favoriteStore?: CafeVenue
  searchApiStatus: Nullable<RequestStatus>
}

const selector = createStructuredSelector({
  nearbyVenueList: cafeSearchVenueResultListSelector,
  searchApiStatus: searchVenuesApiRequestStatusSelector,
  favoriteStore: favoriteCafeVenueSelector,
})

interface DispatchProps {
  getFavoriteStore: () => void
}

const dispatcher = (dispatch) => ({
  getFavoriteStore: () => dispatch(fetchFavoriteCafeStoreAction()),
})

type Props = StateProps & DispatchProps & OwnProps

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

const VenueList = ({
  currentPosition,
  onEndReached,
  nearbyVenueList,
  searchApiStatus,
  favoriteStore,
  setPositionOnVenue,
  isSearchingNearby,
  getFavoriteStore,
}: Props) => {
  const scrollRef = useRef<any>(null)
  const { openContainerCallback } = useContext(CollapseContext)
  const { spacing } = useContext(ThemeContext)

  useEffect(() => {
    getFavoriteStore()
  }, [])

  const formatVenuesSectionData = useCallback(() => {
    const favoriteVenuesData = {
      title: ' My B&N Stores',
      data: (favoriteStore && [favoriteStore]) || [],
      isFavorite: true,
    }
    const nearbyVenuesData = {
      title:
        isSearchingNearby || searchApiStatus === RequestStatus.FAILED
          ? 'Stores Near You'
          : 'Store Results',
      data: nearbyVenueList,
    }
    return [favoriteVenuesData, nearbyVenuesData]
  }, [nearbyVenueList, favoriteStore, isSearchingNearby, searchApiStatus])

  const toggleScroll = useCallback(
    (event) => {
      const originalY = event.nativeEvent.contentOffset.y
      openContainerCallback(
        () => {
          try {
            scrollRef.current.list._wrapperListRef._listRef({
              animated: false,
              offset: originalY,
            })
          } catch (e) {
            /**/
          }
        }, // eslint-disable-line
      )
    },
    [scrollRef],
  )

  const fetching = searchApiStatus === RequestStatus.FETCHING

  const sectionHeader = useCallback(({ section }) => {
    return (
      <VenueListSectionContainer>
        <SectionText>{section.title}</SectionText>
      </VenueListSectionContainer>
    )
  }, [])

  const renderNoFavoriteStore = useCallback(
    ({ section }) => (
      <>
        {(!section.data.length && section.isFavorite && (
          <NoFavoriteStoreText>No Favorite Store</NoFavoriteStoreText>
        )) ||
          undefined}
        {section.isFavorite && <Divider />}
      </>
    ),
    [],
  )

  const centerOnMap = useCallback((item) => {
    setPositionOnVenue({ latitude: item.latitude, longitude: item.longitude })
  }, [])

  return (
    <>
      {nearbyVenueList.length > 1 ? (
        <SectionList
          ref={scrollRef}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            paddingHorizontal: spacing(2),
            paddingBottom: spacing(2),
          }}
          onScrollBeginDrag={toggleScroll}
          refreshControl={<RefreshControl refreshing={fetching} />}
          onEndReached={onEndReached}
          sections={formatVenuesSectionData()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VenueListItem
              currentPosition={currentPosition}
              venue={item}
              onPress={() => {
                centerOnMap(item)
              }}
            />
          )}
          renderSectionHeader={sectionHeader}
          renderSectionFooter={renderNoFavoriteStore}
          SectionSeparatorComponent={SectionSpacing}
          ItemSeparatorComponent={ItemSpacing}
          stickySectionHeadersEnabled={false}
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
    </>
  )
}

export default connector(VenueList)
