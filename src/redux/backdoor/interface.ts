/*
 Gives store to helper functions that are too deep for these values to be parsed as params, all the way down
 Please use only in these cases, avoiding use in cases where a dispatch/state can be just passed in.
*/

import { Dispatch } from 'redux'
import { State } from 'src/redux/reducers'

export interface StoreBackDoor {
  getState(): State
  dispatch: Dispatch<State>
}
