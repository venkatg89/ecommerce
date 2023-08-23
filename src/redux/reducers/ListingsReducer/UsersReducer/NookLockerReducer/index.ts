import { Reducer } from 'redux'

import { NookListItem } from 'src/models/BookModel'
import { SET_USER_NOOK_LIBRARY, SET_MILQ_USER_NODE_PROFILE } from 'src/redux/actions/user/nodeProfileActions'
import { Uid } from 'src/models/UserModel'


export type NookLockerState = Record<Uid, NookListItem[]>

const DEFAULT = {} as NookLockerState

const nookLocker: Reducer<NookLockerState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MILQ_USER_NODE_PROFILE:
    case SET_USER_NOOK_LIBRARY: {
      const { uid, nookList } = action.payload
      return {
        ...state,
        [uid]: [...nookList],
      }
    }

    default:
      return state
  }
}

export default nookLocker
