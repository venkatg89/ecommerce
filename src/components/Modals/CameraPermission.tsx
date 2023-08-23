import React, { useCallback } from 'react'
import { Linking } from 'react-native'

import Alert from 'src/controls/Modal/Alert'

import { pop } from 'src/helpers/navigationService'

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

const CameraPermissionModal = ({ isOpen, onDismiss }: Props) => {
  const openSettings = useCallback(async () => {
    await Linking.openSettings()
    onDismiss()
  }, [])

  return (
    <Alert
      isOpen={ isOpen }
      title="Enable camera access?"
      description="Allowing access to your camera enables you to search for books and add books to lists just by scanning their barcodes."
      buttons={ [{ title: 'ALLOW CAMERA ACCESS', onPress: openSettings }] }
      onDismiss={ onDismiss }
      onCancelCallback={ pop }
    />
  )
}

export default CameraPermissionModal
