import React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import clamp from 'src/helpers/clamp'

const PROGRESS_ANIMATION_DURATION = 50

const Container = styled.View`
  position: relative;
  overflow: hidden;
  border-radius: 3;
  border-width: 1;
  border-color: ${({ theme }) => theme.font.default};
  height: 9;
  background-color: ${({ theme }) => theme.palette.grey3};
`
interface ProgressProps {
  color?: string
}

const ProgressBarProgress = styled<ProgressProps>(Animated.View)`
  position: absolute;
  background-color: ${({ theme, color }) => color ? color : theme.font.default};
  top: 0;
  bottom: 0;
  left: 0;
`

interface State {
  widthPercentage: Animated.Value; // we will map 0:1 to 0:100%
}

interface Props extends ProgressProps {
  progress: number; // 0 => 1
  style?: any;
}

// TODO: animations
class ProgressBar extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      widthPercentage: new Animated.Value(clamp(props.progress, 0, 1)),
    }
  }

  componentDidUpdate(prevProps) {
    const { progress } = this.props
    if (progress !== prevProps.progress) {
      Animated.timing(this.state.widthPercentage, {
        toValue: clamp(progress, 0, 1),
        duration: PROGRESS_ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    }
  }

  render() {
    const { style , color } = this.props
    const { widthPercentage } = this.state

    return (
      <Container style={ style }>
        <ProgressBarProgress color={color}
          style={ {
            width: widthPercentage.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          } }
        />
      </Container>
    )
  }
}

export default ProgressBar
