import React from 'react'
import styled from 'styled-components/native'
import { ScrollView, Keyboard, Platform, KeyboardEventName, StyleProp, ViewStyle } from 'react-native'

const KeyboardContainer = styled.KeyboardAvoidingView`
  flex: 1;
`

type Type= 'scrollView' | 'view'

interface Props {
  viewIsInsideTabBar?: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  type?: Type
}
interface State {
  keyboardSpace: number
}

class KeyboardAwareScrollView extends React.Component<Props, State> {
  state = {
    keyboardSpace: 0,
  }

  componentDidMount() {
    const keyboardShowEvent: KeyboardEventName = Platform.select({ ios: 'keyboardWillShow', android: 'keyboardDidShow' })! as KeyboardEventName
    const keyboardHideEvent: KeyboardEventName = Platform.select({ ios: 'keyboardWillHide', android: 'keyboardDidHide' })! as KeyboardEventName
    this.keyboardDidShowListener = Keyboard.addListener(keyboardShowEvent, this.updateKeyboardSpace)
    this.keyboardDidHideListener = Keyboard.addListener(keyboardHideEvent, this.resetKeyboardSpace)
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  updateKeyboardSpace = (frames) => {
    const keyboardSpace = (this.props.viewIsInsideTabBar)
      ? frames.endCoordinates.height - 49
      : frames.endCoordinates.height + 50
    this.setState({
      keyboardSpace,
    })
  }

  resetKeyboardSpace = () => this.setState({
    keyboardSpace: 0,
  })


  /**
   * @param extraHeight: takes an extra height in consideration.
   */
  scrollToFocusedInput = (event, reactNode, extraHeight = 49) => {
    const scrollView = this.keyboardScrollView.getScrollResponder()
    scrollView.scrollResponderScrollNativeHandleToKeyboard(
      reactNode, extraHeight, true,
    )
  }

  keyboardScrollView: any

  keyboardDidHideListener: any

  keyboardDidShowListener: any

  render() {
    const { style, children, contentContainerStyle } = this.props
    const { keyboardSpace } = this.state
    return (
      Platform.OS === 'ios' ? (
        <ScrollView
          ref={ (ref) => { this.keyboardScrollView = ref } }
          keyboardDismissMode="on-drag"
          contentInset={ { bottom: keyboardSpace } }
          showsVerticalScrollIndicator={ false }
          style={ style }
          contentContainerStyle={ contentContainerStyle }
        >
          {children}
        </ScrollView>
      ) : (
        <KeyboardContainer
          behavior="padding"
          keyboardVerticalOffset={ -500 }
          style={ style }
        >
          <ScrollView
            contentContainerStyle={ contentContainerStyle }
            ref={ (ref) => { this.keyboardScrollView = ref } }
            onScrollEndDrag={ Keyboard.dismiss }
          >
            {children}
          </ScrollView>
        </KeyboardContainer>
      ))
  }
}

export default KeyboardAwareScrollView
