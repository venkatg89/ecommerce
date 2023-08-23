import { Reducer } from 'redux'
import { StoreModel } from 'src/models/StoreModel'
import { SET_BOPIS_STORE } from 'src/redux/actions/pdp/bopisStore'

const DEFAULT = {
  id: '',
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  latitude: -1,
  longitude: -1,
  hours: '',
  hasCafe: false,
  upcomingStoreEventId: '',
  holidayHours: '',
}

export const BopisStore: Reducer<StoreModel> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_BOPIS_STORE: {
      return action.payload
    }
    default: {
      return state
    }
  }
}
