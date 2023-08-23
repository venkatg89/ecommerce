import React from 'react'
import { Platform, Keyboard } from 'react-native'
import styled from 'styled-components/native'

/*
  Trying a more practical approach, with our own component to insert a space for the keyboard.
  (if/when needed!)
*/

const PRESUMED_KEYBOARD_HEIGHT = Platform.select({ ios: 500, android: 500 })!
const HEIGHT_MULTIPLIER = Platform.select({ ios: 1.0, android: 0.0 })! // Android doesn't need this fix yet
const HEIGHT_MODIFIER = Platform.select({ ios: -35, android: 0 })!

interface SpacerProperties {
  height: number
}

const Spacer = styled.View<SpacerProperties>`
  height: ${({ height }) => height};
`

interface Props {
}

interface State {
  height: number
}


const getHeight = (ev: any) => {
  try {
    return ((ev.endCoordinates.height * HEIGHT_MULTIPLIER) + HEIGHT_MODIFIER) || PRESUMED_KEYBOARD_HEIGHT
  } catch {
    return PRESUMED_KEYBOARD_HEIGHT
  }
}

class KeyboardSpacer extends React.Component<Props, State> {
  state = {
    height: 0,
  }

  componentWillMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidHide = (ev) => {
    this.setState({ height: 0 })
  }

  _keyboardDidShow = (ev) => {
    this.setState({ height: getHeight(ev) })
  }

  keyboardDidHideListener: any


  keyboardDidShowListener: any

  render() {
    const { height } = this.state
    return <Spacer height={ height } />
  }
}

export default KeyboardSpacer
