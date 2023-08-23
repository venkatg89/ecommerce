import React, { useState, useCallback } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'

import { icons } from 'assets/images'

import CtaButton from 'src/controls/navigation/CtaButton'
import Button from 'src/controls/Button/CtaButton'
import DraggableModal from 'src/controls/Modal/BottomDraggable'

import { Params } from 'src/helpers/navigationService'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

import { getReadingStatusPrivacy } from 'src/redux/selectors/userSelector'
import { updatePrivacyAction } from 'src/redux/actions/user/privacyAction'

interface OwnProps {
  readingStatus: ReadingStatus
}

interface StateProps {
  isPublicList: boolean
}

const selector = createStructuredSelector({
  isPublicList: (state, ownProps) => {
    const props = ownProps as OwnProps
    const { readingStatus } = props
    return getReadingStatusPrivacy(state, { readingStatus, isLocal: true })
  },
})

interface DispatchProps {
  updatePrivacy: (privacyParams) => void
}

const dispatcher = dispatch => ({
  updatePrivacy: privacyPrams => dispatch(updatePrivacyAction(privacyPrams)),
})

const connector = connect<StateProps, DispatchProps, OwnProps>(selector, dispatcher)

type Props = StateProps & OwnProps & DispatchProps & NavigationInjectedProps

const ReadingStatusListCta = ({ navigation, isPublicList, updatePrivacy, readingStatus }: Props) => {
  const [isModalOpen, setModal] = useState<boolean>(false)

  const toggleModal = useCallback(() => setModal(!isModalOpen), [isModalOpen])
  const handleUpdatePrivacy = useCallback(() => {
    updatePrivacy({ [readingStatus]: !isPublicList })
    toggleModal()
  }, [])
  const toggleEditState = useCallback(() => {
    if (navigation.getParam(Params.EDIT_MODE, false)) {
      navigation.setParams({ [Params.EDIT_MODE]: false })
    } else {
      navigation.setParams({ [Params.EDIT_MODE]: true })
    }
    toggleModal()
  }, [toggleModal, navigation.getParam(Params.EDIT_MODE)])

  return (
    <>
      <CtaButton dots onPress={ toggleModal } />
      <DraggableModal
        isOpen={ isModalOpen }
        onDismiss={ toggleModal }
      >
        <Button
          icon={ icons.edit }
          label={ (navigation.getParam(Params.EDIT_MODE, false) ? 'Exit Edit' : 'Edit List') }
          onPress={ toggleEditState }
        />
        <Button
          icon={ isPublicList ? icons.lockClosed : icons.public }
          label={ isPublicList ? 'Make List Private' : 'Make List Public' }
          onPress={ handleUpdatePrivacy }
        />
      </DraggableModal>
    </>
  )
}

export default withNavigation(connector(ReadingStatusListCta))
