/* eslint-disable react/no-unused-prop-types */
import React, { useState, useEffect } from 'react'
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'
import DefaultTheme from 'src/models/ThemeModel/default'

import getProfilePhotoUrl from 'src/helpers/api/milq/getProfilePhotoUrl'
import { nav } from 'assets/images'
import { ProfileImageEventEmitter, PROFILE_IMAGE_CHANGED_EVENT } from 'src/components/Profile/Header/Image'

export const USER_ICON_SIZE = DefaultTheme.spacing(4)
const USER_ICON_MARGIN = 5
export const EACH_USER_ICON_LENGTH = USER_ICON_SIZE + USER_ICON_MARGIN


type SizeOptions = 'md' | 'lg' | 'xlg' | 'xxlg'

interface SizeProps {
  size: SizeOptions
  overlapping?: boolean
}

const getSizeNumber = (size: SizeOptions) => {
  switch (size) {
    case 'xxlg':
      return 9
    case 'xlg':
      return 6
    case 'lg':
      return 4
    default:
      return 3
  }
}


const Avatar = styled(FastImage)<SizeProps>`
  height: ${({ theme, size }) => theme.spacing(getSizeNumber(size))};
  width: ${({ theme, size }) => theme.spacing(getSizeNumber(size))};
  border-radius: ${({ theme, size }) => theme.spacing(getSizeNumber(size)) / 2};
  ${({ overlapping }) => overlapping && 'margin-right: -10px'};
`


const MoreUsersIconWrapper = styled.View`
  position: relative;
  width: ${USER_ICON_SIZE * 1.5};
`

const MoreUsersIconContainer = styled.View`
  position: absolute;
  height: ${USER_ICON_SIZE};
  width: ${USER_ICON_SIZE};
  left: ${USER_ICON_SIZE / 1.5};
  justify-content: center;
  border-radius: ${USER_ICON_SIZE / 2};
  background-color: ${({ theme }) => theme.palette.disabledGrey};
`

const Text = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  font-size: 9;
  font-family: 'Lato-Regular';
  text-align: center;
`

interface Props {
  userId: string
  usersLeft?: number
  size?: SizeOptions
  overlapping?: boolean
}

// TODO: add in user profile icon
const UserIcon = ({ userId, size = 'lg', overlapping }: Props) => {
  const [image, setImage] = useState({ uri: getProfilePhotoUrl(userId) })
  const onError = () => {
    setImage(nav.topBar.user)
  }

  const refreshUri = (uid) => {
    if (uid === userId) {
      setImage({ uri: getProfilePhotoUrl(userId) })
    }
  }
  useEffect(() => {
    ProfileImageEventEmitter.addListener(PROFILE_IMAGE_CHANGED_EVENT, uid => refreshUri(uid))
  }, [])
  useEffect(() => () => {
    ProfileImageEventEmitter.removeListener(PROFILE_IMAGE_CHANGED_EVENT, uid => refreshUri(uid))
  }, [])

  return <Avatar size={ size } source={ image } onError={ onError } overlapping={ overlapping } />
}

export const MoreUsersIcon = ({ userId, usersLeft, overlapping }: Props) => (
  <MoreUsersIconWrapper>
    <UserIcon userId={ userId } overlapping={ overlapping } />
    <MoreUsersIconContainer>
      <Text adjustsFontSizeToFit numberOfLines={ 1 } minimumFontScale={ 0.01 }>
        {`+${usersLeft}`}
      </Text>
    </MoreUsersIconContainer>
  </MoreUsersIconWrapper>
)

export default UserIcon
