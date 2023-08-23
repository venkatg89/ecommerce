import { Reducer } from 'redux'

import { SET_MEMBER_ACTION, SET_MEMBERS_ACTION } from 'src/redux/actions/communities/fetchMemberAction'
import { SET_USERS_PROFILE } from 'src/redux/actions/user/profileAction'
import { SET_USERS_FAVORITE_CATEGORIES } from 'src/redux/actions/user/community/favoriteCategoriesAction'
import { SET_SEARCH_RESULTS, SET_SEARCH_MORE_RESULTS } from 'src/redux/actions/legacySearch/searchResultsAction'
import { SET_USER_FOLLOWERS, SET_MORE_USER_FOLLOWERS } from 'src/redux/actions/user/community/followersAction'
import { SET_USER_FOLLOWING, SET_MORE_USER_FOLLOWING } from 'src/redux/actions/user/community/followingAction'
import { SET_MILQ_USER_NODE_PROFILE } from 'src/redux/actions/user/nodeProfileActions'
import { SET_NOTIFICATIONS_DATA } from 'src/redux/actions/legacyHome/social/notificationsActions'

import { MemberModel, MemberCommunityModel } from 'src/models/UserModel/MemberModel'
import { ProfileModel } from 'src/models/UserModel'
import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'
import { NookListItem, BookModel, Ean } from 'src/models/BookModel'

export interface MembersStatePayload {
  uid: string;
  profile?: ProfileModel;
  community?: MemberCommunityModel;
  nodeProfile?: NodeProfileModel;
  nookList?: NookListItem[]
  books?: Record<Ean, BookModel>
}

export type MembersState = Record<string, MemberModel>

const DEFAULT: MembersState = {}

const _users: Reducer<MembersState> = (state = DEFAULT, action) => {
  switch (action.type) {
    case SET_MILQ_USER_NODE_PROFILE:
    case SET_USERS_PROFILE:
    case SET_USERS_FAVORITE_CATEGORIES: {
      const { uid, profile, community, nodeProfile } = action.payload
      return {
        ...state,
        [uid]: {
          ...state[uid],
          ...(profile && { profile }),
          ...(community && { community }),
          ...(nodeProfile && { nodeProfile }),
        },
      }
    }

    case SET_MEMBER_ACTION: {
      const { uid, member } = action.payload
      return {
        ...state,
        [uid]: {
          ...state[uid],
          profile: member,
        },
      }
    }

    case SET_MEMBERS_ACTION:
    case SET_SEARCH_RESULTS:
    case SET_SEARCH_MORE_RESULTS:
    case SET_USER_FOLLOWERS:
    case SET_MORE_USER_FOLLOWERS:
    case SET_USER_FOLLOWING:
    case SET_MORE_USER_FOLLOWING:
    case SET_NOTIFICATIONS_DATA: {
      const { members } = action.payload

      if (members) {
        const mergedMembers: MembersState = {}
        Object.keys(members).forEach((uid) => {
          mergedMembers[uid] = {
            ...state[uid],
            profile: members[uid],
          }
        })

        return ({
          ...state,
          ...mergedMembers,
        })
      }

      return state
    }

    default:
      return state
  }
}

export default _users
