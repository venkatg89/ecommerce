import { Reducer } from 'redux'
import { UPDATE_ENCODED_USERID } from 'src/redux/actions/user/validateSecurityAnswerAction'

const DEFAULT: string = ''

const EncodedUserIdReducer: Reducer<string> = (state = DEFAULT, action) => {
  switch (action.type) {
    case UPDATE_ENCODED_USERID:
      return action.payload
    default:
      return DEFAULT
  }
}

export default EncodedUserIdReducer
