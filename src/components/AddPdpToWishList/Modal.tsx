import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import DraggableModal from 'src/controls/Modal/BottomDraggable'
import BookImage from 'src/components/BookImage'
import _Button from 'src/controls/Button'

import { wishListsSelector } from 'src/redux/selectors/wishListSelector'
import { addItemToWishListAction, removeItemFromWishListAction } from 'src/redux/actions/wishList/wishListAction'
import { icons } from 'assets/images'
import { WishListModel } from 'src/models/WishListModel'

const Container = styled.View`
  height: 100%;
`

const ScrollContainer = styled.ScrollView``

const Button = styled(_Button)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing(1)};
`

const NameText = styled.Text`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.typography.subTitle1}
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  ${({ green, theme }) => green ? `tint-color: ${theme.palette.primaryGreen};` : ''}
`

const HeaderText = styled.Text`
  align-self: center;
  ${({ theme }) => theme.typography.body1}
`

const ButtonText = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.primaryGreen};
  ${({ theme }) => theme.typography.button.small}
  text-transform: uppercase;
`

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
  ean: string
  toggleCreateNewList: () => void
}

interface StateProps {
  wishLists: WishListModel[]
}

const selector = createStructuredSelector({
  wishLists: wishListsSelector,
})

interface DispatchProps {
  addItemToWishList: (params) => boolean
  removeItemFromWishList: (params) => boolean
}

const dispatcher = dispatch => ({
  addItemToWishList: (params) => dispatch(addItemToWishListAction(params)),
  removeItemFromWishList: (params) => dispatch(removeItemFromWishListAction(params)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const Modal = ({ isOpen, onDismiss, wishLists, ean, toggleCreateNewList, addItemToWishList, removeItemFromWishList }: Props) => {
  const onToggleEanInList = (wishList) => {
    const eanList = wishList.items.map(item => item.ean)
    if (eanList.includes(ean)) { // remove
      removeItemFromWishList({ id: wishList.id, ean })
    } else { // add
      addItemToWishList({ id: wishList.id, ean })
    }
  }

  const renderItem = (wishList) => {
    const eanList = wishList.items.map(item => item.ean)
    return (
      <ItemContainer onPress={ () => { onToggleEanInList(wishList) } }>
        <BookImage bookOrEan={ wishList.items[0] && wishList.items[0].ean } />
          <NameText>{ wishList.name }</NameText>
          { eanList.includes(ean) && (
            <Icon source={ icons.checkboxCheckedCircle } />
          ) }
      </ItemContainer>
    )
  }

  return (
    <DraggableModal
      isOpen={ isOpen }
      onDismiss={ onDismiss }
      fullContent
      header={ (
        <HeaderText>Add to List</HeaderText>
      ) }
    >
      <Container>
        <Button onPress={ toggleCreateNewList } icon>
          <Icon source={ icons.newList } green />
          <ButtonText>Create list</ButtonText>
        </Button>
        <ScrollContainer>
          { wishLists.map(wishList => (
            renderItem(wishList)
          )) }
        </ScrollContainer>
      </Container>
    </DraggableModal>
  )
}

export default connector(Modal)
