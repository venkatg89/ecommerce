import React, { Component, ReactChild } from 'react'
import { LoggerContext } from 'src/contexts/LoggerContext'
import Logger from 'src/helpers/logger'

interface Props {
  children: ReactChild
}

export class LoggerProvider extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.logger = new Logger()
  }

  logger: Logger

  componentDidCatch(error, info) {
    this.logger.error(info)
  }

  render() {
    const { children } = this.props
    return (
      <LoggerContext.Provider value={ { logger: this.logger } }>
        { children }
      </LoggerContext.Provider>
    )
  }
}
