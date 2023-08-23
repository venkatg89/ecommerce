export type CommunitiesInterestsList = CommunitiesInterestsModel[]

export type InterestId = string

export interface CommunitiesInterestsMember {
  uid: string,
  name: string,
}

export interface CommunitiesInterestsCustomAttributes {
  themeColor: HexColor,
}

export interface CommunitiesInterestsModel {
  id: string,
  name: string,
  tag: string,
  questionCount: number,
  memberCount: number,
  creationDate: Timestamp,
  activeDate: Timestamp,
  type: string,
  displayed: Timestamp,
  recentMembers: CommunitiesInterestsMember[],
  customAttributes: CommunitiesInterestsCustomAttributes,
  recentAnswerIds: number[],
}
