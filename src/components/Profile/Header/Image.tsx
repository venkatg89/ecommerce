import React from 'react'
import { connect } from 'react-redux'
import EventEmitter from 'eventemitter3'
import { createStructuredSelector } from 'reselect'
import { Alert, StyleSheet, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import styled, { css } from 'styled-components/native'
import ImagePicker from 'react-native-image-crop-picker'
import { milqPreferencesErrorSelector } from 'src/redux/selectors/userSelector'
import { editPreferencesAction } from 'src/redux/actions/user/preferencesAction'
import { Icon } from '../Settings/Section'
import { icons } from 'assets/images'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

const PROFILE_IMAGE_SIZE = 76

const Container = styled.TouchableOpacity`
  position: relative;
  height: ${PROFILE_IMAGE_SIZE};
  width: ${PROFILE_IMAGE_SIZE};
`

const iconStyle = css`
  position: absolute;
  bottom: -6;
  right: -6;
  width: 30;
  height: 30;
  border-radius: 15;
`

const EditIcon = styled(Icon as any)`
  ${iconStyle}
  ${({ theme }) => theme.boxShadow.button}
  background-color: #B1B2B2;
`

const LoadingIcon = styled.ActivityIndicator`
  ${iconStyle}
`

const styles = StyleSheet.create({
  profileImage: {
    height: PROFILE_IMAGE_SIZE,
    width: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    backgroundColor: 'transparent',
  },
})

enum ImagePickerMethods {
  openPicker = 'openPicker',
  openCamera = 'openCamera'
}

interface State {
  uploading: boolean
}

interface StateProps {
  milqPreferencesError: Nullable<String>,
}

const selector = createStructuredSelector({
  milqPreferencesError: milqPreferencesErrorSelector,
})

interface DispatchProps {
  editProfileImage: (image: string) => void;
}

const dispatcher = dispatch => ({
  editProfileImage: (image: string) => dispatch(editPreferencesAction({ image })),
})

const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

interface MainProps {
  isOwnProfile: boolean;
  uri: string;
  uid: string;
}

type Props = StateProps & MainProps & DispatchProps

export const PROFILE_IMAGE_CHANGED_EVENT = 'PROFILE_IMAGE_CHANGED_EVENT'
export const ProfileImageEventEmitter = new EventEmitter()

class ProfileImage extends React.Component<Props, State> {
  state = {
    uploading: false,
  }

  showImagePicker = () => {
    let buttons = [
      {
        text: 'Take Photo...',
        onPress: () => this.pickImage(ImagePickerMethods.openCamera) },
      {
        text: 'Choose from Library...',
        onPress: () => this.pickImage(ImagePickerMethods.openPicker),
      },
      { text: 'Cancel' },
    ]
    if (Platform.OS === 'android') {
      buttons = buttons.reverse()
    }

    Alert.alert('Profile image', 'Choose an option below', buttons, { cancelable: false })
  }

  pickImage = async (method: ImagePickerMethods) => {
    let response
    this.setState({ uploading: true })

    try {
      response = await ImagePicker[method]({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
        compressImageQuality: 0.8,
        includeBase64: true,
        mediaType: 'photo',
        useFrontCamera: true,
      })
      await this.props.editProfileImage((response as any).data)
      ProfileImageEventEmitter.emit(PROFILE_IMAGE_CHANGED_EVENT, this.props.uid)
    } catch (error) {
      logger.error(`ProfileImage: ${error}`)
    }

    this.setState({ uploading: false })
  }

  render() {
    const { isOwnProfile, uri } = this.props

    return (
      <Container
        accessible={ !!isOwnProfile }
        accessibilityLabel="profile picture"
        disabled={ !isOwnProfile }
        onPress={ this.showImagePicker }
      >
        <FastImage
          key={ uri }
          style={ styles.profileImage }
          source={ {
            uri,
            priority: FastImage.priority.high,
          } }
        />
        { isOwnProfile && (
          this.state.uploading ? <LoadingIcon size="small" /> : <EditIcon source={ icons.uploadProfilePic } />
        ) }
      </Container>
    )
  }
}

export default connector(ProfileImage)
