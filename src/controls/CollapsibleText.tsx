import React from 'react'
import { Text as TextComponent } from 'react-native'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

const DEFAULT_MAX_NUMBER_OF_LINES = 5

const Container = styled.View``

interface TextProps {
  measuring: boolean;
  center?: boolean;
}

const Text = styled.Text<TextProps>`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.body1}
  text-align: ${({ center }) => (center ? 'center' : 'left')};
  ${({ measuring }) => (measuring
    ? 'position:absolute; opacity: 0;'
    : ''
  )}
`

interface State {
  measured: boolean;
  measuring: boolean;
  shouldShowReadMore: boolean;
  showAllText: boolean;
}

interface Props {
  style?: any;
  textStyle?: any
  showMoreStyle?: any
  text: string | undefined;
  maxNumberOfLines?: number;
  center?: boolean;
}

const measureHeightAsync = (component): Promise<number> => new Promise((resolve) => {
  if (component) {
    component.measure((x, y, w, h) => { resolve(h) })
  } else {
    resolve(0)
  }
})

function nextFrameAsync() {
  // eslint-disable-next-line
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

// taken and modified from https://github.com/expo/react-native-read-more-text/blob/master/index.js
class CollapsibleText extends React.PureComponent<Props, State> {
  state = {
    measured: false,
    measuring: true,
    shouldShowReadMore: false,
    showAllText: false,
  }

  _isMounted: boolean = false

  _textRef: Nullable<TextComponent> = null

  async componentDidMount() {
    this._isMounted = true
    this.measureHeight()
  }

  async componentDidUpdate() {
    this.measureHeight()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  measureHeight = async () => {
    if (!this._isMounted || !this.props.text) { return }

    await nextFrameAsync()
    if (!this._isMounted) { return }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._textRef)
    this.setState({ measured: true })
    await nextFrameAsync()
    if (!this._isMounted) { return }

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._textRef)
    if (!this._isMounted) { return }

    if (fullHeight > limitedHeight) {
      this.setState({ shouldShowReadMore: true, measuring: false })
      return
    }

    this.setState({ measuring: false })
  }

  _handlePressReadMore = () => {
    this.setState({ showAllText: true })
  }

  _handlePressReadLess = () => {
    this.setState({ showAllText: false })
  }

  _renderSeeMoreButton() {
    const { measuring, shouldShowReadMore, showAllText } = this.state
    const { showMoreStyle } = this.props
    if (!measuring && shouldShowReadMore && !showAllText) {
      return (
        <Button onPress={ this._handlePressReadMore } style={ { marginTop: 5 } } textStyle={ showMoreStyle }>
          see more
        </Button>
      )
    } if (!measuring && shouldShowReadMore && showAllText) {
      return (
        <Button onPress={ this._handlePressReadLess } style={ { marginTop: 5 } } textStyle={ showMoreStyle }>
          see less
        </Button>
      )
    }
    return null
  }

  render() {
    const { measuring, measured, showAllText } = this.state
    const { style, textStyle, text, center, maxNumberOfLines = DEFAULT_MAX_NUMBER_OF_LINES } = this.props

    return (
      <Container style={ style }>
        <Text
          style={ textStyle }
          center={ center }
          measuring={ measuring }
          numberOfLines={ (measured && !showAllText) ? maxNumberOfLines : 0 }
          ref={ (ref) => { this._textRef = ref } }
        >
          { text }
        </Text>
        { this._renderSeeMoreButton() }
      </Container>
    )
  }
}

export default CollapsibleText
