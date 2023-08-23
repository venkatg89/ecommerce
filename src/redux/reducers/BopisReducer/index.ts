import { combineReducers } from 'redux'
import { StoreModel } from 'src/models/StoreModel'

import api, { ApiState } from './api'
import { BopisStore } from './store'

export interface BopisState {
  api: ApiState
  pickupStore: StoreModel
}

export default combineReducers<BopisState>({
  api,
  pickupStore: BopisStore,
})
