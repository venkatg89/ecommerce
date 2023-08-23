/*
 Gives store to helper functions that are too deep for these values
   to be parsed as params, all the way down.
 Please use only in these cases, avoiding use where a dispatcher
  and/or state can be just passed in directly from he caller.
*/

import { StoreBackDoor } from './interface'

// Import all the setStoreBackDoor here
import { setStoreBackDoor as setForAtgAPIs } from 'src/apis/atgGateway'
import { setStoreBackDoor as setForLoginApi } from 'src/apis/session/login'
import { setStoreBackDoor as setForLostSession } from 'src/apis/session/lost'
import { setStoreBackDoor as setForNodeSessionApi } from 'src/apis/session/nodeJs'
import { setStoreBackDoor as setForMilqSessionApi } from 'src/apis/session/milq'
import { setStoreBackDoor as setForAtgSessionApi } from 'src/apis/session/atgGw'
import { setStoreBackDoor as setForNavService } from 'src/helpers/navigationService'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()


// Make sure this is called as soon as the store is created by redux/index.ts
export function distributeBackdoor(backdoor: StoreBackDoor) {
  logger.info('Distributing Backdoor to the Redux Store...')
  // Pass on to all helpers that need it.
  setForNavService(backdoor)
  setForAtgAPIs(backdoor)
  setForLoginApi(backdoor)
  setForLostSession(backdoor)
  setForAtgSessionApi(backdoor)
  setForNodeSessionApi(backdoor)
  setForMilqSessionApi(backdoor)
}
