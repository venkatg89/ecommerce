import React from 'react'
import styled from 'styled-components/native'
import config from 'config'
const packageJson = require('../../package.json')

const Container = styled.View`
  align-items: center;
`

const DebugInfo = styled.View`
  margin-top: 6;
  margin-bottom: 6;
  align-items: center;
`

const DebugText = styled.Text`
  font-size: 8;
  color: #222;
`

interface OwnProps {
  style?: any
}

interface StateProps {}

type Props = StateProps & OwnProps

const AppDetails = ({ style }: Props) => (
  <Container style={style}>
    {__DEV__ && (
      <DebugInfo>
        <DebugText selectable>Debug Info (will be hidden on Prod)</DebugText>
        <DebugText selectable>{`App Version: ${packageJson.version}`}</DebugText>
        <DebugText selectable>
          {`App Config: '${config.configName}'\t__DEV__ is ${
            __DEV__ ? 'enabled' : 'disabled'
          }`}
        </DebugText>
        <DebugText selectable>{`Node: ${config.api.nodeJs.baseUrl}`}</DebugText>
        <DebugText
          selectable
        >{`ATG-GW: ${config.api.atgGateway.baseUrl} ${config.api.atgGateway.env} ${config.api.atgGateway.clientId}`}</DebugText>
        <DebugText selectable>{`Milq: ${config.api.milq.baseUrl}`}</DebugText>
        <DebugText selectable>{`BOPIS: ${config.api.bopis.baseUrl}`}</DebugText>
      </DebugInfo>
    )}
  </Container>
)

export default AppDetails
