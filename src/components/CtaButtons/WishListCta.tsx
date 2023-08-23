import React, { useState, useEffect } from 'react'
import Share from 'react-native-share'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import CtaButton from 'src/controls/navigation/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'
import Button from 'src/controls/Button/CtaButton'
import Alert from 'src/controls/Modal/Alert'
import TextField from 'src/controls/form/TextField'

import { wishListSelector } from 'src/redux/selectors/wishListSelector'
import { updateWishListAction, deleteWishListAction } from 'src/redux/actions/wishList/wishListAction'
import { WishListModel } from 'src/models/WishListModel'
import { icons } from 'assets/images'
import { pop } from 'src/helpers/navigationService'

const Header = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  id: string
}

interface StateProps {
  wishList: WishListModel
}

const selector = createStructuredSelector({
  wishList: wishListSelector,
})

interface DispatchProps {
  updateWishList: (params) => boolean
  deleteWishList: (params) => boolean
}

const dispatcher = dispatch => ({
  updateWishList: (params) => dispatch(updateWishListAction(params)),
  deleteWishList: (params) => dispatch(deleteWishListAction(params)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

enum IsOpen {
  MODAL = 'modal',
  EDIT_NAME = 'edit_name_alert',
  DELETE_CONFIRM = 'delete_confirm_alert'
}

const WishListCtaButton = ({ id, wishList, updateWishList, deleteWishList }: Props) => {
  const [isOpen, setOpen] = useState<IsOpen | undefined>(undefined)
  const [name, setName] = useState<string>('undefined')

  useEffect(() => {
    setName(wishList.name)
  }, [isOpen])

  const togglePrivate = () => {
    updateWishList({ id, name: wishList.name, isPublic: !wishList.isPublic })
  }

  const deleteList = () => {
    const success = deleteWishList({ id })
    if (success) {
      setOpen(undefined)
      pop()
    }
  }

  const onUpdateName = () => {
    updateWishList({ id, name })
  }

  const onShare = async () => {
    const url = `https://www.barnesandnoble.com/account/wishlist.jsp?giftlistId=${id}`
    const options = {
      title: 'Share via',
      url: url,
      social: Share.Social.EMAIL,
    }
    try {
      await Share.open(options)
    } catch { }
  }

  return (
    <>
      <CtaButton dots onPress={ () => setOpen(IsOpen.MODAL) } accessibilityLabel="three dots" />
      { isOpen === IsOpen.MODAL && (
        <DraggableModal
          isOpen={ isOpen === IsOpen.MODAL }
          onDismiss={ () => setOpen(undefined) }
        >
          { !wishList.default && (
            <Button
              icon={ icons.edit }
              label="Rename List"
              onPress={ () => setOpen(IsOpen.EDIT_NAME) }
            />
          ) }
          <Button
            icon={ wishList.isPublic ? icons.public : icons.lockClosed }
            label={ wishList.isPublic ? 'Make List Private' : 'Make List Public' }
            onPress={ togglePrivate }
          />
          { !wishList.default && (
            <Button
              icon={ icons.delete }
              label="Delete List"
              onPress={ () => setOpen(IsOpen.DELETE_CONFIRM) }
              warning
            />
          ) }
          <Button
            icon={ icons.share }
            label="Share"
            onPress={ onShare }
          />
        </DraggableModal>
      ) }
      { isOpen === IsOpen.EDIT_NAME && (
        <Alert
          isOpen={ isOpen === IsOpen.EDIT_NAME }
          onDismiss={ () => setOpen(IsOpen.MODAL) }
          title="Rename List"
          customBody={ (
            <React.Fragment>
              <Header>Edit your list name</Header>
              <TextField
                label="List name"
                onChange={ setName }
                value={ name }
              />
            </React.Fragment>
          ) }
          buttons={ [
            { title: 'Rename list', onPress: onUpdateName },
          ] }
        />
      ) }
      { isOpen === IsOpen.DELETE_CONFIRM && (
        <Alert
          isOpen={ isOpen === IsOpen.DELETE_CONFIRM }
          onDismiss={ () => setOpen(IsOpen.MODAL) }
          title={ `Delete '${wishList.name}'?`}
          description="Are you sure you want to delete this list? Once deleted, a list cannot be retrieved."
          buttons={ [{ title: 'Delete List', onPress: deleteList, warning: true }] }
          cancelText="Not now"
        />
      ) }
    </>
  )
}

export default connector(WishListCtaButton)
