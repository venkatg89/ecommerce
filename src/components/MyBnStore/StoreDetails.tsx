import React, { useState, useCallback, useEffect } from 'react'
import { StyleProp, ViewStyle, Platform, Linking } from 'react-native'
import styled from 'styled-components/native'

import { icons } from 'assets/images'
import { CtaButton } from 'src/controls/layout/Section'

import Button from 'src/controls/Button'
import Alert from 'src/controls/Modal/Alert'
import FavoriteStoreIcon from 'src/components/MyBnStore/FavoriteStoreIcon'

import { StoreModel } from 'src/models/StoreModel'
import { navigate, Routes, Params } from 'src/helpers/navigationService'

const Container = styled.View``

const HeaderContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  justify-content: space-between;
  align-items: center;
`
const SecondHeaderContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(3)};
  justify-content: space-between;
  align-items: center;
`

const StoreNameText = styled.Text`
  ${({ theme }) => theme.typography.heading2}
  color: ${({ theme }) => theme.palette.grey1};
`

interface RowProps {
  marginTop?: boolean
}

const Row = styled.View<RowProps>`
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: ${({ theme }) => -theme.spacing(1)};
  ${({ theme, marginTop }) =>
    marginTop ? `margin-top: ${theme.spacing(6)};` : ''}
`

const Column = styled.View`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing(1)};
`

interface BodyTextProps {
  marginTop?: boolean
}

const BodyText = styled.Text<BodyTextProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme, marginTop }) =>
    marginTop ? `margin-top: ${theme.spacing(1)};` : ''}
`

const StoreNumber = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const StoreHourHeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1) / 2};
`

const StoreHourText = styled(BodyText)`
  margin-right: ${({ theme }) => theme.spacing(1)}; ;
`

const StoreHourRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`

const EmptySpace = styled.View`
  margin: 0 ${({ theme }) => theme.spacing(1)}px;
  height: 40;
`

const StoreButton = styled(Button)`
  margin: 0 ${({ theme }) => theme.spacing(1)}px;
  height: 40;
`

const ButtonIcon = styled.Image`
  height: ${({ theme }) => theme.spacing(3)};
  width: ${({ theme }) => theme.spacing(3)};
  tint-color: ${({ theme }) => theme.palette.white};
`

const ButtonText = styled.Text`
  ${({ theme }) => theme.typography.button.small};
  color: ${({ theme }) => theme.palette.white};
  padding-left: ${({ theme }) => theme.spacing(1)};
  text-transform: uppercase;
`

interface OwnProps {
  style?: StyleProp<ViewStyle>
  storeDetails: StoreModel
}

type Props = OwnProps

const StoreDetails = ({ style, storeDetails: store }: Props) => {
  const [isOpen, toggleOpenState] = useState<boolean>(false)
  const [isHolidayExpanded, setHolidayExpanded] = useState<boolean>(false)
  const [showGoogleMapsIOS, setShowGoogleMapsIOS] = useState<boolean>(false)
  const openModal = useCallback(() => {
    toggleOpenState(true)
  }, [])
  const closeModal = useCallback(() => {
    toggleOpenState(false)
  }, [])
  const gglMapsDeepLink = `comgooglemaps://?daddr=${store.latitude},${store.longitude}`

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
    const latLng = `${store.latitude},${store.longitude}`
    const label = encodeURIComponent(store.name)
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    })
    Linking.openURL(url!)
    closeModal()
  }, [store])

  const navigateToCafe = useCallback(() => {
    navigate(Routes.CAFE__MAIN, { [Params.STORE_ID]: store.id })
  }, [store])

  const handlePressToCall = useCallback(() => {
    const phonNumber = store.phone.replace(/-/g, '')
    const decorator = Platform.select({ ios: 'tel:', android: 'telprompt:' })
    Linking.openURL(`${decorator}${phonNumber}`)
  }, [store.phone])
  //mock some data because the store.holidayHours fiels is currently empty
  const mockHolidayHours =
    'December 13: 11:00 AM - 6:00 PM, December 14: 11:00 AM - 6:00 PM, December 15: 11:00 AM - 6:00 PM, December 16: 11:00 AM - 6:00 PM, December 17: 11:00 AM - 6:00 PM'
  // split into day + hours, if it splits into more parts, fuse them back together and assume as is
  const storeHoursMatrix = store.hours
    .split(',')
    .map((hour) => hour.trimStart().trimRight().split(' '))
    .map((array) => (array.length > 2 ? [array.join(' ')] : array))
  const holidayHoursMatrix = mockHolidayHours
    .split(',')
    .map((hour) => hour.trimStart().trimRight().split(' '))
    .map((array) => (array.length > 2 ? [array.join(' ')] : array))
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
    : `View ${store.name} in Maps to get directions.`

  return (
    <Container style={style}>
      <HeaderContainer>
        <StoreNameText>{store.name}</StoreNameText>
        <FavoriteStoreIcon storeId={store.id} />
      </HeaderContainer>
      <Row>
        <Column>
          <BodyText>{store.address}</BodyText>
          <BodyText>{`${store.city}, ${store.state} ${store.zip}`}</BodyText>
          <StoreNumber onPress={handlePressToCall} linkGreen>
            {store.phone}
          </StoreNumber>
        </Column>
        <Column>
          <StoreHourHeaderText>Store Hours</StoreHourHeaderText>
          {storeHoursMatrix.map((storeHours) => (
            <StoreHourRow key={storeHours.toString()}>
              {storeHours.map((text) => (
                <StoreHourText key={text}>{text}</StoreHourText>
              ))}
            </StoreHourRow>
          ))}
        </Column>
      </Row>
      <Row>
        <Column>
          <SecondHeaderContainer>
            <StoreHourHeaderText>Holiday Hours</StoreHourHeaderText>
            <CtaButton
              title={isHolidayExpanded ? 'See Less' : 'See More'}
              onPress={() => {
                setHolidayExpanded(!isHolidayExpanded)
              }}
            />
          </SecondHeaderContainer>
          {holidayHoursMatrix.map((holidayHours, index) => {
            let item = (
              <StoreHourRow key={holidayHours.toString()}>
                {holidayHours.map((text) => (
                  <BodyText key={text}>{text}</BodyText>
                ))}
              </StoreHourRow>
            )
            if (index > 3) {
              return isHolidayExpanded && item
            } else {
              return item
            }
          })}
        </Column>
      </Row>
      <Row marginTop>
        <StoreButton
          icon={icons.direction}
          onPress={openModal}
          variant="contained"
          flex
          maxWidth
        >
          <ButtonIcon source={icons.direction} />
          <ButtonText>Directions</ButtonText>
        </StoreButton>
        {store.hasCafe ? (
          <StoreButton
            icon
            onPress={navigateToCafe}
            variant="contained"
            flex
            maxWidth
          >
            <ButtonIcon source={icons.cafe} />
            <ButtonText>Order Cafe</ButtonText>
          </StoreButton>
        ) : (
          <EmptySpace />
        )}
      </Row>
      <Alert
        isOpen={isOpen}
        onDismiss={closeModal}
        title="Get directions to B&N Store"
        description={directionDesc}
        buttons={directionButtons}
        cancelText={'not now'}
      />
    </Container>
  )
}

export default StoreDetails
