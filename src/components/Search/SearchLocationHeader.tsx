import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import DeviceInfo from 'react-native-device-info'
import Geolocation from 'react-native-geolocation-service'

import { nav, icons } from 'assets/images'

import _TextField from 'src/controls/form/TextField'
import Button from 'src/controls/Button'

import {
  CONTENT_WIDTH,
  CONTENT_HORIZONTAL_PADDING,
  useResponsiveDimensions,
} from 'src/constants/layout'
import { PositionRegion } from 'src/models/MapModel'
import { permissionDeniedAction } from 'src/redux/actions/permissions/request'

interface TabletContainerProps {
  currentWidth: number
}

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  padding: ${({ theme }) => `${theme.spacing(1)}px ${theme.spacing(2)}px`};
  ${DeviceInfo.isTablet() &&
  `
    height: 0;
    padding: 0;
    overflow: visible;
    position: relative;
    z-index: 1;
  `}
`

const TabletContainer = styled.View<TabletContainerProps>`
  overflow: visible;
  position: absolute;
  width: ${({ currentWidth }) => CONTENT_WIDTH(currentWidth)};
  margin-horizontal: ${({ currentWidth }) =>
    CONTENT_HORIZONTAL_PADDING(currentWidth)};
  ${({ theme }) => `
    background-color: ${theme.palette.white};
    top: ${theme.spacing(1)};
  `}
`

const TextField = styled(_TextField)`
  width: 100%;
  background-color: 'rgb(255,255,255)';
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

interface OwnProps {
  onSubmit?: (search: string) => void
  onPressCurrentLocation: (position: PositionRegion) => void
  onValueChange?: (search: string) => void
  onReset?: (isCancel?: boolean) => void
  value?: string
  isBN?: boolean
}

interface DispatchProps {
  locationPermissionDenied: (isBN: boolean) => void
}

const dispatcher = (dispatch) => ({
  locationPermissionDenied: (isBN) =>
    dispatch(permissionDeniedAction(isBN ? 'locationStore' : 'location')),
})

const connector = connect<{}, DispatchProps, OwnProps>(null, dispatcher)

type Props = DispatchProps & OwnProps

const SearchHeader = ({
  onSubmit,
  onPressCurrentLocation,
  onValueChange,
  value,
  onReset,
  locationPermissionDenied,
  isBN,
}: Props) => {
  const [search, setSearch] = useState<string>('')
  const { width } = useResponsiveDimensions()

  useEffect(() => {
    setSearch(value || '') // value override
  }, [value])

  const onChange = (_value: string) => {
    setSearch(_value)
    if (onValueChange) {
      onValueChange(_value)
    }
  }

  const handleSubmit = () => {
    if (!!search && onSubmit) {
      onSubmit(search)
    }
  }

  const moveToCurrentLoacation = () => {
    Geolocation.getCurrentPosition(
      // eslint-disable-line
      (position) => {
        onPressCurrentLocation({
          latitude: position.coords.latitude || 0,
          longitude: position.coords.longitude || 0,
        })
      },
    )
  }

  const getTextFieldElement = () => {
    const textField = (
      <TextField
        value={search}
        onChange={onChange}
        onEndEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Search by city, state, or zip code"
        startAdornment={<Icon source={nav.topBar.loupe} />}
        endAdornment={
          onReset && search ? (
            <Button icon onPress={() => onReset(true)}>
              <Icon source={icons.searchClose} />
            </Button>
          ) : (
            <Button
              accessibilityLabel="center on your location"
              onPress={moveToCurrentLoacation}
              icon
            >
              <Icon source={icons.myLocation} />
            </Button>
          )
        }
      />
    )
    if (DeviceInfo.isTablet()) {
      return (
        <TabletContainer currentWidth={width}>
          {textField}
        </TabletContainer>
      )
    }
    return textField
  }

  return <Container>{getTextFieldElement()}</Container>
}

export default connector(SearchHeader)
