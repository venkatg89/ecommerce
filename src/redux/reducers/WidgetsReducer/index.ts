import { combineReducers } from 'redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer } from 'redux-persist'

import activeGlobalModal, { ActiveGlobalModalState } from './ActiveGlobalModalReducer'
import secretQuestions, { SecretQuestionsState } from './SecretQuestionsReducer'
import selectedPaymentCardId, { SelectedPaymentCardIdState } from './SelectedPaymentCardIdReducer'
import loginInProgress, { UILoginInProgressState } from './UILoginInProgressReducer'
import cartItemCount, { CartItemCountState } from './CartItemCount'

export interface WidgetsState {
  activeGlobalModal: ActiveGlobalModalState
  cartItemCount: CartItemCountState
  secretQuestions: SecretQuestionsState
  selectedPaymentCardId: SelectedPaymentCardIdState
  loginInProgress: UILoginInProgressState
}

const widgetReducer = combineReducers<WidgetsState>({
  activeGlobalModal,
  cartItemCount,
  secretQuestions,
  selectedPaymentCardId,
  loginInProgress,
})

const widgetPersistConfig = {
  key: 'widgets',
  storage: AsyncStorage,
  blacklist: ['activeGlobalModal'],
}

export default persistReducer(widgetPersistConfig, widgetReducer)
