import { getMyNotifications } from 'src/endpoints/milq/user/myNotifications'
import { getHistory } from 'src/endpoints/nodeJs/history'
import { normalizeMilqNotificationsResponse, normalizeNodeJsHistoryResponse, normalizeNotificationFallback, NotificationsModel } from 'src/helpers/api/social/normalizeNotificationsResponse'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { NotificationType } from 'src/models/SocialModel/NotificationModel'
import { ProfileModel } from 'src/models/UserModel'
import { State } from 'src/redux/reducers'
import { getMyProfileUidSelector, myFollowedUserIdsSelector, isUserLoggedInSelector } from 'src/redux/selectors/userSelector'
import { collectionsSetForMilqUserAction } from '../../collections/apiActions'
import { homeSocialLoadingAction } from '../loadingAction'
import { historyApiAction, myNotificationsApiActions, setNotificationsFallbackAction, setNotificationData } from './notificationsActions'
import { normalizeFeedData, normalizeQuestionsReponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { fetchHomeFeed } from 'src/endpoints/milq/communities/fetchHomeFeed'
import { booksDetailsSelector } from 'src/redux/selectors/booksListSelector'
import { getBooksDetails, normalizeAtgBookDetailsToBookModelArray } from 'src/endpoints/atgGateway/pdp/booksDetails'
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import Logger from 'src/helpers/logger'
import { RecommendationSortNames, QuestionModel } from 'src/models/Communities/QuestionModel'
import { fetchQuestions } from 'src/endpoints/milq/communities/fetchQuestions'
import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { BookModel } from 'src/models/BookModel'
import { fetchMembersAction } from '../../communities/fetchMemberAction'


const logger = Logger.getInstance()

export const socialFeedApiActions = makeApiActions('socialFeedApiActions', 'SOCIAL__HOME_FEED')

interface NotificationDataPayload {
  notifications: NotificationsModel[]
  questions: Record<number, QuestionModel>
  answers: Record<number, AnswerModel>
  books: Record<number, BookModel>
  members: Record<string, ProfileModel>
}

export const fetchMyNotificationsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    logger.info('fetchMyNotificationsAction starting')
    const start = new Date().getTime()

    // Set loading state true
    await dispatch(homeSocialLoadingAction(true))

    const uid = getMyProfileUidSelector(getState())

    const usersImFollowing = myFollowedUserIdsSelector(getState())

    if (isUserLoggedInSelector(getState()) && usersImFollowing.length) {
      const notifications: NotificationsModel[] = []
      const notificationsPayload: NotificationDataPayload = {
        notifications,
        questions: {},
        answers: {},
        books: {},
        members: {},
      }

      const responses = await Promise.all([
        // Get notifications from milq api
        actionApiCall(dispatch, myNotificationsApiActions, () => getMyNotifications()),
        // Get notifications node api
        actionApiCall(dispatch, historyApiAction, () => getHistory(usersImFollowing)),
      ])

      // Response from milq
      if (responses[0].ok) {
        const { questionIds, questions, myAnswerNotifications, myNotifications, members } = normalizeMilqNotificationsResponse(responses[0], uid)
        Object.assign(notificationsPayload.questions, questions)
        Object.assign(notificationsPayload.answers, myAnswerNotifications)
        Object.assign(notificationsPayload.members, members)

        const missingMembers = usersImFollowing.filter(item => !Object.keys(members).includes(item))
        if (missingMembers.length) {
          dispatch(fetchMembersAction(missingMembers))
        }
        if (questionIds.length) {
          const params = { ids: questionIds.join(',') }
          try {
            const response = await fetchQuestions(params)
            if (response.ok) {
              const { questions: missingQuestions } = normalizeQuestionsReponseData(response.data)
              Object.assign(notificationsPayload.questions, missingQuestions)
            }
          } catch (error) { logger.warn(`fetchMissingQuestionsAction error caught ${error || '(null)'} ${error ? error.message : ''}`) }
        }

        const books = Object.keys(myAnswerNotifications).reduce((acc, val) => ({
          ...acc,
          [myAnswerNotifications[val].product.ean]: myAnswerNotifications[val].product,
        }), {})

        if (Object.keys(books).length) {Object.assign(notificationsPayload.books, books)}

        notifications.push(...myNotifications)
      }

      // Response from nodeJs
      if (responses[1].ok) {
        const { eans, historyNotifications, posts } = normalizeNodeJsHistoryResponse(responses[1])
        posts.map(item => (item.type !== NotificationType.READING_STATUS_UPDATE
          ? dispatch(collectionsSetForMilqUserAction({ milqUserId: item.uid, collections: [item.collection] }))
          : item))

        const state = getState()
        const _booksDetailsSelector = booksDetailsSelector()
        let books = _booksDetailsSelector(state, { eans })
        const missing = eans.filter(item => !books[item])
        if (missing.length) {
          const detailsResponse = await getBooksDetails(missing)
          if (detailsResponse.ok && detailsResponse.data.response.success) {
            books = {
              ...normalizeAtgBookDetailsToBookModelArray(detailsResponse.data).reduce((acc, val) => {
                acc[val.ean] = val
                return acc
              }, {}),
            }
          }
          Object.assign(notificationsPayload.books, books)
        }

        notifications.push(...historyNotifications)
      }

      // Set Notifications from  milq and nodeJs
      if (notifications.length) {
        const sorted = notifications.sort((a, b) => {
          const first = new Date(a.creationDate)
          const second = new Date(b.creationDate)
          if (first > second) {return -1}
          if (first < second) {return 1}
          return 0
        })
        notificationsPayload.notifications.push(...sorted)
      }
      await dispatch(setNotificationData({ ...notificationsPayload }))
    } else {
      const params = {
        from: 0,
        limit: 6,
        sort: RecommendationSortNames.RECENT,
      }
      const response = await actionApiCall(dispatch, socialFeedApiActions, () => fetchHomeFeed(params))
      if (response.ok && response.data && response.data.dictionary) {
        const feedData = response.data
        const normalized = normalizeFeedData(feedData)
        const { questions, answers } = normalized
        const mostRecentQuestions = Object.values(questions).sort((a, b) => {
          const first = new Date(a.creationDate)
          const second = new Date(b.creationDate)
          if (first > second) {return -1}
          if (first < second) {return 1}
          return 0
        })
        const notificationsFallback = normalizeNotificationFallback(mostRecentQuestions)
        dispatch(setNotificationsFallbackAction({ questions, answers, notifications: notificationsFallback }))
      }
    }

    // Set loading state false
    await dispatch(homeSocialLoadingAction(false))
    logger.info(`Social tab fetched in ${new Date().getTime() - start} ms`)
  }
