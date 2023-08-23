import { AnyAction } from 'redux'

import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { SET_USER_ATG_ACCOUNT, SET_USER_MEMBERSHIP } from 'src/redux/actions/user/atgAccountAction'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type AtgAccountState = Nullable<AtgAccountModel>

const DEFAULT: AtgAccountState = null

export default (state: AtgAccountState = DEFAULT, action: AnyAction): AtgAccountState => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload.atg) {
        return payload.atg.atgAccount
      }
      return state
    }

    case SET_USER_ATG_ACCOUNT: {
      const account = action.payload as AtgAccountModel
      return account
    }

    case SET_USER_MEMBERSHIP: {
      const { membership } = action.payload
      return { ...state, membership } as AtgAccountModel
    }

    default:
      return state
  }
}
