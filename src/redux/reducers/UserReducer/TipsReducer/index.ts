import { AnyAction } from 'redux'
import moment from 'moment'
import {
  USER_TIP_DISMISSED,
  USER_TIP_ACCEPTED,
  USER_RESET_TIPS,
  USER_SET_TIPS_OPTIONS,
} from 'src/redux/actions/user/tipsActions'
import { USER_SESSION_ESTABLISHED, LoggedInPayload } from 'src/redux/actions/login/basicActionsPayloads'

export enum TIP_TYPE {
  REVIEW_APP = 'REVIEW_APP',
  ADD_TO_FINISHED_LIST = 'ADD_TO_FINISHED_LIST',
  ASK_QUESTIONS = 'ASK_QUESTIONS',
  ADD_TO_READING_LIST = 'ADD_TO_READING_LIST',
  FIND_FRIENDS = 'FIND_FRIENDS',
  CHOOSE_STORE = 'CHOOSE_STORE',
  ANSWER_QUESTIONS = 'ANSWER_QUESTIONS',
  ORDER_FROM_CAFE = 'ORDER_FROM_CAFE'
}

export const TipConfig = {
  ALLOWED_TIPS_PER_SESSION: 2,
  ALLOWED_DISMISSES: 2,
  DAYS_UNTIL_DISMISSED_AVAILABLE: 3,
  INSERT_POSITION: 3,
  [TIP_TYPE.REVIEW_APP]: {
    MIN_SESSIONS: 5,
    MIN_DAYS_FROM_FIRST_LOGIN: 7,
    RESET: null,
  },
  [TIP_TYPE.ADD_TO_FINISHED_LIST]: {
    MAX_READ_BOOKS: 6,
    MIN_DAYS_SINCE_LAST_READ_BOOK: 60,
    RESET: {
      VALUE: 60,
      UNIT: 'days',
    },
  },
  [TIP_TYPE.ASK_QUESTIONS]: {
    MIN_DAYS_SINCE_LAST_READING_BOOK: 7,
    EVERY_SESSION_COEFFICIENT: 4,
    RESET: {
      VALUE: 7,
      UNIT: 'days',
    },
  },
  [TIP_TYPE.ADD_TO_READING_LIST]: {
    MIN_DAYS_SINCE_LAST_READING_BOOK: 10,
    EVERY_SESSION_COEFFICIENT: 5,
    RESET: {
      VALUE: 30,
      UNIT: 'days',
    },
  },
  [TIP_TYPE.FIND_FRIENDS]: {
    MAX_FOLLOWED_USERS: 6,
    EVERY_SESSION_COEFFICIENT: 5,
    RESET: {
      VALUE: 30,
      UNIT: 'days',
    },
  },
  [TIP_TYPE.CHOOSE_STORE]: {
    EVERY_SESSION_COEFFICIENT: 4,
    RESET: null,
  },
  [TIP_TYPE.ANSWER_QUESTIONS]: {
    EVERY_SESSION_COEFFICIENT: 3,
    MIN_READ_BOOKS: 2,
    RESET: {
      VALUE: 14,
      UNIT: 'days',
    },
  },
  [TIP_TYPE.ORDER_FROM_CAFE]: {
    RESET: {
      VALUE: 60,
      UNIT: 'days',
    },
  },
}

const getTipAvailableFromDate = (type: TIP_TYPE) => {
  const tipConfig = TipConfig[type]
  if (!tipConfig || !tipConfig.RESET) {
    return null
  }

  return new Date(moment().add(tipConfig.RESET.VALUE, tipConfig.RESET.UNIT as moment.unitOfTime.DurationConstructor).toDate())
}

interface DismissedModel {
  type: TIP_TYPE;
  dismisses: {
    dismissedAt: Date;
    availableFrom: Date;
  }[]
}

interface AcceptedModel {
  type: TIP_TYPE;
  acceptedAt: Date;
  availableFrom: Nullable<Date>;
}

interface RejectedModel {
  type: TIP_TYPE;
  rejectedAt: Date;
  availableFrom: Nullable<Date>;
}

interface OptionsModel {
  hasAnswerQuestions: boolean;
}

export interface TipsState {
  dismissed: DismissedModel[];
  accepted: AcceptedModel[];
  rejected: RejectedModel[];
  options: OptionsModel;
}

const DEFAULT: TipsState = {
  dismissed: [],
  accepted: [],
  rejected: [],
  options: {
    hasAnswerQuestions: false,
  },
}

export default (state: TipsState = DEFAULT, action: AnyAction): TipsState => {
  switch (action.type) {
    case USER_TIP_DISMISSED: {
      const type = action.payload
      const tip: DismissedModel = state.dismissed.find(item => item.type === type) || {
        type,
        dismisses: [],
      }

      tip.dismisses.push({
        dismissedAt: new Date(),
        availableFrom: new Date(moment().add(TipConfig.DAYS_UNTIL_DISMISSED_AVAILABLE, 'days').toDate()),
      })

      if (tip.dismisses.length >= TipConfig.ALLOWED_DISMISSES) {
        return {
          ...state,
          dismissed: state.dismissed.filter(item => item.type !== type),
          rejected: [
            ...state.rejected.filter(item => item.type !== type),
            {
              type,
              rejectedAt: new Date(),
              availableFrom: getTipAvailableFromDate(type),
            },
          ],
        }
      }

      return {
        ...state,
        dismissed: [
          ...state.dismissed.filter(item => item.type !== action.payload),
          tip,
        ],
      }
    }

    case USER_TIP_ACCEPTED: {
      const type = action.payload
      return {
        ...state,
        accepted: [
          ...state.accepted.filter(item => item.type !== type),
          {
            type,
            acceptedAt: new Date(),
            availableFrom: getTipAvailableFromDate(type),
          },
        ],
      }
    }

    case USER_RESET_TIPS:
      return {
        ...state,
        accepted: state.accepted.filter(item => !action.payload.includes(item.type)),
        rejected: state.rejected.filter(item => !action.payload.includes(item.type)),
      }


    case USER_SESSION_ESTABLISHED:
      return (action.payload as LoggedInPayload).nodeJs ? DEFAULT : state

    case USER_SET_TIPS_OPTIONS:
      return {
        ...state,
        options: {
          ...state.options,
          ...(action.payload || {}),
        },
      }

    default:
      return state
  }
}
