import React from 'react'
import Logger from 'src/helpers/logger'

interface LoggerContext {
  logger?: Logger
}

export const LoggerContext = React.createContext<LoggerContext>({ logger: undefined })
