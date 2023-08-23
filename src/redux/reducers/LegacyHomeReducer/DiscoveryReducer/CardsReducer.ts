import { AnyAction } from 'redux'
import {
  HOME_DISCOVERY_INSERT_USER_TIPS,
  HOME_DISCOVERY_MARK_CARD_AS_VIEWED,
  HOME_DISCOVERY_UPDATE_CARD,
  HOME_DISCOVERY_REMOVE_CARD,
  HOME_DISCOVERY_ORDER_CARDS,
  HOME_DISCOVERY_CLEAR_CARDS_CONTENT,
  HOME_DISCOVERY_CARD_FILTER_BOOK,
  HOME_DISCOVERY_CLEAR_USER_TIPS,
  HOME_DISCOVERY_CARD_RESTORE_BOOKS,
} from 'src/redux/actions/legacyHome/discoveryActions'
import { SET_HOME_DISCOVERY_LOADING_ACTION } from 'src/redux/actions/legacyHome/loadingAction'
import { TipConfig } from 'src/redux/reducers/UserReducer/TipsReducer'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export enum CardTypes {
  FEATURED_CAROUSEL = 'FEATURED_CAROUSEL',
  USER_TIP = 'USER_TIP',
  TOP_3_LIST = 'TOP_3_LIST',
  PRODUCT_CAROUSEL = 'PRODUCT_CAROUSEL',
  PRODUCT_GRID = 'PRODUCT_GRID',
  QUESTION_OF_THE_DAY='QUESTION_OF_THE_DAY'
}

export enum CardIds {
  FEATURED_RECOMMENDATIONS = 'FEATURED_RECOMMENDATIONS',
  TOP_3_NEW_RELEASES_BY_CATEGORY = 'TOP_3_NEW_RELEASES_BY_CATEGORY',
  TOP_3_BESTSELLERS_BY_CATEGORY = 'TOP_3_BESTSELLERS_BY_CATEGORY',
  TOP_3_RECOMMENDATIONS_BY_BOOK = 'TOP_3_RECOMMENDATIONS_BY_BOOK',
  PRODUCT_CAROUSEL_COMING_SOON_BY_CATEGORY = 'PRODUCT_CAROUSEL_COMING_SOON_BY_CATEGORY',
  PRODUCT_CAROUSEL_BESTSELLERS_OVERALL = 'PRODUCT_CAROUSEL_BESTSELLERS_OVERALL',
  PRODUCT_GRID_NEW_RELEASES_OVERALL = 'PRODUCT_GRID_NEW_RELEASES_OVERALL',
  PRODUCT_GRID_COMING_SOON_OVERALL = 'PRODUCT_GRID_COMING_SOON_OVERALL',
  QUESTION_OF_THE_DAY = 'QUESTION_OF_THE_DAY',
}

export interface DiscoveryCardModel {
  id: string,
  pinned: boolean,
  type: CardTypes,
  title: string,
  content: any,
  timestamp: Timestamp|null,
  isLoading: boolean
}

const buildCard = card => ({
  id: '',
  pinned: false,
  type: CardTypes.TOP_3_LIST,
  title: '',
  content: [],
  timestamp: null,
  isLoading: true,
  ...card,
})

const DEFAULT: DiscoveryCardModel[] = [
  buildCard({
    id: CardIds.FEATURED_RECOMMENDATIONS,
    pinned: true,
    type: CardTypes.FEATURED_CAROUSEL,
    title: 'Featured Recommendations',
  }),
  buildCard({
    id: CardIds.TOP_3_NEW_RELEASES_BY_CATEGORY,
    type: CardTypes.TOP_3_LIST,
    title: 'New Releases by interest',
  }),
  buildCard({
    id: CardIds.TOP_3_BESTSELLERS_BY_CATEGORY,
    type: CardTypes.TOP_3_LIST,
    title: 'Bestsellers by interest',
  }),
  buildCard({
    id: CardIds.TOP_3_RECOMMENDATIONS_BY_BOOK,
    type: CardTypes.TOP_3_LIST,
    title: 'Recommended books',
  }),
  buildCard({
    id: CardIds.PRODUCT_CAROUSEL_COMING_SOON_BY_CATEGORY,
    type: CardTypes.PRODUCT_CAROUSEL,
    title: 'Coming Soon by interest',
  }),
  buildCard({
    id: CardIds.PRODUCT_CAROUSEL_BESTSELLERS_OVERALL,
    type: CardTypes.PRODUCT_CAROUSEL,
    title: 'Bestsellers',
  }),
  buildCard({
    id: CardIds.PRODUCT_GRID_NEW_RELEASES_OVERALL,
    type: CardTypes.PRODUCT_GRID,
    title: 'New Releases',
  }),
  buildCard({
    id: CardIds.PRODUCT_GRID_COMING_SOON_OVERALL,
    type: CardTypes.PRODUCT_GRID,
    title: 'Coming Soon',
  }),
  buildCard({
    id: CardIds.QUESTION_OF_THE_DAY,
    type: CardTypes.QUESTION_OF_THE_DAY,
    title: 'Question of the day',
  }),
]

export default (state: DiscoveryCardModel[] = DEFAULT, action: AnyAction): DiscoveryCardModel[] => {
  switch (action.type) {
    case HOME_DISCOVERY_INSERT_USER_TIPS: {
      // First existing tips out first
      const stateNoTips = state.filter(item => item.type !== CardTypes.USER_TIP)

      const viewableCards = stateNoTips.filter(item => item.type !== CardTypes.USER_TIP && (item.content.length || Object.keys(item.content).length))
      const maxAllowedTips = Math.floor(viewableCards.length / action.payload.length)
      const tips = action.payload.slice(0, maxAllowedTips)
      if (!tips.length) {
        return state // No cards - keep the previous tips
      }

      const newState = stateNoTips.slice()
      const viewableCardsIndexes = viewableCards.reduce((acc, val, idx) => {
        if ((idx + 1) % TipConfig.INSERT_POSITION === 0) {
          const index = stateNoTips.findIndex(item => item.id === val.id)
          if (index !== -1) {
            acc.push(index)
          }
        }
        return acc
      }, [] as number[])

      let increment = 1
      tips.map((tip) => {
        const idx = viewableCardsIndexes.length && viewableCardsIndexes.shift()
        if (idx) {
          newState.splice((idx + increment), 0, buildCard({
            type: CardTypes.USER_TIP,
            content: tip,
            isLoading: false,
            id: tip,
          }))
          increment += 1
        }
        return tip
      })

      return newState
    }

    case HOME_DISCOVERY_UPDATE_CARD:
      return [
        ...state.map(card => ((card.id === action.payload.id) ?
          {
            ...card,
            isLoading: false,
            ...action.payload,
          }
          : card)),

      ]

    case HOME_DISCOVERY_MARK_CARD_AS_VIEWED:
      return state.map((item) => {
        let result = item
        if (item.id === action.payload) {
          result = {
            ...result,
            timestamp: new Date().getTime(),
          }
        }

        return result
      })

    case HOME_DISCOVERY_REMOVE_CARD:
      return state.filter(item => item.id !== action.payload)

    case HOME_DISCOVERY_ORDER_CARDS:
      return [
        // pinned
        ...state.filter(item => item.pinned),
        // not viewed
        ...state.filter(item => !item.pinned && !item.timestamp),
        // viewed ordered ascending by timestamp
        ...state
          .filter(item => !item.pinned && item.timestamp)
          .sort((a, b) => Number(a.timestamp) - Number(b.timestamp)),
      ]

    case HOME_DISCOVERY_CARD_FILTER_BOOK:
      return [
        ...state.map(card => ((card.id === action.payload.id) ?
          {
            ...card,
            content: card.content.filter(book => book.ean !== action.payload.ean),
          }
          : card)),

      ]

    case HOME_DISCOVERY_CARD_RESTORE_BOOKS: {
      return [
        ...state.map(card => ((card.id === action.payload.id) ?
          {
            ...card,
            content: [...new Set(card.content.concat(action.payload.books))],
          } :
          card
        )),
      ]
    }

    case HOME_DISCOVERY_CLEAR_CARDS_CONTENT:
      return state.map(item => ({
        ...item,
        content: [],
      }))

    case HOME_DISCOVERY_CLEAR_USER_TIPS:
      return state.filter(item => item.type !== CardTypes.USER_TIP)

    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    case SET_HOME_DISCOVERY_LOADING_ACTION:
      return state.map(item => ({
        ...item,
        isLoading: Boolean(action.payload),
      }))

    default:
      return state
  }
}
