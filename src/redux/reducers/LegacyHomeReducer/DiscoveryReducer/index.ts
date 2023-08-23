import { combineReducers } from 'redux'
import cards, { DiscoveryCardModel } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'

export interface DiscoveryState {
  cards: DiscoveryCardModel[]
}

export default combineReducers<DiscoveryState>({
  cards,
})
