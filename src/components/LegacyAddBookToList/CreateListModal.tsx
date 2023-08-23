import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import Alert from 'src/controls/Modal/Alert'
import TextField from 'src/controls/form/TextField'

import { createCollectionAction } from 'src/redux/actions/collections/updateActions'
import { setformErrorMessagesAction } from 'src/redux/actions/form/errorsAction'
import { isBusyMyCollectionsSelector, getAllCollectionsSelector } from 'src/redux/selectors/myBooks/collectionSelector'
import { myMilqProfileSelector } from 'src/redux/selectors/userSelector'

import { CollectionAndReadingStatusModel } from 'src/models/CollectionModel'
import { ErrorMessage } from 'src/models/FormModel'

import { CREATED_LIST_EXISTS } from 'src/constants/formErrors'


const Header = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSuccess?: (collectionId: string, title: string) => void;
}

interface StateProps {
  isBusy: boolean;
  collections: CollectionAndReadingStatusModel[]
}

const selector = createStructuredSelector({
  isBusy: isBusyMyCollectionsSelector,
  collections: (state, props) => getAllCollectionsSelector(state, { isLocal: true, milqId: myMilqProfileSelector(state) }),
})

interface DispatchProps {
  createCollection: (name: string) => Nullable<string>;
  setError: (error: ErrorMessage) => void
}

const dispatcher = dispatch => ({
  createCollection: name => dispatch(createCollectionAction(name)),
  setError: error => dispatch(setformErrorMessagesAction(CREATED_LIST_EXISTS, [error])),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps

const CreateListModal = ({ isOpen, onDismiss, createCollection, onSuccess, isBusy, collections, setError }: Props) => {
  const [listName, setListName] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(false)
  useEffect(() => {
    setListName('')
  }, [isOpen])

  useEffect(() => {
    const listNames = collections.map(item => item.name.toLowerCase())
    if (listNames.includes(listName.toLocaleLowerCase().trim())) {
      setDisabled(true)
      setError({ formFieldId: 'newListName', error: 'You\'ve already created a list with this name.' })
    } else {
      setDisabled(false)
    }
  }, [listName])

  const onCreate = async () => {
    const collectionId = await createCollection(listName.trim())
    if (collectionId) {
      if (onSuccess) { onSuccess(collectionId, listName) }
    }
    onDismiss()
  }

  const disableButton = isBusy || disabled || listName.trim().length === 0
  return (
    <Alert
      isOpen={ isOpen }
      onDismiss={ onDismiss }
      title="Create a new List"
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
        { title: 'Create list', onPress: onCreate, disabled: disableButton, showSpinner: isBusy },
      ] }
    />
  )
}

export default connector(CreateListModal)
