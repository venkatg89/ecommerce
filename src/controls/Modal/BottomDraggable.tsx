import React from 'react'
import { debounce } from 'lodash'
import { Dimensions, Keyboard, ScrollView, ScaledSize } from 'react-native'
import _Modal from 'react-native-modal'
import styled from 'styled-components/native'
import DeviceInfo from 'react-native-device-info'
import { CONTENT_HORIZONTAL_PADDING } from 'src/constants/layout'

import Button, { BUTTON_DEBOUNCE_DELAY } from 'src/controls/Button'

import { isIPhoneX } from 'src/helpers/iPhoneX'

import { icons } from 'assets/images'

const Modal = styled(_Modal)`
  justify-content: flex-end;
  margin-horizontal: 0;
  margin-bottom: 0;
`

interface ModalContainerProps {
  fullContent?: boolean // careful with keyboard and content larger than full size
  currentWidth: number
}

const IconWrapper = styled.View`
  flex-direction: row;
  position: absolute;
  right: ${({ theme }) => theme.spacing(3)};
  top: ${({ theme }) => theme.spacing(2)};
`

const IphoneXPadding = styled.View`
  height: 30;
`

const IconButton = styled(Button)``

const CloseIcon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const ModalContainer = styled.View<ModalContainerProps>`
  position: relative;
  ${({ fullContent }) => (fullContent ? 'flex: 1;' : '')}
  flex-direction: column;
  max-height: 95%;
  min-height: 30%;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-radius: 12;
  background-color: ${({ theme }) => theme.palette.white};
  ${({ currentWidth }) =>
    DeviceInfo.isTablet() &&
    `
    max-width: ${currentWidth - 2 * CONTENT_HORIZONTAL_PADDING(currentWidth)};
    margin-horizontal: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};
  `}
`

const HandleContainer = styled.View`
  height: ${({ theme }) => theme.spacing(2.5)};
  width: 100%;
  justify-content: center;
  align-items: center;
`

const Handle = styled.View`
  height: ${({ theme }) => theme.spacing(0.5)};
  width: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.palette.grey5};
  border-radius: 2;
`

const Content = styled.ScrollView`
  padding-horizontal: ${({ theme }) => theme.spacing(3)};
`

const FooterWrapper = styled.View`
  flex-direction: row;
  width: 100%;
`

interface State {
  keyboardActive: boolean
  scrollOffset: number
  currentDimension: ScaledSize
}

interface Props {
  style?: any
  isOpen: boolean
  onDismiss: () => void
  footer?: React.ReactNode
  hideCloseButton?: boolean
  fullContent?: boolean // careful with keyboard and content larger than full size
  header?: React.ReactNode
}

class ModalControl extends React.Component<Props, State> {
  state = {
    keyboardActive: false,
    scrollOffset: 0,
    currentDimension: Dimensions.get('screen'),
  }

  handleOnScroll = (event) => {
    this.setState({
      scrollOffset: Math.max(0, event.nativeEvent.contentOffset.y),
    })
  }

  handleScrollTo = (position: number) => {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(position)
    }
  }

  handleSetDimension = (dims) => {
    this.setState({ currentDimension: dims.screen })
  }

  componentWillMount = () => {
    Dimensions.addEventListener('change', this.handleSetDimension)
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    )
  }

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    Dimensions.removeEventListener('change', this.handleSetDimension)
  }

  _keyboardDidHide = () => {
    this.setState({ keyboardActive: false })
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardActive: true })
  }

  handleDismiss = debounce(
    () => {
      const { onDismiss } = this.props
      onDismiss()
    },
    BUTTON_DEBOUNCE_DELAY,
    { leading: true, trailing: false },
  )

  backdropPress = () => {
    if (this.state.keyboardActive) {
      Keyboard.dismiss()
    } else {
      this.handleDismiss()
    }
  }

  keyboardDidHideListener: any

  keyboardDidShowListener: any

  scrollViewRef: Nullable<ScrollView> = null

  render() {
    const { currentDimension } = this.state
    const { width } = currentDimension
    const {
      style,
      children,
      isOpen,
      fullContent,
      footer,
      hideCloseButton,
      header,
    } = this.props
    return (
      <Modal
        style={style}
        isVisible={isOpen}
        backdropOpacity={0.5}
        swipeDirection={['down']}
        onBackdropPress={this.backdropPress}
        onSwipeComplete={this.handleDismiss}
        scrollTo={this.handleScrollTo}
        scrollOffset={this.state.scrollOffset}
        scrollOffsetMax={250}
        avoidKeyboard
        propagateSwipe
      >
        <ModalContainer
          accessible={false}
          fullContent={fullContent}
          currentWidth={width}
        >
          <HandleContainer accessible={false}>
            <Handle />
          </HandleContainer>
          {header}
          <Content
            ref={(ref) => {
              this.scrollViewRef = ref
            }}
            onScroll={this.handleOnScroll}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {children}
          </Content>
          {!hideCloseButton && (
            <IconWrapper>
              <IconButton icon onPress={this.handleDismiss}>
                <CloseIcon source={icons.actionClose} />
              </IconButton>
            </IconWrapper>
          )}
          <FooterWrapper>{footer}</FooterWrapper>
          {(isIPhoneX() && <IphoneXPadding />) || undefined}
        </ModalContainer>
      </Modal>
    )
  }
}

export default ModalControl
