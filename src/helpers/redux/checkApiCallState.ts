import { ApiStatus, RequestStatus } from 'src/models/ApiStatus'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const ensureNoCallInProgress = (debugName: string, apiStatus?: ApiStatus) => {
  if (apiStatus) {
    const isOngoing = apiStatus!.requestStatus === RequestStatus.FETCHING
    if (isOngoing) {
      logger.warn(`An API Call concerning '${debugName}' already ongoing. Check UIs for proper isBusy statuses.`)
    }
    return !isOngoing
  }
  // No apiStatus is redux yet - so no call was attempted or ongoing.
  return true
}
