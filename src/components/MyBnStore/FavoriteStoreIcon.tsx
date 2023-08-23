import React, { memo, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { icons } from 'assets/images'

import Button from 'src/controls/Button'
import Alert from 'src/controls/Modal/Alert'

import { setFavoriteStoreAction } from 'src/redux/actions/store/favorite'
import { favoriteStoreIdSelector } from 'src/redux/selectors/myBn/storeSelector'

const FavoriteContainer = styled.View``

const FavoriteIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.moderateRed};
`

interface OwnProps {
  storeId: string
}

interface StateProps {
  favoriteStoreId: string
}

const selector = createStructuredSelector({
  favoriteStoreId: favoriteStoreIdSelector,
})

interface DispatchProps {
  setFavoriteStore: (storeId: string) => boolean
  checkIsLoggedOut: () => void | boolean
}

const dispatcher = (dispatch) => ({
  setFavoriteStore: (storeId) => dispatch(setFavoriteStoreAction(storeId)),
  checkIsLoggedOut: () => dispatch(checkIsUserLoggedOutToBreakAction()),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(
  selector,
  dispatcher,
)

type Props = StateProps & DispatchProps & OwnProps

const FavoriteStoreIcon = ({
  storeId,
  favoriteStoreId,
  setFavoriteStore,
  checkIsLoggedOut,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const setStoreToFavoriteStore = async () => {
    const success = await setFavoriteStore(storeId)
    if (!success) {
      setIsOpen(true)
    }
  }
  const onPress = () => {
    if (checkIsLoggedOut()) {
      return
    } else {
      if (favoriteStoreId && favoriteStoreId === storeId) {
        return
      }
      setStoreToFavoriteStore()
    }
  }

  return (
    <FavoriteContainer>
      <Button icon onPress={onPress}>
        {favoriteStoreId === storeId ? (
          <FavoriteIcon source={icons.favorite} />
        ) : (
          <FavoriteIcon source={icons.unfavorite} />
        )}
      </Button>
      <Alert
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false)
        }}
        title="Something went wrong"
        description="This store could not be set as your favourite right now. Please try again later"
        cancelText="Dismiss"
      />
    </FavoriteContainer>
  )
}

export default memo(connector(FavoriteStoreIcon))
