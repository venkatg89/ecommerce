import React, { useState, useEffect, useCallback, Fragment } from 'react'
import styled from 'styled-components/native'
import NetInfo from '@react-native-community/netinfo'

import { backOnlineEventEmitter, updateApiStatusEvent } from 'src/helpers/api/makeApiRequest'

const Text = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
`

const Container = styled.SafeAreaView`
  background-color: ${({ theme }) => theme.palette.supportWarning};
  justify-content: center;
`


const OfflineNotice = () => {
  const [connection, setConnection] = useState<boolean>(true)


  const onChangeConnection = useCallback((newConnection) => {
    setConnection(newConnection)
  }, [connection])


  useEffect(() => {
    const listener = (event: boolean) => { event && setConnection(true) }
    backOnlineEventEmitter.on(updateApiStatusEvent, listener)
    return () => { backOnlineEventEmitter.removeListener(updateApiStatusEvent, listener) }
  }, [])


  useEffect(() => {
    const unsubsribe = NetInfo.addEventListener((state) => {
      onChangeConnection(state.isConnected)
    })
    return () => {
      unsubsribe()
    }
  }, [])

  return (
    <>
      {!connection ? (
        <Container>
          <Text>No Internet Connection</Text>
        </Container>
      ) : <Fragment />}
    </>
  )
}

export default OfflineNotice
