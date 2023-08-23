import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import WishLists from 'src/components/WishLists'
import Button from 'src/controls/Button'

import { getWishListsAction } from 'src/redux/actions/wishList/wishListAction'
import { wishListIdsSelector } from 'src/redux/selectors/wishListSelector'
import { push, Routes } from 'src/helpers/navigationService'

const Container = styled.View``

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading3}
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

interface StateProps {
  wishListIds: string[]
}

const selector = createStructuredSelector({
  wishListIds: wishListIdsSelector,
})

interface DispatchProps {
  getWishLists: () => void
}
const dispatcher = (dispatch) => ({
  getWishLists: () => dispatch(getWishListsAction()),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

type Props = StateProps & DispatchProps

const ProfileWishLists = ({ getWishLists, wishListIds }: Props) => {
  useEffect(() => {
    getWishLists()
  }, [])

  return (
    <Container>
      <Header>
        <HeaderText>Wishlists</HeaderText>
        <Button
          onPress={() => {
            push(Routes.WISHLIST__MY_LISTS)
          }}
          linkGreen
        >
          {`See all (${wishListIds.length})`}
        </Button>
      </Header>
      <WishLists listIds={wishListIds.slice(0, 2)} />
    </Container>
  )
}

export default connector(ProfileWishLists)
