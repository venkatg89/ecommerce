import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

import Alert from 'src/controls/Modal/Alert'
import TextField from 'src/controls/form/TextField'

import { createWishListAction } from 'src/redux/actions/wishList/wishListAction'
import { CREATED_LIST_EXISTS } from 'src/constants/formErrors'

const Header = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  isOpen: boolean;
  onDismiss: () => void;
}

interface DispatchProps {
  createWishList: (params) => boolean
}

const dispatcher = dispatch => ({
  createWishList: (params) => dispatch(createWishListAction(params)),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = DispatchProps & OwnProps

const CreateNewListModal = ({ isOpen, onDismiss, createWishList }: Props) => {
  const [listName, setListName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setListName('')
    setIsLoading(false)
  }, [isOpen])

  const onCreate = async () => {
    setIsLoading(true)
    const success = await createWishList({ name: listName })
    if (success) {
      onDismiss()
      return
    }
    setIsLoading(false)
  }

  const disableButton = listName.trim().length === 0

  return (
    <Alert
      isOpen={ isOpen }
      onDismiss={ onDismiss }
      title="Create a new list"
      customBody={ (
        <React.Fragment>
          <Header>Add a title for your new book list.</Header>
          <TextField
            label="List name"
            onChange={ setListName }
            value={ listName }
            formId={ CREATED_LIST_EXISTS }
            formFieldId="newListName"
          />
        </React.Fragment>
      ) }
      buttons={ [
        { title: 'Create list', onPress: onCreate, disabled: disableButton, showSpinner: isLoading, withoutDismiss: true },
      ] }
      cancelText="Not now"
    />
  )
}

export default connector(CreateNewListModal)
