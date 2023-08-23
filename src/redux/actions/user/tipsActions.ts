import { State } from 'src/redux/reducers'
import { TIP_TYPE } from 'src/redux/reducers/UserReducer/TipsReducer/index'
import makeActionCreator from 'src/helpers/redux/makeActionCreator'
import { UserTip } from 'src/redux/actions/legacyHome/discoveryActions'

export const USER_TIP_DISMISSED = 'MY_USER__TIP_DISMISSED'
export const USER_TIP_ACCEPTED = 'MY_USER__TIP_ACCEPTED'
export const USER_RESET_TIPS = 'MY_USER__RESET_TIPS'
export const USER_SET_TIPS_OPTIONS = 'MY_USER__SET_TIPS_OPTIONS'

const userTipDismissedAction = makeActionCreator(USER_TIP_DISMISSED)
const userTipAcceptedAction = makeActionCreator(USER_TIP_ACCEPTED)
const resetUserTipsAction = makeActionCreator(USER_RESET_TIPS)
const userSetTipsOptions = makeActionCreator(USER_SET_TIPS_OPTIONS)

export const dismissTipAction: (tip: TIP_TYPE) => ThunkedAction<State> =
  tip => async (dispatch, getState) => {
    await dispatch(userTipDismissedAction(tip))
  }

export const acceptTipAction: (tip: TIP_TYPE) => ThunkedAction<State> =
  tip => async (dispatch, getState) => {
    await dispatch(userTipAcceptedAction(tip))
  }

export const resetTipsAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const userTip = new UserTip().setState(getState())
    const tips = Object.keys(TIP_TYPE)
      .map(item => TIP_TYPE[item])
      .reduce((acc, val) => {
        if (userTip.setTip(val).canReset()) {
          acc.push(val)
        }

        return acc
      }, [])

    if (tips.length) {
      await dispatch(resetUserTipsAction(tips))
    }
  }

export const resetTipAction: (tip: TIP_TYPE) => ThunkedAction<State> =
  tip => async (dispatch, getState) => {
    await dispatch(resetUserTipsAction([tip]))
  }

export const setTipsOptions: (options: object) => ThunkedAction<State> =
  options => async (dispatch, getState) => {
    await dispatch(userSetTipsOptions(options))
  }
