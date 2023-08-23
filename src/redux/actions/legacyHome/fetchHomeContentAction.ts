import { State } from 'src/redux/reducers'
import { booksByInterestAction } from 'src/redux/actions/book/booksByInterestAction'
import { booksByContentAction } from 'src/redux/actions/book/booksByContentAction'
import {
  homeDiscoveryClearCardsContentAction,
  homeDiscoveryOrderCardsAction,
  homeDiscoveryGenerateUserTips,
  homeDiscoveryAddCards,
} from 'src/redux/actions/legacyHome/discoveryActions'
import { homeDiscoveryLoadingAction } from './loadingAction'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const fetchHomeContentAction: () => ThunkedAction<State> =
() => async (dispatch, getState) => {
  const start = new Date().getTime()
  logger.info('fetchHomeContentAction starting')

  await dispatch(homeDiscoveryLoadingAction(true))
  await Promise.all([
    dispatch(booksByInterestAction()),
    dispatch(booksByContentAction()),
    dispatch(homeDiscoveryClearCardsContentAction()),

    dispatch(homeDiscoveryOrderCardsAction()),
  ])

  await dispatch(homeDiscoveryAddCards())
  await dispatch(homeDiscoveryGenerateUserTips())
  await dispatch(homeDiscoveryLoadingAction(false))

  logger.info(`Home tab fetched in ${new Date().getTime() - start} ms`)
}
