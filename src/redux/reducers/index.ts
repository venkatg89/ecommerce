import { combineReducers } from 'redux'

import atg, { ATGState } from './ATGReducer'
import browse, { BrowseState } from './BrowseReducer'
import bopis, { BopisState } from './BopisReducer'
import cafe, { CafeState } from './CafeReducer'
import form, { FormState } from './FormReducer'
import listings, { ListingsState } from './ListingsReducer'
import milq, { MilqState } from './MilqReducer'
import nodeJs, { NodeJsState } from './NodeJsReducer'
import pdp, { PdpState } from './PdpReducer'
import speedetab, { SpeedeTabState } from './SpeedetabReducer'
import user, { UserState } from './UserReducer'
import users, { MembersState as UsersState } from './UsersReducer'
import theme, { ThemeState } from './ThemeReducer'
import widgets, { WidgetsState } from './WidgetsReducer'
import communities, { CommunitiesState } from './CommunitiesReducer'
import tooltipsStatus, { TooltipsState } from './TooltipsStatusReducer'
import _legacybooks, {
  BooksState as _LegacyBooksState,
} from './LegacyBookReducer'
import stores, { StoreState } from './StoreReducer'
import _legacyHome, { HomeState as _LegacyHomeState } from './LegacyHomeReducer'
import storeGateway, { StoreGatewayState } from './StoreGatewayReducer'
import books, { BooksState } from './BooksReducer'
import shop, { ShopState } from './ShopReducer'
import wishLists, { WishListsState } from './WishListsReducer'
import saveForLaterList, {
  SaveForLaterListState,
} from './SaveForLaterListReducer'
import accountOrders, { OrderHistoryState } from './OrderHistoryReducer'
import guestInfo from './GuestReducer'
import home, { HomeState } from './HomeReducer'

import { USER_LOGGED_OUT } from 'src/redux/actions/login/logoutAction'
import Logger from 'src/helpers/logger'
import { GuestInfoState } from './GuestReducer'

const logger = Logger.getInstance()

export interface State {
  atg: ATGState
  browse: BrowseState
  bopis: BopisState
  cafe: CafeState
  books: BooksState
  _legacybooks: _LegacyBooksState
  _legacyHome: _LegacyHomeState
  communities: CommunitiesState
  form: FormState
  home: HomeState
  listings: ListingsState
  milq: MilqState
  nodeJs: NodeJsState
  pdp: PdpState
  speedetab: SpeedeTabState
  theme: ThemeState
  tooltipsStatus: TooltipsState
  user: UserState
  users: UsersState
  widgets: WidgetsState
  stores: StoreState
  shop: ShopState
  storeGateway: StoreGatewayState
  wishLists: WishListsState
  accountOrders: OrderHistoryState
  saveForLaterList: SaveForLaterListState
  guestInfo: GuestInfoState
}

const appReducer = combineReducers<State>({
  atg,
  browse,
  bopis,
  cafe,
  books,
  _legacybooks,
  _legacyHome,
  communities,
  form,
  home,
  listings,
  milq,
  nodeJs,
  pdp,
  speedetab,
  theme,
  tooltipsStatus,
  user,
  users,
  widgets,
  shop,
  stores,
  storeGateway,
  wishLists,
  saveForLaterList,
  accountOrders,
  guestInfo,
})

export default (state: State, action): State => {
  const payloadLog =
    typeof action.payload !== 'undefined'
      ? `, payload ${typeof action.payload}, keys: {${Object.keys(
          action.payload || {},
        )}}`
      : ''
  logger.info(`action: ${action.type}${payloadLog}`, false)

  if (action.type === USER_LOGGED_OUT || action.type === '!reset') {
    // Do a full redux state reset on logout
    // Reducers are able to translate undefined into the DEFAULT states for all.
    logger.info('Resetting all Redux state...')
    return appReducer((undefined as unknown) as State, action)
  }

  return appReducer(state, action)
}
