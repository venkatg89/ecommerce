import React, { useCallback } from 'react'
import { Linking } from 'react-native'

import Alert from 'src/controls/Modal/Alert'

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

const CalendarPermissionModal = ({ isOpen, onDismiss }: Props) => {
  const openSettings = useCallback(async() => {
    await Linking.openSettings()
    onDismiss()
  }, [])

  return (
    <Alert
      isOpen={ isOpen }
      title="Enable calendar access?"
      description="Allowing access to your calendar enables you to add store events to your calendar."
      buttons={ [{ title: 'ALLOW CALENDAR ACCESS', onPress: openSettings }] }
      onDismiss={ onDismiss }
    />
  )
}

export default CalendarPermissionModal
