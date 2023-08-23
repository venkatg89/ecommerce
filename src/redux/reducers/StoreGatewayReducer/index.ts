import { combineReducers } from 'redux'

import api, { ApiState } from './api'

export interface StoreGatewayState {
  api: ApiState
}

export default combineReducers<StoreGatewayState>({
  api,
})
