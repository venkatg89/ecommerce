import hoistNonReactStatic from 'hoist-non-react-statics'
import React from 'react'
import { LoggerContext } from 'src/contexts/LoggerContext'

// No need for a display name for HOC
/* eslint-disable react/display-name */
export default function withLogger(WrapperComponent) {
  class LoggerHoc extends React.Component {
    render() {
      return (
        <LoggerContext.Consumer>
          { ({ logger }) => <WrapperComponent { ...this.props } logger={ logger } /> }
        </LoggerContext.Consumer>
      )
    }
  }

  hoistNonReactStatic(LoggerHoc, WrapperComponent)
  return LoggerHoc
}
