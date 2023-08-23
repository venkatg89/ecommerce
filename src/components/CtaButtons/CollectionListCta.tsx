import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

import Button from 'src/controls/Button/CtaButton'
import CtaButton from 'src/controls/navigation/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'
import Alert from 'src/controls/Modal/Alert'
import TextField from 'src/controls/form/TextField'

import { pop, Params } from 'src/helpers/navigationService'
import { CollectionId, CollectionModel, CollectionEditModel } from 'src/models/CollectionModel'

import { updateCollectionAction, deleteCollectionAction } from 'src/redux/actions/collections/updateActions'
import { collectionSelector, isMyCollectionSelector } from 'src/redux/selectors/myBooks/collectionSelector'

type ModalState = 'Closed' | 'CtaModal' | 'EditName' | 'DeleteList'


const Header = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  collectionId: CollectionId;
}

interface StateProps {
  isMyCollection?: boolean;
  collection: CollectionModel;
}

const selector = createStructuredSelector({
  isMyCollection: isMyCollectionSelector,
  collection: collectionSelector,
})

interface DispatchProps {
  updateCollection: (collectionId: CollectionId, params: CollectionEditModel) => void;
  deleteCollection: (collectionId: CollectionId) => void;
}

const dispatcher = dispatch => ({
  updateCollection: (collectionId, params) => dispatch(updateCollectionAction(collectionId, params)),
  deleteCollection: collectionId => dispatch(deleteCollectionAction(collectionId)),

})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & DispatchProps & OwnProps & NavigationInjectedProps

const CollectionListCta = ({ navigation, collectionId, collection, isMyCollection, updateCollection, deleteCollection }: Props) => {
  const [modalState, setModalState] = useState<ModalState>('Closed')
  const [collectionNameState, setCollectionNameState] = useState<string>('')

  useEffect(() => {
    if (modalState === 'EditName') {
      setCollectionNameState(collection.name)
    }
  }, [modalState])

  const onUpdateCollectionName = () => {
    if (collectionNameState !== collection.name) {
      updateCollection(collectionId, { name: collectionNameState })
    }
    setModalState('Closed')
  }

  const handlecloseModal = useCallback(() => {
    setModalState('Closed')
  }, [modalState])

  const toggleEditState = useCallback(() => {
    if (navigation.getParam(Params.EDIT_MODE, false)) {
      navigation.setParams({ [Params.EDIT_MODE]: false })
    } else {
      navigation.setParams({ [Params.EDIT_MODE]: true })
    }
    setModalState('Closed')
  }, [navigation.getParam(Params.EDIT_MODE)])

  const renderModal = () => {
    switch (modalState) {
      case 'EditName':
        return (
          <Alert
            isOpen={ modalState === 'EditName' }
            onDismiss={ () => { setModalState('CtaModal') } }
            title="Rename List"
            customBody={ (
              <React.Fragment>
                <Header>Edit your book list name.</Header>
                <TextField
                  label="List name"
                  onChange={ setCollectionNameState }
                  value={ collectionNameState }
                />
              </React.Fragment>
            ) }
            buttons={ [
              { title: 'Rename list', onPress: onUpdateCollectionName },
            ] }
          />
        )
      case 'DeleteList':
        return (
          <Alert
            isOpen={ modalState === 'DeleteList' }
            onDismiss={ () => { setModalState('CtaModal') } }
            title={
              `Delete List '${collection.name}'` // eslint-disable-line react/prop-types
            }
            description="Are you sure you want to delete this list? Once deleted, a list cannot be retrieved."
            buttons={ [
              { title: 'Delete List', onPress: () => { pop(); deleteCollection(collectionId) }, warning: true },
            ] }
          />
        )
      default:
        return (
          <DraggableModal
            isOpen={ modalState === 'CtaModal' }
            onDismiss={ handlecloseModal }
          >
            <Button
              icon={ icons.edit }
              label={
                (navigation.getParam(Params.EDIT_MODE, false) ? 'Exit Edit' : 'Edit List') // eslint-disable-line react/prop-types
              }
              onPress={ toggleEditState }
            />
            <Button
              icon={ icons.tag }
              label="Rename List"
              onPress={ () => {
                setModalState('EditName')
              } }
            />
            <Button
              icon={
                collection.public ? icons.lockClosed : icons.public // eslint-disable-line react/prop-types
              }
              label={
                collection.public ? 'Make List Private' : 'Make List Public' // eslint-disable-line react/prop-types
              }
              onPress={ () => {
                updateCollection(collectionId, { public: !collection.public }) // eslint-disable-line
                setModalState('Closed')
              } }
            />
            <Button
              icon={ icons.delete }
              label="Delete List"
              onPress={ () => {
                setModalState('DeleteList')
              } }
              warning
            />
          </DraggableModal>
        )
    }
  }

  return (
    <React.Fragment>
      { isMyCollection && (
        <CtaButton dots onPress={ () => { setModalState('CtaModal') } } />
      ) || undefined }
      { renderModal() }
    </React.Fragment>
  )
}

export default withNavigation(connector(CollectionListCta))
