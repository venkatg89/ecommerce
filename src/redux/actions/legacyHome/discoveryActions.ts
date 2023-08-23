import moment from 'moment'
import { State } from 'src/redux/reducers'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { TIP_TYPE, TipConfig } from 'src/redux/reducers/UserReducer/TipsReducer/index'
import {
  isUserTipAvailableSelector,
  getUserTipSelector,
  countSessionsSelector,
  firstLoginDateSelector,
  getAppReviewSelector,
  isUserLoggedInSelector,
  myFollowedUserIdsSelector,
  getUserTipOptions,
} from 'src/redux/selectors/userSelector'
// import { favoriteStoreIdsSelector } from 'src/redux/selectors/myBn/storeSelector'
import { resetTipsAction } from 'src/redux/actions/user/tipsActions'
import {
  getReadingListBooksSelector,
  getMostRecentReadingBookDateSelector,
  getReadBooksAfterDate,
  getRandomInterest,
  getRandomReadBook,
} from 'src/redux/selectors/myBooks/booksSelector'
import { ReadingStatus } from 'src/models/ReadingStatusModel'
import { recentOrdersSelector } from 'src/redux/selectors/cafeSelector'
import { fetchRecentOrdersAction } from 'src/redux/actions/cafe/orderAction'
import { featuredRecommendationsCarouselReadBooksAction } from './featuredRecommendationsCarouselReadBooksAction'
import { top3NewReleasesByCategoryAction } from './top3NewReleasesByCategoryAction'
import { top3BestsellersByCategoryAction } from './top3BestsellersByCategoryAction'
import { top3RecommendationsByBookAction } from './top3RecommendationsByBookAction'
import { productCarouselComingSoonByCategoryAction } from './productCarouselComingSoonByCategoryAction'
import { productCarouselBestsellersOverallAction } from './productCarouselBestsellersOverallAction'
import { productGridNewReleasesOverallAction } from './productGridNewReleasesOverallAction'
import { productGridComingSoonOverallAction } from './productGridComingSoonOverallAction'
import { questionOfTheDayAction } from './questionOfTheDayAction'

const packageJson = require('../../../../package.json')

export const HOME_DISCOVERY_INSERT_USER_TIPS = 'HOME__DISCOVERY_INSERT_USER_TIPS'
export const HOME_DISCOVERY_UPDATE_CARD = 'HOME__DISCOVERY_UPDATE_CARD'
export const HOME_DISCOVERY_MARK_CARD_AS_VIEWED = 'HOME__DISCOVERY_MARK_CARD_AS_VIEWED'
export const HOME_DISCOVERY_REMOVE_CARD = 'HOME__DISCOVERY_REMOVE_CARD'
export const HOME_DISCOVERY_ORDER_CARDS = 'HOME__DISCOVERY_ORDER_CARDS'
export const HOME_DISCOVERY_CLEAR_CARDS_CONTENT = 'HOME__DISCOVERY_CLEAR_CARDS_BOOKS'
export const HOME_DISCOVERY_CLEAR_USER_TIPS = 'HOME__DISCOVERY_CLEAR_USER_TIPS'
export const HOME_DISCOVERY_CLEAR_CONTENT_SOURCE = 'HOME__DISCOVERY_CLEAR_CONTENT_SOURCE'
export const HOME_DISCOVERY_CARD_FILTER_BOOK = 'HOME__DISCOVERY_CARD_FILTER_BOOK'
export const HOME_DISCOVERY_CARD_RESTORE_BOOKS = 'HOME__DISCOVERY_CARD_RESTORE_BOOKS'

export const homeDiscoveryInsertUserTipsAction = makeActionCreator<Object>(HOME_DISCOVERY_INSERT_USER_TIPS)
export const homeDiscoveryUpdateCardAction = makeActionCreator<Object>(HOME_DISCOVERY_UPDATE_CARD)
export const homeDiscoveryMarkCardAsViewedAction = makeActionCreator<Object>(HOME_DISCOVERY_MARK_CARD_AS_VIEWED)
export const homeDiscoveryRemoveCardAction = makeActionCreator<Object>(HOME_DISCOVERY_REMOVE_CARD)
export const homeDiscoveryOrderCardsAction = makeActionCreator<Object>(HOME_DISCOVERY_ORDER_CARDS)
export const homeDiscoveryClearCardsContentAction = makeActionCreator<Object>(HOME_DISCOVERY_CLEAR_CARDS_CONTENT)
export const homeDiscoveryClearUserTipsAction = makeActionCreator<Object>(HOME_DISCOVERY_CLEAR_USER_TIPS)
export const homeDiscoveryClearContentSourceAction = makeActionCreator<Object>(HOME_DISCOVERY_CLEAR_CONTENT_SOURCE)
export const homeDiscoveryCardFilterBookAction = makeActionCreator<Object>(HOME_DISCOVERY_CARD_FILTER_BOOK)
export const homeDiscoveryCardRestoreBooksAction = makeActionCreator<Object>(HOME_DISCOVERY_CARD_RESTORE_BOOKS)

export class UserTip {
  private tip: string = '';

  private validTipList: Set<string> = new Set([]);

  private state: object = {};

  private types: string[];

  private validationMethods: Record<string, string>

  private resetMethods: Record<string, string>

  constructor() {
    this.types = Object.keys(TIP_TYPE).map(item => TIP_TYPE[item])
    this.validationMethods = this.types.reduce((acc, val) => ({
      ...(acc || {}),
      [val]: `validate${this.camelize(val)}`,
    }), {})
    this.resetMethods = this.types.reduce((acc, val) => ({
      ...(acc || {}),
      [val]: `reset${this.camelize(val)}`,
    }), {})

    return this
  }

  setValidTipList = (list: string[]) => {
    this.validTipList = new Set(list)
    return this
  }

  setTip = (tip) => {
    this.tip = tip
    return this
  }

  setState = (state) => {
    this.state = state
    return this
  }

  camelize = text => ` ${text}`.toLowerCase().replace(/[^a-zA-Z]+(.)/g, (match, chr) => chr.toUpperCase())

  isValid = () => {
    const method = this.validationMethods[this.tip]
    if (isUserTipAvailableSelector(this.state, this.tip) && method && this[method]) {
      return this[method]()
    }

    return false
  }

  canReset = () => {
    const method = this.resetMethods[this.tip]
    if (method && this[method]) {
      return this[method]()
    }

    return false
  }

  validateTipAvailableFrom = () => {
    const tip = getUserTipSelector(this.state, this.tip)
    if (!tip || !tip.availableFrom) {
      return false
    }

    return new Date() >= new Date(tip.availableFrom)
  }

  validateEverySessionCriteria = (coefficient) => {
    const countSessions = countSessionsSelector(this.state)

    return countSessions && (countSessions % coefficient === 0)
  }

  validateAddToFinishedList = () => {
    const addToFinishedConfig = TipConfig[TIP_TYPE.ADD_TO_FINISHED_LIST]
    const _getReadingListBooksSelector = getReadingListBooksSelector()
    const readBooks = _getReadingListBooksSelector(this.state as State, { status: ReadingStatus.FINISHED })
    const countReadBooks = Object.keys(readBooks).length
    if (!countReadBooks || countReadBooks < addToFinishedConfig.MAX_READ_BOOKS) {
      return true
    }
    const book = readBooks['']
    if (book && moment().diff(moment(book.changeDate), 'days') >= addToFinishedConfig.MIN_DAYS_SINCE_LAST_READ_BOOK) {
      return true
    }

    return false
  }

  resetAddToFinishedList = () => this.validateTipAvailableFrom()

  validateAskQuestions = () => {
    if (!isUserLoggedInSelector(this.state as State) || this.validTipList.has(TIP_TYPE.ANSWER_QUESTIONS)) {
      return false
    }

    const askQuestionsConfig = TipConfig[TIP_TYPE.ASK_QUESTIONS]
    const _getMostRecentReadingBookDateSelector = getMostRecentReadingBookDateSelector()
    const lastReadingDate = _getMostRecentReadingBookDateSelector(this.state as State) || firstLoginDateSelector(this.state)
    const criteria = {
      date: (lastReadingDate && moment().diff(moment(lastReadingDate), 'days') >= askQuestionsConfig.MIN_DAYS_SINCE_LAST_READING_BOOK),
      sessions: this.validateEverySessionCriteria(askQuestionsConfig.EVERY_SESSION_COEFFICIENT),
    }

    return (criteria.date && criteria.sessions)
  }

  resetAskQuestions = () => {
    if (!isUserLoggedInSelector(this.state as State)) {
      return false
    }

    const askQuestionsConfig = TipConfig[TIP_TYPE.ASK_QUESTIONS]
    const tip = getUserTipSelector(this.state, this.tip)
    if (tip) {
      const tipDate = new Date(tip.acceptedAt || tip.rejectedAt)
      const _getMostRecentReadingBookDateSelector = getMostRecentReadingBookDateSelector()
      const lastReadingDate = _getMostRecentReadingBookDateSelector(this.state as State)
      const readingBeforeTip = !lastReadingDate || (new Date(lastReadingDate) < tipDate)
      const dateCriteria = moment().diff(moment(tipDate), 'days') >= askQuestionsConfig.MIN_DAYS_SINCE_LAST_READING_BOOK

      return (readingBeforeTip && dateCriteria)
    }

    return false
  }

  validateAnswerQuestions = () => {
    if (!isUserLoggedInSelector(this.state as State) || this.validTipList.has(TIP_TYPE.ASK_QUESTIONS)) {
      return false
    }

    if (getUserTipOptions(this.state as State, 'hasAnswerOuestions') === false) {
      return false
    }

    const answerQuestionsConfig = TipConfig[TIP_TYPE.ANSWER_QUESTIONS]
    if (this.validateEverySessionCriteria(answerQuestionsConfig.EVERY_SESSION_COEFFICIENT)) {
      return true
    }

    return false
  }

  resetAnswerQuestions = () => {
    const tip = getUserTipSelector(this.state, this.tip)
    if (!isUserLoggedInSelector(this.state as State) || !this.validateTipAvailableFrom() || !tip) {
      return false
    }

    const answerQuestionsConfig = TipConfig[TIP_TYPE.ANSWER_QUESTIONS]
    const _getReadBooksAfterDate = getReadBooksAfterDate()
    const readBooks = _getReadBooksAfterDate(this.state as State, { date: new Date(tip.acceptedAt || tip.rejectedAt) })
    if (readBooks.length >= answerQuestionsConfig.MIN_READ_BOOKS) {
      return true
    }

    return false
  }

  validateAddToReadingList = () => {
    if (!isUserLoggedInSelector(this.state as State)) {
      return false
    }

    const addToReadingConfig = TipConfig[TIP_TYPE.ADD_TO_READING_LIST]
    const _getMostRecentReadingBookDateSelector = getMostRecentReadingBookDateSelector()
    const lastReadingDate = _getMostRecentReadingBookDateSelector(this.state as State) || firstLoginDateSelector(this.state)
    const criteria = {
      date: (lastReadingDate && moment().diff(moment(lastReadingDate), 'days') >= addToReadingConfig.MIN_DAYS_SINCE_LAST_READING_BOOK),
      sessions: this.validateEverySessionCriteria(addToReadingConfig.EVERY_SESSION_COEFFICIENT),
    }

    return (criteria.date && criteria.sessions)
  }

  resetAddToReadingList = () => isUserLoggedInSelector(this.state as State) && this.validateTipAvailableFrom()

  validateFindFriends = () => {
    if (!isUserLoggedInSelector(this.state as State)) {
      return false
    }

    const findFriendsConfig = TipConfig[TIP_TYPE.FIND_FRIENDS]
    const followedUsers = myFollowedUserIdsSelector(this.state).length
    const criteria = {
      followedUsers: followedUsers < findFriendsConfig.MAX_FOLLOWED_USERS,
      sessions: this.validateEverySessionCriteria(findFriendsConfig.EVERY_SESSION_COEFFICIENT),
    }

    return (criteria.followedUsers && criteria.sessions)
  }

  resetFindFriends = () => isUserLoggedInSelector(this.state as State) && this.validateTipAvailableFrom()

  // validateChooseStore = () => {
  //   if (!isUserLoggedInSelector(this.state as State)) {
  //     return false
  //   }
  //
  //   const chooseStoreConfig = TipConfig[TIP_TYPE.CHOOSE_STORE]
  //   return !favoriteStoreIdsSelector(this.state) && this.validateEverySessionCriteria(chooseStoreConfig.EVERY_SESSION_COEFFICIENT)
  // }

  resetChooseStore = () => false // handled on cafe order event

  validateReviewApp = () => {
    const reviewAppConfig = TipConfig[TIP_TYPE.REVIEW_APP]
    if (getAppReviewSelector(this.state)) {
      return false
    }

    if (countSessionsSelector(this.state) < reviewAppConfig.MIN_SESSIONS) {
      return false
    }

    const firstLoginDate = firstLoginDateSelector(this.state)
    if (!firstLoginDate || moment().diff(moment(firstLoginDate), 'days') < reviewAppConfig.MIN_DAYS_FROM_FIRST_LOGIN) {
      return false
    }

    return true
  }

  resetReviewApp = () => {
    const tip = getUserTipSelector(this.state, this.tip)
    const appReview = getAppReviewSelector(this.state)
    if (!tip || !appReview) {
      return false
    }

    return parseInt(appReview.forVersion, 10) < parseInt(packageJson.version, 10)
  }

  validateOrderFromCafe = () => {
    if (!isUserLoggedInSelector(this.state as State)) {
      return false
    }

    return !Object.keys(recentOrdersSelector(this.state) || {}).length
  }

  resetOrderFromCafe = () => isUserLoggedInSelector(this.state as State) && this.validateTipAvailableFrom()
}

export const homeDiscoveryGenerateUserTips: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    await Promise.all([
      dispatch(homeDiscoveryClearUserTipsAction()),
      !Object.keys(recentOrdersSelector(getState()) || {}).length ? dispatch(fetchRecentOrdersAction()) : Promise.resolve(),
      dispatch(resetTipsAction()),
    ])

    const userTip = new UserTip().setState(getState())
    const tips = Object.keys(TIP_TYPE)
      .map(item => TIP_TYPE[item])
      .reduce((acc, val) => {
        if (acc.length < TipConfig.ALLOWED_TIPS_PER_SESSION && userTip.setTip(val).setValidTipList(acc).isValid()) {
          acc.push(val)
        }

        return acc
      }, [])

    if (tips.length) {
      await dispatch(homeDiscoveryInsertUserTipsAction(tips))
    }
  }


export const homeDiscoveryAddCards: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    let promises = [
      {
        id: 1,
        promise: new Promise(async (resolve) => {
          await dispatch(featuredRecommendationsCarouselReadBooksAction())
          resolve(1)
        }),
      },
      {
        id: 2,
        promise: new Promise(async (resolve) => {
          await dispatch(top3NewReleasesByCategoryAction(getRandomInterest(state)))
          resolve(2)
        }),
      },
      {
        id: 3,
        promise: new Promise(async (resolve) => {
          await dispatch(top3BestsellersByCategoryAction(getRandomInterest(state)))
          resolve(3)
        }),
      },
      {
        id: 4,
        promise: new Promise(async (resolve) => {
          await dispatch(top3RecommendationsByBookAction(String(getRandomReadBook(state))))
          resolve(4)
        }),
      },
      {
        id: 5,
        promise: new Promise(async (resolve) => {
          await dispatch(productCarouselComingSoonByCategoryAction(getRandomInterest(state)))
          resolve(5)
        }),
      },
      {
        id: 6,
        promise: new Promise(async (resolve) => {
          await dispatch(productCarouselBestsellersOverallAction())
          resolve(6)
        }),
      },
      {
        id: 7,
        promise: new Promise(async (resolve) => {
          await dispatch(productGridNewReleasesOverallAction())
          resolve(7)
        }),
      },
      {
        id: 8,
        promise: new Promise(async (resolve) => {
          await dispatch(productGridComingSoonOverallAction())
          resolve(8)
        }),
      },
      {
        id: 9,
        promise: new Promise(async (resolve) => {
          await dispatch(questionOfTheDayAction())
          resolve(9)
        }),
      },
    ]

    for (let i = promises.length - 1; i >= 0; i--) {
    /* eslint-disable no-await-in-loop, no-loop-func */
      const race = await promises.map(item => item.promise)
      const res = await (race.length === 1 ? race[0] : Promise.race(race))
      promises = promises.filter(item => item.id !== res)
    /* eslint-enable no-await-in-loop, no-loop-func */
    }
  }
