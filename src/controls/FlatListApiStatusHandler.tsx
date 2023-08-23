import React from 'react'
import styled from 'styled-components/native'

import { RequestStatus } from 'src/models/ApiStatus'


const Container = styled.View`
  flex: 1;
`

interface Props {
  apiStatus: Nullable<RequestStatus>;
  dataArray: any[];
  flatList; // some ts error with stateless components
  initialStateComponent?: React.ReactNode;
  noResultsStateComponent?: React.ReactNode;
  errorStateComponent?: React.ReactNode;
  style?: any
}

export default ({ apiStatus, dataArray, flatList, initialStateComponent, noResultsStateComponent, errorStateComponent , style}: Props) => { // eslint-disable-line
  if (apiStatus === null && initialStateComponent && (!dataArray || !dataArray.length)) {
    return (
      <Container style={ style }>
        { initialStateComponent }
      </Container>
    )
  }
  if (apiStatus === RequestStatus.FAILED && errorStateComponent) {
    return (
      <Container style={ style }>
        { errorStateComponent }
      </Container>
    )
  }
  if (apiStatus === RequestStatus.SUCCESS && noResultsStateComponent) {
    return (dataArray && dataArray.length)
      ? (
        <Container style={ style }>
          {flatList}
        </Container>
      ) : (
        <Container style={ style }>
          { noResultsStateComponent }
        </Container>
      )
  }
  return (
    <Container style={ style }>
      {flatList}
    </Container>
  )
}
