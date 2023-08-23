import {
  CommunitiesInterestsCustomAttributes,
  CommunitiesInterestsMember, CommunitiesInterestsModel,
} from 'src/models/Communities/InterestModel'

export const normalizeCategoryData = (category) => {
  const defaultAttributes = { themeColor: 'ff00ff' }
  return ({
    id: category._id,
    name: category.name,
    tag: category.href,
    questionCount: category.questionCount,
    memberCount: category.memberCount,
    creationDate: category.creationDate,
    activeDate: category.activeDate,
    type: category.type,
    displayed: category.displayed,
    recentMembers: category.recentMembers as CommunitiesInterestsMember[],
    customAttributes: category.customAttributes || defaultAttributes as CommunitiesInterestsCustomAttributes,
  } as CommunitiesInterestsModel)
}
