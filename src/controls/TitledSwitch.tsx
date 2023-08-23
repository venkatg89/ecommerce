import React from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'

const SWITCH_WIDTH = 80
const SWITCH_HEIGHT = 32
const CONTAINER_WIDTH = SWITCH_WIDTH * 2
const SWITCH_LEFT_OFFSET = 0 // make these into functions?
const SWITCH_RIGHT_OFFSET = SWITCH_WIDTH
const SWITCH_ANIMATION_DURATION = 200

const Container = styled.View`
  position: relative;
  flex-direction: row;
  height: ${SWITCH_HEIGHT + 2};
  width: ${CONTAINER_WIDTH + 2};
  border-width: 1;
  border-radius: 16;
  border-color: ${({ theme }) => theme.palette.grey5};
`

const Switch = styled(Animated.View)`
  background-color: ${({ theme }) => theme.palette.grey5};
  height: ${SWITCH_HEIGHT};
  width: ${SWITCH_WIDTH};
  border-radius: 14;
`

const TextWrapper = styled.View`
  position: absolute;
  height: ${SWITCH_HEIGHT};
  width: ${SWITCH_WIDTH};
  justify-content: center;
  align-items: center;
`

interface TextProps {
  isActive: boolean;
}

const Text = styled.Text<TextProps>`
  ${({ theme }) => theme.typography.subTitle2};
  color: ${({ theme, isActive }) => (isActive ? theme.palette.grey1 : theme.palette.grey2)};

`

interface State {
  offsetX: Animated.Value;
}

interface Props {
  onValueChange: (value: string | number | boolean) => void;
  values: string[] | number[] | boolean[];
  leftText: string;
  rightText: string;
  activeValue: string | number | boolean;
}

// this is currently a basic 2 button switch that has a fixed width
// TODO: make any amount switch position + dynamic width and drag feature
class TitledSwitch extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      offsetX: new Animated.Value(
        props.activeValue === props.values[0] ? SWITCH_LEFT_OFFSET : SWITCH_RIGHT_OFFSET,
      ),
    }
  }

  // handle the animation on activeswitch change being passed back down
  componentWillReceiveProps = (nextProps: Props) => {
    if (this.props.activeValue !== nextProps.activeValue) {
      this.animateSwitch()
    }
  }

  onPress = () => {
    const {
      onValueChange,
      values,
      activeValue,
    } = this.props

    if (activeValue === values[0]) {
      onValueChange(values[1])
    } else if (activeValue === values[1]) {
      onValueChange(values[0])
    }
  }

  animateSwitch = () => {
    const { activeValue, values } = this.props

    if (activeValue === values[0]) {
      Animated.timing(this.state.offsetX, {
        toValue: SWITCH_RIGHT_OFFSET,
        duration: SWITCH_ANIMATION_DURATION,
        useNativeDriver: false,
      }).start()
    } else if (activeValue === values[1]) {
      Animated.timing(this.state.offsetX, {
        toValue: SWITCH_LEFT_OFFSET,
        duration: SWITCH_ANIMATION_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  render() {
    const { activeValue, values, leftText, rightText } = this.props
    const { offsetX } = this.state

    return (
      <TouchableWithoutFeedback onPress={ this.onPress }>
        <Container>
          <Switch style={ { transform: [{ translateX: offsetX }] } } />
          <TextWrapper style={ { left: 0 } }>
            <Text isActive={ activeValue === values[0] }>
              { leftText }
            </Text>
          </TextWrapper>
          <TextWrapper style={ { right: 0 } }>
            <Text isActive={ activeValue === values[1] }>
              { rightText }
            </Text>
          </TextWrapper>
        </Container>
      </TouchableWithoutFeedback>
    )
  }
}

export default TitledSwitch
