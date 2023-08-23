import { loginAnewOrRestoreLogin } from './login'
import { NodeJsSession } from './sessions'
import Logger from 'src/helpers/logger'
import { StoreBackDoor } from 'src/redux/backdoor/interface'
import { userMilqSessionLost } from 'src/redux/actions/login/basicActionsPayloads'

let store: Nullable<StoreBackDoor> = null
export const setStoreBackDoor = (storeBackDoor: StoreBackDoor) => {
  store = storeBackDoor
}

const logger = Logger.getInstance()

export const atgSessionLost = async (): Promise<boolean> => {
  logger.info('ATG session lost - re-login, then retry...')
  return loginAnewOrRestoreLogin({ atg: true })
}

export const milqSessionLost = async (): Promise<boolean> => {
  store!.dispatch(userMilqSessionLost())
  logger.info('Milq session lost - re-login, then retry...')
  return loginAnewOrRestoreLogin({ milq: true })
}

export const nodeJsSessionLost = async (): Promise<boolean> => {
  await NodeJsSession.clear()
  logger.info('NodeJs session lost - re-login, then retry...')
  return loginAnewOrRestoreLogin({ nodeWithAtg: true })
}
