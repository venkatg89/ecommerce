import EventEmitter from 'eventemitter3'
import pEvent from 'p-event'

let loginInProgressFlag = false

export const GUEST_SESSION_CALL_ENDED = 'GUEST_SESSION_CALL_ENDED'

export const eventEmitter = new EventEmitter()

export const waitIfGuestLoginInProgress = async () => {
  if (loginInProgressFlag) {
    await pEvent(eventEmitter, GUEST_SESSION_CALL_ENDED)
  }
  // Otherwise, just return. No need to wait.
}

export const isGuestLoginInProgress = () => loginInProgressFlag

export const setGuestLoginInProgress = () => {
  loginInProgressFlag = true
}

export const setGuestLoginHasEnded = () => {
  loginInProgressFlag = false
  eventEmitter.emit(GUEST_SESSION_CALL_ENDED)
}
