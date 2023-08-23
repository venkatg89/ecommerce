import React, {
  useEffect,
  useCallback,
  useContext,
} from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { SectionList } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'

import StoreListItem from './Item'

import { StoreModel } from 'src/models/StoreModel'
import { PositionRegion } from 'src/models/MapModel'

import { fetchFavoriteStoreAction } from 'src/redux/actions/store/favorite'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'
import { Params, navigate, Routes } from 'src/helpers/navigationService'
import { convertDistance, getDistance } from 'geolib'

import {
  addEventAction,
  LL_STORE_DETAILS_VIEWED,
} from 'src/redux/actions/localytics'

const SectionHeader = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
  flex: 1;
`

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.white};
  padding-vertical: ${({ theme }) => theme.spacing(2)};
`

const ItemSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey3};
`

interface OwnProps {
  stores: StoreModel[]
  loadMore?: () => void
  userLocation?: PositionRegion
  isSearchingNearby: boolean
  centerOnStore: (position: PositionRegion) => void
}

interface StateProps {
  favoriteStore?: StoreModel
}

const selector = createStructuredSelector({
  favoriteStore: favoriteStoreSelector,
})

interface DispatchProps {
  getFavoriteStore: () => void
  addEvent: (name, attributes) => void
}

const dispatcher = (dispatch) => ({
  getFavoriteStore: () => dispatch(fetchFavoriteStoreAction()),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

type Props = StateProps & DispatchProps & OwnProps

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

const StoreList = ({
  loadMore,
  stores,
  favoriteStore,
  userLocation,
  isSearchingNearby,
  centerOnStore,
  getFavoriteStore,
  addEvent,
}: Props) => {
  const { spacing } = useContext(ThemeContext)

  useEffect(() => {
    getFavoriteStore()
  }, [])

  const selectFromList = useCallback(
    (item) => centerOnStore({ latitude: item.latitude, longitude: item.longitude }),
    [],
  )

  const renderItem = useCallback(
    (
      { item },
    ) => (
      <StoreListItem
        storeItem={item}
        onPress={() => {
          selectFromList(item)
        }}
        userLocation={userLocation}
        onPressViewStore={() => {
          navigate(Routes.MY_BN__STORE_DETAILS, {
            [Params.STORE_ID]: item.id,
            [Params.STORE_NAME]: item.name,
          })
          const storeViewed = {
            city: item.city,
            state: item.state,
          }
          addEvent(LL_STORE_DETAILS_VIEWED, storeViewed)
        }}
      />
    ),
    [userLocation],
  )

  const orderStoresByDistance = (
    stores: StoreModel[],
    userLocation?: PositionRegion,
  ) => {
    if (userLocation) {
      return stores.sort(function (store1, store2) {
        const d1 = convertDistance(
          getDistance(userLocation, {
            latitude: store1.latitude,
            longitude: store1.longitude,
          }),
          'mi',
        )
        const d2 = convertDistance(
          getDistance(userLocation, {
            latitude: store2.latitude,
            longitude: store2.longitude,
          }),
          'mi',
        )
        return d1 - d2
      })
    } else {
      return stores
    }
  }

  const sectionData = useCallback(() => {
    const myBn = {
      title: null,
      data: (favoriteStore && [favoriteStore]) || [],
      isFavorite: true,
    }
    const nearBy = {
      title: isSearchingNearby ? 'Stores Near You' : 'Store Results',
      data: orderStoresByDistance(stores, userLocation),
    }
    return [myBn, nearBy]
  }, [favoriteStore, stores, isSearchingNearby])

  const renderSectionHeader = useCallback(
    ({ section }) => {
      if (section.title) {
        return (
          <SectionHeaderContainer>
            <SectionHeader>
              {section.title}
            </SectionHeader>
          </SectionHeaderContainer>
        )
      }
      if (favoriteStore) {
        return (
          <SectionHeaderContainer>
            <SectionHeader>My B&N Store</SectionHeader>
          </SectionHeaderContainer>
        )
      }
      return null
    },
    [favoriteStore],
  )

  const renderSectionFooter = useCallback(
    ({ section }) => favoriteStore && section.isFavorite && <Divider />,
    [],
  )

  return (
    <SectionList
      contentContainerStyle={{
        paddingHorizontal: spacing(2),
        paddingBottom: spacing(2),
      }}
      onEndReached={loadMore}
      sections={sectionData()}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
      ItemSeparatorComponent={ItemSpacing}
    />
  )
}

export default connector(StoreList)
