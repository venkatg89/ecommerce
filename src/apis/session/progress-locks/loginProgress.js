import EventEmitter from 'eventemitter3'
import pEvent from 'p-event'

let loginInProgressFlag = false
let lastLoginEndTime = new Date(0)

export const LOGIN_CALL_ENDED = 'LOGIN_CALL_ENDED'

export const eventEmitter = new EventEmitter()

export const waitIfLoginInProgress = async () => {
  if (loginInProgressFlag) {
    await pEvent(eventEmitter, LOGIN_CALL_ENDED)
  }
  // Otherwise, just return. No need to wait.
}

export const isLoginInProgress = () => loginInProgressFlag

export const msSinceLastLoginEnd = () => new Date().getTime() - lastLoginEndTime.getTime()

export const setLoginInProgress = () => {
  loginInProgressFlag = true
}

export const setLoginHasEnded = () => {
  loginInProgressFlag = false
  lastLoginEndTime = new Date()
  eventEmitter.emit(LOGIN_CALL_ENDED)
}
