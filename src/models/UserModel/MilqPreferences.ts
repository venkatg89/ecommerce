// MilQ Profle Preferences, minus profile information (to prevent duplication)
export interface ProfilePreferencesStateModel {
  emailPrefs?: ProfileEmailPreferences
  pushPrefs?: ProfilePushPreferences
}

// These can be edited separately.
// There MilqPreferences are part of profile as well, so we keep from out of ProfileModel
export interface ProfilePreferencesApiModel extends ProfilePreferencesStateModel {
  /* ProfilePreferencesStateModel, also with: */
  name?: string,
  description?: string,
  image?: string,
}

// MilQ Email preferences - from swagger
export interface ProfileEmailPreferences {
  onAgreedAnswer: boolean
  onAskedQuestion: boolean
  onCommunityCreated: boolean
  onContentInteraction: boolean
  onMention: boolean
  onNetworkActivity: boolean
  onNoteComment: boolean
  onNoteReaction: boolean
  onQuestionAnswered: boolean
  onWeeklyDigest: boolean
}

// MilQ push preferences - from swagger
export interface ProfilePushPreferences {
  onAgreedAnswer: boolean
  onAskedQuestion: boolean
  onCommunityCreated: boolean
  onContentInteraction: boolean
  onMention: boolean
  onNetworkActivity: boolean
  onNoteComment: boolean
  onNoteReaction: boolean
  onQuestionAnswered: boolean
}
