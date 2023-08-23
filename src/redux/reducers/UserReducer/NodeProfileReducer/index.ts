import { AnyAction } from 'redux'

import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export type NodeProfileState = Nullable<NodeProfileModel>

const DEFAULT: NodeProfileState = null

export default (state: NodeProfileState = DEFAULT, action: AnyAction) => {
  switch (action.type) {
    case USER_SESSION_ESTABLISHED: {
      const payload = action.payload as LoggedInPayload
      if (payload.nodeJs) {
        return payload.nodeJs.nodeProfile
      }
      return state
    }

    default:
      return state
  }
}
