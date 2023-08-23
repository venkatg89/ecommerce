import React, { useCallback } from 'react'
import { Linking } from 'react-native'
import Alert from 'src/controls/Modal/Alert'

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}
const StoreLocationPermissionModal = ({ isOpen, onDismiss }: Props) => {
  const openSettings = useCallback( async () => {
    await Linking.openSettings()
    onDismiss()
  }, [])

  return (
    <Alert
      isOpen={ isOpen }
      title="See B&N stores near you"
      description="Allow location services while using the app, so we can show you stores nearby."
      buttons={ [{ title: 'TURN ON LOCATION', onPress: openSettings }] }
      onDismiss={ onDismiss }
      cancelText = "NOT NOW"
    />
  )
}

export default StoreLocationPermissionModal
