// TODO rename this to members? are we combining this with all atg/milq

// For writing selectors during dev work
// import { State } from 'src/redux/reducers'

import { ProfileModel, Uid } from 'src/models/UserModel'
import {
  NodeProfileModel,
  PrivacyModel,
} from 'src/models/UserModel/NodeProfileModel'
import { AtgAccountModel } from 'src/models/UserModel/AtgAccountModel'
import { RequestStatus } from 'src/models/ApiStatus'

import { State } from 'src/redux/reducers'
import {
  questionSelector,
  answerSelector,
} from './communities/questionsSelector'

const EMPTY_OBJECT = {} as const
const EMPTY_ARRAY = []
const EMPTY_STRING = ''
// This is the Mil
export const getMyProfileUidSelector = (state: any) =>
  state.user.profile ? state.user.profile.uid : undefined

// TODO REMOVEMILQ
// export const isUserLoggedInSelector = (state: any) => state.nodeJs.session.active && state.milq.session.active
export const isUserLoggedInSelector = (state: any) =>
  state.atg?.session?.loggedIn

export const membersSelector = (state) => state.users

export const memberNameSelector = (state: any, props) => {
  const { uid } = props
  const members = membersSelector(state)
  return (members[uid] && members[uid].profile.name) || EMPTY_STRING
}

export const filterMembersByIdsSelector = (state, props) => {
  const { ids = [] } = props
  const members = membersSelector(state)
  return ids
    .filter((o) => !!o)
    .map((id) => members[id])
    .filter((o) => !!o)
}

export const memberSelector = (_state, props) => {
  const state = _state as State
  const { id } = props
  const members = membersSelector(state)
  return members[id] || EMPTY_OBJECT
}

export const getCustomerKeySelector = (state) => {
  try {
    return state.user.account.customerKey
  } catch (e) {
    return undefined
  }
}

// Profile Selectors - for local user
export const myMilqProfileSelector = (state: any): ProfileModel | undefined =>
  state.user.profile
export const myAtgAccountSelector = (state: any): AtgAccountModel | undefined =>
  state.user.account
export const myAtgEncodedUserIdSelector = (state: any): string | undefined =>
  state.user.encodedUserId
export const myAtgErrorSelector = (state: any): string =>
  state.atg.api.account.error
export const myAtgEditAccountErrorSelector = (state: any): string =>
  state.atg.api.editAccount.error
export const milqPreferencesErrorSelector = (state: any): string =>
  state.milq.api.preferences.error
export const myAtgApiStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.editAccount.requestStatus
}

export const myAtgApiValidateSecurityStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.validateSecurityAnswer.requestStatus
}

export const myAtgApiPasswordResetStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.passwordReset.requestStatus
}

export const myAtgApiEmailAddressStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.emailAddress.requestStatus
}

export const myAtgApiPhoneNumberStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.atg.api.phoneNumber.requestStatus
}

export const atgUserIdSelector = (state) =>
  state.user.account && state.user.account!.atgUserId

// TODO - For other milq users
export const milqProfileSelector = (state: any, props: any): ProfileModel => {
  const { milqId } = props
  return (state.users[milqId] && state.users[milqId].profile) || EMPTY_OBJECT
}

export const milqNodeProfileSelector = (
  state: State,
  milqId: Uid,
): NodeProfileModel | {} =>
  (state.users[milqId] && state.users[milqId].nodeProfile) || EMPTY_OBJECT

// For communities
export const myInterestCommunityIds = (state: any): number[] =>
  state.user.community.favoriteCategories || EMPTY_ARRAY

export const myInterestCommunities = (state: any): number[] =>
  myInterestCommunityIds(state)

export const isBusyMyInterestCommunities = (state: any) =>
  state.milq.api.myFavoriteCommunities.requestStatus === RequestStatus.FETCHING

export const favoriteCategoriesForMilqUserId = (
  state: any,
  props: any,
): number[] => {
  const { milqId } = props
  return (
    (state.users[milqId] &&
      state.users[milqId].community &&
      state.users[milqId].community.favoriteCategories) ||
    EMPTY_ARRAY
  )
}

export const accountEmailSelector = (state) =>
  (state.user.account && state.user.account.email) ||
  (state.guestInfo && state.guestInfo.email) ||
  EMPTY_STRING

// BELOW IS LEGACY
export const getLanguageSelector = (state) => 'en' // for now TODO

export const isBusyUserProfileOrPreferences = (state: any) =>
  state.milq.api.preferences.requestStatus === RequestStatus.FETCHING ||
  state.atg.api.account.requestStatus === RequestStatus.FETCHING ||
  state.milq.api.myFavoriteCommunities.requestStatus === RequestStatus.FETCHING

export const userProfilePreferenceAPIStatusSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.milq.api.preferences.requestStatus
}

export const myAgreedAnswerIdsSelector = (state) =>
  state.user.community.agreedAnswers

export const isMyAgreedAnswerSelector = (state, ownProps) => {
  const { answerId } = ownProps
  const agreedAnswers = myAgreedAnswerIdsSelector(state)
  return agreedAnswers.includes(answerId)
}

export const myLikedCommentsIdsSelector = (state) =>
  state.user.community.likedComments

export const isMyLikedCommentSelector = (state, ownProps) => {
  const { commentId } = ownProps
  const likedComments = myLikedCommentsIdsSelector(state)
  return likedComments.includes(commentId)
}

export const myFollowedUserIdsSelector = (state) =>
  state.user.community.followedUsers

export const isMyFollowerUserSelector = (state, ownProps) => {
  const { uid } = ownProps
  const followedUsers = myFollowedUserIdsSelector(state)
  return followedUsers.includes(uid)
}

export const isFollowCategoryBusy = (state) =>
  isBusyMyInterestCommunities(state) ||
  state.milq.api.followCommunity.requestStatus === RequestStatus.FETCHING

export const getUserFollowingListSelector = (state, ownProps) => {
  const { uid } = ownProps
  return (
    (state.listings.users.following[uid] &&
      state.listings.users.following[uid].ids) ||
    EMPTY_ARRAY
  )
}

export const getUserFollowersListSelector = (state, ownProps) => {
  const { uid } = ownProps
  return (
    (state.listings.users.followers[uid] &&
      state.listings.users.followers[uid].ids) ||
    EMPTY_ARRAY
  )
}

export const myNodePrivacySelector = (stateAny: any) => {
  return {} as PrivacyModel
}

export const myNotInterestedList = (state) =>
  state.user.nodeProfile.notInterested
export const myFollowedQuestionsIdsSelector = (state) =>
  state.user.community.questionNotifications
export const myFollowedAnswersIdSelector = (stateAny: any) => {
  const state = stateAny as State
  return state.user.community.answerNotifications
}

export const isMyQuestionSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const myUid = getMyProfileUidSelector(state)
  const question = questionSelector(state, props)
  return question.creator.uid === myUid
}

export const isMyAnswerSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const myUid = getMyProfileUidSelector(state)
  const answer = answerSelector(state, props)
  if (answer) {
    return answer.creator.uid === myUid
  }
  return false
}

export const isFollowingQuestionSelector = (stateAny: any, ownProps: any) => {
  const state = stateAny as State
  const { questionId } = ownProps
  const followedQuestions = myFollowedQuestionsIdsSelector(state)
  return followedQuestions.includes(questionId)
}

export const isFollowingAnswerSelector = (stateAny: any, props: any) => {
  const state = stateAny as State
  const { answerId } = props
  const followedAnswers = myFollowedAnswersIdSelector(state)
  return followedAnswers.includes(answerId)
}

export const isUserTipAvailableSelector = (state, tip) => {
  const { tips } = state.user
  const rejected = tips.rejected.filter((item) => item.type === tip)
  if (rejected.length) {
    return false
  }

  const accepted = tips.accepted.filter((item) => item.type === tip)
  if (accepted.length) {
    return false
  }

  const dismissed = tips.dismissed.filter((item) => item.type === tip)
  if (!dismissed.length) {
    return true
  }

  const currentDate = new Date()
  const available = dismissed[0].dismisses.filter(
    (item) => new Date(item.availableFrom) <= currentDate,
  )
  if (available.length) {
    return true
  }

  return false
}

export const getLocalUserReadingStatusPrivacySelector = (stateAny) =>
  EMPTY_OBJECT

export const getUsrReadingStatusPrivacySelector = (stateAny: any, props: any) =>
  EMPTY_OBJECT

export const getReadingStatusPrivacy = (stateAny, props) => false

export const getUserTipSelector = (state, type) => {
  const { tips } = state.user
  let tip = tips.rejected.find((item) => item.type === type)
  if (!tip) {
    tip = tips.accepted.find((item) => item.type === type)
  }

  return tip
}

export const getUserTipOptions = (state: State, optionName?: string) => {
  const { options } = state.user.tips
  if (optionName) {
    return options[optionName] || null
  }

  return options
}

export const firstSessionDateSelector = (state) => {
  const { sessions } = state.user
  if (sessions.length) {
    return sessions[0].startedAt
  }

  return null
}

export const countSessionsSelector = (state) => {
  const { sessions } = state.user

  return sessions.length
}

export const firstLoginDateSelector = (state) => {
  if (isUserLoggedInSelector(state)) {
    return state.user.nodeProfile.registrationDate
  }

  return firstSessionDateSelector(state)
}

export const getAppReviewSelector = (state) => state.user.appReview

export const notificationsSettingSelector = (state) => state.user.notifications
