import makeActionCreator from 'src/helpers/redux/makeActionCreator'

import { milqGetFavoriteCategories,
  milqSetMyFavoriteCategories,
  normalizeMilqFavoriteCommunitiesResponse,
  milqFollowCategory,
} from 'src/endpoints/milq/communities/categories'

import { getMyProfileUidSelector, myInterestCommunityIds } from 'src/redux/selectors/userSelector'
import { MembersStatePayload } from 'src/redux/reducers/UsersReducer'
import { State } from 'src/redux/reducers'
import { checkIsUserLoggedOutToBreakAction } from 'src/redux/actions/modals/guestUser'
import { addEventAction } from 'src/redux/actions/localytics'

// legacy
import { makeApiActions } from 'src/helpers/redux/makeApiActions'
import actionApiCall from 'src/helpers/redux/actionApiCall'
import { ensureNoCallInProgress } from 'src/helpers/redux/checkApiCallState'
import { fetchHomeContentAction } from '../../legacyHome/fetchHomeContentAction'
import { homeDiscoveryClearContentSourceAction } from '../../legacyHome/discoveryActions'
//

export const SET_MY_FAVORITE_CATEGORIES = 'MY_USER__FAVORITE_CATEGORIES_SET'
export const SET_USERS_FAVORITE_CATEGORIES = 'USERS__FAVORITE_CATEGORIES_SET'

const setMyFavoriteCategoriesAction = makeActionCreator<number[]>(SET_MY_FAVORITE_CATEGORIES)
const setUsersFavoriteCategoriesProfileAction = makeActionCreator<MembersStatePayload>(SET_USERS_FAVORITE_CATEGORIES)

const ONBOARDING_SELECTED_FAVORITE_CATEGORIES = 'onbaording_selected_favorite_categories'
const ONBOARDING_TOTAL_NUMBER_OF_FAVORITE_CATEGORIES = 'onboarding total number of favorite categories'

export const fetchFavoriteCommunitiesAction: (uid?: string) => ThunkedAction<State> =
  uid => async (dispatch, getState) => {
    const state = getState()
    if (uid) {
      const response = await milqGetFavoriteCategories(uid)
      if (response.ok) {
        const favoriteCategories = normalizeMilqFavoriteCommunitiesResponse(response.data)
        await dispatch(setUsersFavoriteCategoriesProfileAction({ uid, community: { favoriteCategories } }))
      }
    } else {
      const myUid = getMyProfileUidSelector(state)
      if (!myUid) { return } // not logged in
      const response = await milqGetFavoriteCategories(myUid)
      if (response.ok) {
        await dispatch(setMyFavoriteCategoriesAction(normalizeMilqFavoriteCommunitiesResponse(response.data)))
      }
    }
  }

// legacy
export const myFavoriteCommunitiesApiActions = makeApiActions(
  'milqMyFavoriteCommunities', 'USER__FAVORITES_COMMUNITIES',
)

export const setMyFavoriteCommunitiesAction = makeActionCreator<number[]>(SET_MY_FAVORITE_CATEGORIES)

// In Progress calls checker
const ensureNoOtherCallToMyCommunities = (state: State) => ensureNoCallInProgress(
  myFavoriteCommunitiesApiActions.debugName, state.milq.api.myFavoriteCommunities,
)

export const fetchMyFavoriteCommunitiesAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const state = getState()
    if (ensureNoOtherCallToMyCommunities(state)) {
      const uid = getMyProfileUidSelector(state)
      const response = await actionApiCall(dispatch,
        myFavoriteCommunitiesApiActions, () => milqGetFavoriteCategories(uid))
      if (response.ok) {
        await dispatch(setMyFavoriteCommunitiesAction(normalizeMilqFavoriteCommunitiesResponse(response.data)))
      }
    }
  }

export const updateMyFavoriteCommunitiesAction:
  (newCommunityIdList: number[]) => ThunkedAction<State> = newCommunityIdList => async (dispatch, getState) => {
    const state = getState()
    if (ensureNoOtherCallToMyCommunities(state)) {
      const uid = getMyProfileUidSelector(state)
      const response = await actionApiCall(dispatch,
        myFavoriteCommunitiesApiActions, async () => {
          const addResponse = await milqSetMyFavoriteCategories(newCommunityIdList)
          if (!addResponse.ok) {
            return addResponse
          }
          const finalGetResponse = await milqGetFavoriteCategories(uid)
          return finalGetResponse
        })
      if (response.ok) {
        // since these are done on separate screens, there is no need for await as this messes up myFavoriteCommunitiesApiActions timing
        Promise.all([
          dispatch(setMyFavoriteCommunitiesAction(normalizeMilqFavoriteCommunitiesResponse(response.data))),
          dispatch(homeDiscoveryClearContentSourceAction()),
          dispatch(fetchHomeContentAction()),
        ])
      }
    }
  }


export const setFavoriteCategoriesActions: (communityIds: number[]) => ThunkedAction<State>
  = communityIds => async (dispatch, getState) => {
    const state = getState()
    const promiseArray = communityIds.map(id => dispatch(addEventAction(ONBOARDING_SELECTED_FAVORITE_CATEGORIES, { categories: id })))
    promiseArray.push(dispatch(addEventAction(ONBOARDING_TOTAL_NUMBER_OF_FAVORITE_CATEGORIES, { total: communityIds.length })))
    await Promise.all(promiseArray)
    const currentUid = getMyProfileUidSelector(state)
    if (currentUid) {
      await dispatch(updateMyFavoriteCommunitiesAction(communityIds))
    } else {
      await dispatch(setMyFavoriteCommunitiesAction(communityIds))
    }
  }

export const followCommunityApiActions = makeApiActions('followCommunity', 'FOLLOW_COMMUNITY')


export const followCommunityAction: (categoryId: string) => ThunkedAction<State>
    = categoryId => async (dispatch, getState) => {
      if (dispatch(checkIsUserLoggedOutToBreakAction())) {return}
      const state: State = getState()
      const favorites = myInterestCommunityIds(state)
      const following = favorites.includes(Number(categoryId))
      const method = following ? 'DELETE' : 'POST'
      try {
        const response = await actionApiCall(dispatch,
          followCommunityApiActions, () => milqFollowCategory(categoryId, method))
        if (response.ok) {
          await fetchMyFavoriteCommunitiesAction()(dispatch, getState)
        }
      } catch (error) {
        /* */
      }
    }
