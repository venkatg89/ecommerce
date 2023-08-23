import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Animated, PanResponder, PanResponderInstance } from 'react-native'
import styled from 'styled-components/native'
import DeviceInfo from 'react-native-device-info'

import { CONTENT_HORIZONTAL_PADDING, CONTENT_WIDTH,
  HEADER_HEIGHT, NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT, BOTTOM_BAR_HEIGHT, useResponsiveDimensions } from 'src/constants/layout'
import { usePrevious } from 'src/helpers/usePrevious'

const MARGIN_TOP_WHEN_OPEN = 32
const SEARCH_BAR_HEIGHT = DeviceInfo.isTablet() ? 0 : 74
const DRAGGABLE_HANDLE_HEIGHT = 20
const TABLET_CLOSE = DeviceInfo.isTablet() ? 40 : 0

// The below are the three height states
const OPENED_VALUE = DeviceInfo.isTablet()
  ? 32 + MARGIN_TOP_WHEN_OPEN
  : MARGIN_TOP_WHEN_OPEN


export enum PositionParams {
  OPEN = OPENED_VALUE,
}

interface ContainerProps {
  currentWidth: number
}

const Wrapper = styled(Animated.View)`
  position: absolute;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding-bottom: ${MARGIN_TOP_WHEN_OPEN};
`

const Container = styled.View<ContainerProps>`
  height: 100%;
  width: 100%;
  ${DeviceInfo.isTablet() ? 'padding-bottom: 40' : ''};
  background-color: ${({ theme }) => theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
  border-top-left-radius: 12;
  border-top-right-radius: 12;
  ${({ currentWidth }) => DeviceInfo.isTablet() && `
    margin-horizontal: ${CONTENT_HORIZONTAL_PADDING(currentWidth)}
    width: ${CONTENT_WIDTH(currentWidth)};
  `}
`

const DraggableContainer = styled.View`
  width: 100%;
  background-color: 'rgb(255,255,255)';
`

const DraggableIcon = styled.View`
  height: 2;
  width: 50;
  background-color: ${({ theme }) => theme.palette.grey2};
  align-self: center;
  ${({ theme }) => `
    margin-top: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(2)};
  `};
  border-radius: 1;
`

interface OwnProps {
  children: React.ReactNode
  topMargin?: number
}


interface ContextProps {
  openContainerCallback: (callback: (() => void)) => void;
  closeContainerCallback: (callback: ((any) => void), params?, closeValue?) => void;
  resetNeutralCallback: (callback: (() => void)) => void;
  currentPosition: number
  currentCloseValue: number
}

export const CollapseContext =
  React.createContext<ContextProps>({
    openContainerCallback: () => {},
    closeContainerCallback: () => {},
    resetNeutralCallback: () => {},
    currentPosition: 0,
    currentCloseValue: 0,
  })

const CollapsableContainer = ({ children, topMargin = 0 }: OwnProps) => {
  const { width, height } = useResponsiveDimensions()

  const CLOSED_VALUE = useMemo(() => height - STATUS_BAR_HEIGHT - BOTTOM_BAR_HEIGHT - HEADER_HEIGHT -
  NAV_BAR_HEIGHT - DRAGGABLE_HANDLE_HEIGHT - SEARCH_BAR_HEIGHT - TABLET_CLOSE, [height])
  const HALF_OPENED_VALUE = useMemo(() => CLOSED_VALUE * 0.6, [CLOSED_VALUE])

  const [orientation, setOrientation] = useState(width < height ? 'portrait' : 'landscape')
  const previous = usePrevious(orientation)
  let _panGesture: Nullable<PanResponderInstance> = null
  const [pan] = useState<Animated.ValueXY>(new Animated.ValueXY())
  const [offset] = useState<Animated.Value>(new Animated.Value(HALF_OPENED_VALUE))
  const [contentFocused, setFocus] = useState<boolean>(false)
  const [currentPosition, setPosition] = useState(HALF_OPENED_VALUE)
  const [currentCloseValue, setCloseValue] = useState(CLOSED_VALUE)

  const resetNeutral = useCallback((callback: (() => void)) => {
    Animated.timing(offset, {
      toValue: HALF_OPENED_VALUE,
      useNativeDriver: false,
    }).start(() => {
      setFocus(false)
      setPosition(HALF_OPENED_VALUE)
      callback && callback()
    })
  }, [HALF_OPENED_VALUE])

  useEffect(() => {
    setOrientation(width < height ? 'portrait' : 'landscape')
    if (previous && previous.orientation !== orientation) {
      setCloseValue(CLOSED_VALUE)
      resetNeutral(() => {})
    }
  }, [width, height])


  const resetPanDelta = useCallback(() => {
    pan.setValue({ x: 0, y: 0 })
  }, [])

  const onReleaseAndBounce = useCallback((gestureState) => {
    Animated.timing(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
    if (gestureState.vy > 0.05) { // dragged down, close
      Animated.timing(offset, {
        toValue: CLOSED_VALUE,
        useNativeDriver: false,
      }).start(() => {
        setPosition(CLOSED_VALUE)
        setFocus(true)
      })
    } else { // maximize
      Animated.timing(offset, {
        toValue: OPENED_VALUE + topMargin,
        useNativeDriver: false,
      }).start(() => {
        setPosition(OPENED_VALUE + topMargin)
        setFocus(false)
      })
    }
  }, [CLOSED_VALUE, OPENED_VALUE])


  _panGesture = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => resetPanDelta(),
    onPanResponderMove: (evt, gestureState) => {
      Animated.event([null, { dy: pan.y }])(evt, gestureState)
    },
    onPanResponderRelease: (evt, gestureState) => {
      onReleaseAndBounce(gestureState)
    },
  })

  const openContainer = useCallback((callback: (() => void)) => {
    // if scrolling from the list and list is hidden, pass a fake gesture to expand up list
    if (!contentFocused) {
      Animated.timing(offset, {
        toValue: OPENED_VALUE + topMargin,
        useNativeDriver: false,
      }).start(() => {
        setFocus(true)
        setPosition(OPENED_VALUE + topMargin)
        callback && callback()
      })
    }
  }, [OPENED_VALUE])

  // need pure function in context, it won't update closed value in consumer when orientation is changed
  const closeContainer = useCallback((callback: ((any) => void), params, closeValue = CLOSED_VALUE) => {
    Animated.timing(offset, {
      toValue: closeValue,
      useNativeDriver: false,
    }).start(() => {
      setFocus(false)
      setPosition(closeValue)
      callback && callback(params)
    })
  }, [CLOSED_VALUE])

  const styles = useMemo(() => ({
    transform: pan.getTranslateTransform(),
    top: offset,
  }), [pan, offset])

  const provider = useMemo(() => ({
    openContainerCallback: openContainer,
    closeContainerCallback: closeContainer,
    resetNeutralCallback: resetNeutral,
    currentPosition,
    currentCloseValue,
  }), [OPENED_VALUE, CLOSED_VALUE, HALF_OPENED_VALUE, currentPosition, currentCloseValue])

  return (
    <Wrapper
      style={ styles }
    >
      <Container currentWidth={ width }>
        <DraggableContainer { ...(_panGesture && { ..._panGesture.panHandlers }) }>
          <DraggableIcon />
        </DraggableContainer>
        <CollapseContext.Provider
          value={ provider }
        >
          {children}
        </CollapseContext.Provider>
      </Container>
    </Wrapper>
  )
}

export default CollapsableContainer
