import React, {
  useEffect,
  useCallback,
  useContext,
  useRef,
  useMemo,
} from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { SectionList, View } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'

import {
  CollapseContext,
  PositionParams,
} from 'src/controls/layout/CollapsableContainer'
import StoreListItem from 'src/components/Cart/StoreList/Item'
import _Button from 'src/controls/Button'

import { StoreModel } from 'src/models/StoreModel'
import { PositionRegion } from 'src/models/MapModel'

import {
  fetchFavoriteStoreAction,
  setFavoriteStoreAction,
} from 'src/redux/actions/store/favorite'
import { favoriteStoreSelector } from 'src/redux/selectors/myBn/storeSelector'
import {
  setItemPickupStoreAction,
  StorePickupParams,
} from 'src/redux/actions/shop/cartAction'
import { pop } from 'src/helpers/navigationService'
import { convertDistance, getDistance } from 'geolib'
import { setBopisStoreAction } from 'src/redux/actions/pdp/bopisStore'

import { addEventAction, LL_STORE_CHANGED } from 'src/redux/actions/localytics'

interface SectionHeaderProps {
  withCloseButton?: boolean
}

const SectionHeader = styled.Text<SectionHeaderProps>`
  text-align: center;
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
  flex: 1;
  ${({ theme, withCloseButton }) =>
    withCloseButton ? `padding-left: ${theme.spacing(3)}` : ''}
`

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const ListHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const HeaderButton = styled(_Button)``

const ItemSpacing = styled.View`
  height: ${({ theme }) => theme.spacing(2)};
`

const Divider = styled.View`
  height: 1;
  width: 100%;
  margin-vertical: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey3};
`

const NoFavoriteStoreText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface OwnProps {
  stores: StoreModel[]
  loadMore?: () => void
  userLocation?: PositionRegion
  isSearchingNearby: boolean
  centerOnStore: (position: PositionRegion) => void
  customTopMargin?: number
  isForPdp?: boolean
  isForCart?: boolean
}

interface StateProps {
  favoriteStore?: StoreModel
}

interface DispatchProps {
  setItemPickupStoreAction(params: StorePickupParams)
  getFavoriteStore: () => void
  setFavoriteStore: (storeId: string) => boolean
  setBopisStore: (StoreModel) => void
  addEvent: (name, attributes) => void
}

const selector = createStructuredSelector({
  favoriteStore: favoriteStoreSelector,
})

const dispatcher = (dispatch) => ({
  setItemPickupStoreAction: (params: StorePickupParams) =>
    dispatch(setItemPickupStoreAction(params)),
  getFavoriteStore: () => dispatch(fetchFavoriteStoreAction()),
  setFavoriteStore: (storeId) => dispatch(setFavoriteStoreAction(storeId)),
  setBopisStore: (store: StoreModel) => dispatch(setBopisStoreAction(store)),
  addEvent: (name, attributes) => dispatch(addEventAction(name, attributes)),
})

const connector = connect<StateProps, DispatchProps, {}, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & OwnProps & DispatchProps

const StoreList = ({
  loadMore,
  stores,
  favoriteStore,
  userLocation,
  isSearchingNearby,
  centerOnStore,
  customTopMargin = 0,
  setItemPickupStoreAction,
  getFavoriteStore,
  setFavoriteStore,
  setBopisStore,
  isForPdp,
  addEvent,
  isForCart,
}: Props) => {
  const {
    openContainerCallback,
    closeContainerCallback,
    resetNeutralCallback,
    currentPosition,
    currentCloseValue,
  } = useContext(CollapseContext)
  const { spacing } = useContext(ThemeContext)
  const listRef = useRef<any>(null)

  useEffect(() => {
    resetNeutralCallback(() => {})
  }, [stores[0]])

  useEffect(() => {
    getFavoriteStore()
  }, [])

  const scrollReset = useCallback((offset) => {
    try {
      listRef.current.list._wrapperListRef._listRef({ animated: false, offset })
    } catch (error) {
      /*  */
    }
  }, [])

  const scrollDrag = useCallback((event) => {
    const originalY = event.nativeEvent.contentOffset.y
    openContainerCallback(() => scrollReset(originalY))
  }, [])

  const selectFromList = useCallback(
    (item) => {
      closeContainerCallback(
        () => {
          centerOnStore({ latitude: item.latitude, longitude: item.longitude })
        },
        undefined,
        currentCloseValue,
      )
    },
    [currentCloseValue],
  )
  const renderItem = useCallback(
    (
      { item }, // eslint-disable-line
    ) => (
      <StoreListItem
        disabled={!!!item.latitude}
        isForPdp={isForPdp}
        isForCart={isForCart}
        storeItem={item}
        onPress={() => {
          selectFromList(item)
        }}
        userLocation={userLocation}
        onPressViewStore={(store) => {
          setBopisStore(store)
          const storeChanged = {
            city: store.city,
            state: store.state,
          }
          addEvent(LL_STORE_CHANGED, storeChanged)
          pop()
          return
        }}
      />
    ),
    [userLocation, currentCloseValue],
  )
  const orderStoresByDistance = (
    stores: StoreModel[],
    userLocation?: PositionRegion,
  ) => {
    if (userLocation && !isForPdp && !isForCart) {
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
      closeButton: true,
    }
    const nearBy = {
      title: isSearchingNearby ? 'Stores Near You' : 'Store Results',
      data: orderStoresByDistance(stores, userLocation),
      closeButton: false,
    }
    return [myBn, nearBy]
  }, [favoriteStore, stores, isSearchingNearby])

  const displayCloseButton = currentPosition === PositionParams.OPEN

  const renderNoFavoriteStore = useCallback(
    ({ section }) => (
      <React.Fragment>
        {(!section.data.length && section.isFavorite && (
          <NoFavoriteStoreText>No Favorite Store</NoFavoriteStoreText>
        )) ||
          undefined}
        {section.isFavorite && <Divider />}
      </React.Fragment>
    ),
    [],
  )

  const halfOpen = useMemo(() => currentCloseValue * 0.6, [currentCloseValue])
  const open = useMemo(
    () => currentPosition === PositionParams.OPEN + customTopMargin,
    [currentPosition],
  )
  const buttonText = useMemo(() => (open ? 'MAP' : 'LIST'), [open])

  const handlePressHeader = useCallback(() => {
    if (currentPosition === halfOpen) {
      openContainerCallback(() => {})
    } else {
      resetNeutralCallback(() => {})
    }
  }, [currentPosition, halfOpen])

  return (
    <View>
      <ListHeaderContainer>
        <SectionHeader withCloseButton>My B&N Stores</SectionHeader>
        <HeaderButton linkGreen onPress={handlePressHeader}>
          {buttonText}
        </HeaderButton>
      </ListHeaderContainer>

      <SectionList
        ref={listRef}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          paddingHorizontal: spacing(2),
          paddingBottom: spacing(2),
        }}
        onScrollBeginDrag={scrollDrag}
        onEndReached={loadMore}
        sections={sectionData()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <SectionHeaderContainer>
            <SectionHeader
              withCloseButton={section.closeButton && displayCloseButton}
            >
              {section.title}
            </SectionHeader>
          </SectionHeaderContainer>
        )}
        renderSectionFooter={renderNoFavoriteStore}
        ItemSeparatorComponent={ItemSpacing}
        stickySectionHeadersEnabled={false}
      />
    </View>
  )
}

export default connector(StoreList)
