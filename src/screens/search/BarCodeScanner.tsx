import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { NavigationInjectedProps } from 'react-navigation'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import _GestureRecognizer from 'react-native-swipe-gestures'

import _Container from 'src/controls/layout/ScreenContainer'
import _Button from 'src/controls/Button'

import { icons } from 'assets/images'

import { permissionDeniedAction } from 'src/redux/actions/permissions/request'

export const ON_SCAN_SUCCESS_CALLBACK_PARAM = '_onScanSuccessCallback'

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
})

const Container = styled(_Container)`
  background-color: ${({ theme }) => theme.palette.black};
`

const GestureRecognizer = styled(_GestureRecognizer)`
  flex: 1;
`

const Overlay = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  border-color: white;
  border-width: 2px;
  background-color: transparent;
  height: 180px;
  position: absolute;
  top: 30%;
  right: 10px;
  left: 10px;
`

const OverlayInner = styled.View`
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 100%;
  height: 176px;
`

const ScanText = styled.Text`
  font-size: 14px;
  color: #fff;
  text-align: center;
  margin: auto 0;
`

const ButtonClose = styled(_Button)`
  margin-left: auto;
`

const IconClose = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  margin-right: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const DEFAULT_SCAN_STRING = 'Please scan the barcode.'
const SCANNING_STRING = 'Scanning...'
const FAILED_SCAN_STRING = 'Something went wrong. Please try again.'

interface State {
  barcodeText: string
  scanning: boolean
}

interface DispatchProps {
  cameraPermissionDenied: () => void
}

const dispatcher = (dispatch) => ({
  cameraPermissionDenied: () => dispatch(permissionDeniedAction('camera')),
})

const connector = connect<{}, DispatchProps, {}>(null, dispatcher)

type Props = DispatchProps & NavigationInjectedProps

// NOTE: this is for search/listings only !!
class BarcodeScannerScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    header: () => null,
    gesturesEnabled: true,
  })

  state = {
    barcodeText: DEFAULT_SCAN_STRING,
    scanning: false,
  }

  onCloseModal = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  swipeConfig = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 90,
  }

  failedBarcodeScan = () => {
    this.setState({ barcodeText: FAILED_SCAN_STRING }, () => {
      setTimeout(() => {
        this.setState({ barcodeText: DEFAULT_SCAN_STRING })
      }, 3000)
    })
  }

  barcodeScannedEan = (scanResult) => {
    const { type, data } = scanResult
    if (type && data) {
      if (type.toLowerCase().includes('ean')) {
        return data
      }
    }
    return undefined
  }

  onBarcodeRead = async (scanResult) => {
    if (this.state.scanning) {
      return
    }
    await this.setState({ scanning: true })

    const ean = this.barcodeScannedEan(scanResult)

    if (ean) {
      const { navigation } = this.props
      const callback = navigation.getParam(ON_SCAN_SUCCESS_CALLBACK_PARAM)
      callback && callback(ean)
      navigation.goBack()
      return
    }

    this.failedBarcodeScan()
    this.setState({ scanning: false })
  }

  onStatusChange = (event) => {
    if (event.cameraStatus === 'NOT_AUTHORIZED') {
      this.props.cameraPermissionDenied()
    }
  }

  render() {
    const { onBarcodeRead, onStatusChange } = this
    const { barcodeText, scanning } = this.state

    return (
      <GestureRecognizer
        onSwipeDown={this.onCloseModal}
        config={this.swipeConfig}
      >
        <Container>
          <ButtonClose icon onPress={this.onCloseModal}>
            <IconClose source={icons.actionClose} />
          </ButtonClose>
          <RNCamera
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            barCodeTypes={
              [
                Platform.select({
                  ios: 'org.gs1.EAN-13',
                  android: 'EAN_13',
                }),
              ] as any
            }
            onBarCodeRead={onBarcodeRead}
            captureAudio={false}
            onStatusChange={onStatusChange}
          />
          <Overlay>
            <OverlayInner>
              <ScanText>{scanning ? SCANNING_STRING : barcodeText}</ScanText>
            </OverlayInner>
          </Overlay>
        </Container>
      </GestureRecognizer>
    )
  }
}

export default connector(BarcodeScannerScreen)
