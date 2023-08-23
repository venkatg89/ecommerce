import React from 'react'
import styled from 'styled-components/native'
import { convertDistance, getDistance } from 'geolib'

import Button from 'src/controls/Button'
import FavoriteStoreIcon from 'src/components/MyBnStore/FavoriteStoreIcon'

import { StoreModel } from 'src/models/StoreModel'
import { PositionRegion } from 'src/models/MapModel'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`

const StoreContainer = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(2)};
`

const NameText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1) / 2};
`

interface TextProps {
  marginBottom?: boolean
}

const DetailText = styled.Text<TextProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme, marginBottom }) =>
    marginBottom ? `margin-bottom: ${theme.spacing(1)};` : ''}
`

const ViewStoreContainer = styled.View`
  justify-content: flex-end;
`

const ViewStoreButton = styled(Button)`
  padding-vertical: ${({ theme }) => theme.spacing(1) / 2};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  storeItem: StoreModel
  onPress: () => void
  onPressViewStore: (string?) => void
  userLocation?: PositionRegion
  isForPdp?: boolean
  disabled?: boolean
  isForCart?: boolean
}

type Props = OwnProps

const StoreListItem = ({
  storeItem: store,
  onPress,
  onPressViewStore,
  userLocation,
  isForPdp,
  disabled,
  isForCart,
}: Props) => (
  <Container onPress={onPress} disabled={disabled}>
    <FavoriteStoreIcon storeId={store.id} />
    <StoreContainer>
      <NameText>{store.name}</NameText>
      {!isForPdp && !isForCart && (
        <DetailText marginBottom>
          {userLocation
            ? `${convertDistance(
                getDistance(userLocation, {
                  latitude: store.latitude,
                  longitude: store.longitude,
                }),
                'mi',
              ).toFixed(1)} miles away`
            : ''}
        </DetailText>
      )}
      <DetailText>{store.address}</DetailText>
      <DetailText>{`${store.city}, ${store.state} ${store.zip}`}</DetailText>
    </StoreContainer>
    <ViewStoreContainer>
      <ViewStoreButton
        variant="contained"
        onPress={() => {
          onPressViewStore(store)
        }}
        size="small"
      >
        Select Store
      </ViewStoreButton>
    </ViewStoreContainer>
  </Container>
)

export default StoreListItem
