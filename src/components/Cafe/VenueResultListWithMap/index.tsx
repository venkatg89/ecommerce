import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components/native'

import VenueMap from './VenueMap'
import VenueList from './VenueList'

import { PositionRegion } from 'src/models/MapModel'

const Container = styled.View`
  flex: 1;
`

const Content = styled.View`
  flex: 0.5;
  width: 100%;
`

const ContentList = styled.View`
  flex: 0.5;
  width: 100%;
  border-top-width: 1;
  border-top-color: ${({ theme }) => theme.palette.disabledGrey};
  background-color: ${({ theme }) => theme.palette.white};
`

interface OwnProps {
  currentPosition: PositionRegion
  onEndReached?: () => void
  isSearchingNearby: boolean
}

type Props = OwnProps

const VenueResultList = ({
  currentPosition,
  onEndReached,
  isSearchingNearby,
}: Props) => {
  const [
    focusedPositionState,
    setFocusedPositionState,
  ] = useState<PositionRegion>(currentPosition)

  useEffect(() => {
    setFocusedPositionState(currentPosition)
  }, [currentPosition])

  const centerOnMap = useCallback((position: PositionRegion) => {
    setFocusedPositionState(position)
  }, [])

  return (
    <Container>
      <Content>
        <VenueMap focusedPosition={focusedPositionState} />
      </Content>
      <ContentList>
        <VenueList
          currentPosition={currentPosition}
          onEndReached={onEndReached}
          setPositionOnVenue={centerOnMap}
          isSearchingNearby={isSearchingNearby}
        />
      </ContentList>
    </Container>
  )
}

export default VenueResultList
