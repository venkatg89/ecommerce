import { RequestStatus } from 'src/models/ApiStatus'

// Enable multiple spaces to better line things up and visually check for typos
/* eslint-disable no-multi-spaces */
/* eslint-disable indent */

// Proper way to write selector params is
// (state: State)
// ... but this triggers: issue documented in https://github.com/Microsoft/TypeScript/issues/29479
// suggestion - write code with (state: State), then switch to (state: any) when commiting
// import { State } from 'src/redux/reducers'

export const passwordResetStatusSelector = {
  isInProgress: (state: any) => state.atg.api.passwordReset.requestStatus === RequestStatus.FETCHING,
       didFail: (state: any) => state.atg.api.passwordReset.requestStatus === RequestStatus.FAILED,
}

export const signUpStatusSelector = {
  isInProgress: (state: any) => state.atg.api.signUp.requestStatus === RequestStatus.FETCHING,
       didFail: (state: any) => state.atg.api.signUp.requestStatus === RequestStatus.FAILED,
}
