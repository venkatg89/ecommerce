import React, { useRef, useEffect } from 'react'
import styled from 'styled-components/native'
import { Animated } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { resetProgress } from 'src/redux/actions/form/progressAction'

import { progressSelector } from 'src/redux/selectors/formSelector'

const ProgressBarContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.palette.disabledGrey};
`
const Bar = styled.View`
  height: 8;
  background-color: ${({ theme }) => theme.palette.primaryGreen};
`

const AnimatedProgressBar = Animated.createAnimatedComponent(Bar)

interface StateProps {
  progressOption: {
    start: string
    end: string
  }
}

interface DispatchProps {
  reset: () => void
}

type OwnProps = {
  start: string
  end: string
  style?:any
}

type Props = StateProps & OwnProps & DispatchProps


const selector = createStructuredSelector({
  progressOption: progressSelector,
})

const dispatcher = dispatch => ({
  reset: () => dispatch(resetProgress()),

})


const connector = connect<StateProps, DispatchProps, {}>(selector, dispatcher)

const ProgressBar = ({ start, end, style, progressOption, reset }: Props) => {
  const animatedProgressBar = useRef(new Animated.Value(0)).current
  const progressStart = progressOption.start || start
  const progressEnd = progressOption.end || end

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(animatedProgressBar, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start()
    }, 300)
  })

  // To show last step progress actions
  useEffect(() => {
    if (progressOption) {
      setTimeout(() => {
        Animated.timing(animatedProgressBar, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start()
      }, 300)
    }
  }, [progressOption])

  useEffect(() => () => {
    reset()
  }, [])

  const progressBarStyle = {
    width: animatedProgressBar.interpolate({
      inputRange: [0, 1],
      outputRange: [progressStart, progressEnd],
    }),
  }

  return (
    <ProgressBarContainer style={ style }>
      <AnimatedProgressBar style={ progressBarStyle } />
    </ProgressBarContainer>
  )
}

export default connector(ProgressBar)
