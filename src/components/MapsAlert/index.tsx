import React, { useCallback, useEffect, useState } from 'react'
import { Linking, Platform } from 'react-native'
import Alert from 'src/controls/Modal/Alert'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  destination: {
    latitude: number
    longitude: number
    name: string
  }
}

const MapsAlert = ({ isOpen, setIsOpen, destination }: Props) => {
  const [showGoogleMapsIOS, setShowGoogleMapsIOS] = useState<boolean>(false)
  const gglMapsDeepLink = `comgooglemaps://?daddr=${destination.latitude},${destination.longitude}`

  useEffect(() => {
    Linking.canOpenURL(gglMapsDeepLink).then((supported) => {
      if (supported && Platform.OS === 'ios') {
        setShowGoogleMapsIOS(true)
      }
    })
  }, [])

  const navigateToDirection = useCallback(() => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    })
    const latLng = `${destination.latitude},${destination.longitude}`
    const label = encodeURIComponent(destination.name)
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    })
    Linking.openURL(url!)
    setIsOpen(false)
  }, [destination])

  const directionButtons = showGoogleMapsIOS
    ? [
        { title: 'OPEN IN APPLE MAPS', onPress: navigateToDirection },
        {
          title: 'OPEN IN GOOGLE MAPS',
          onPress: () => Linking.openURL(gglMapsDeepLink),
        },
      ]
    : [{ title: 'OPEN IN MAPS', onPress: navigateToDirection }]
  const directionDesc = showGoogleMapsIOS
    ? 'Chose what maps app you want to use for directions to the B&N Store'
    : `View ${destination.name} in Maps to get directions.`

  return (
    <Alert
      isOpen={isOpen}
      onDismiss={() => {
        setIsOpen(false)
      }}
      title="Get directions to B&N Store"
      description={directionDesc}
      buttons={directionButtons}
      cancelText={'not now'}
    />
  )
}
export default MapsAlert
