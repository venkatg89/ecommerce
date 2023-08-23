import milqApiRequest from 'src/apis/milq'
import {
  CommunitiesInterestsCustomAttributes,
  CommunitiesInterestsMember, CommunitiesInterestsModel,
} from 'src/models/Communities/InterestModel'

export const fetchInterests = () => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/communities',
})

export const normalizeCommunitiesCategoriesReponseData = data => data.reduce((object, community) => {
  // eslint-disable-next-line no-param-reassign
  object[community._id] = {
    id: community._id,
    name: community.name,
    tag: community.href,
    questionCount: community.questionCount,
    memberCount: community.memberCount,
    creationDate: community.creationDate,
    activeDate: community.activeDate,
    type: community.type,
    displayed: community.displayed,
    recentMembers: community.recentMembers as CommunitiesInterestsMember[],
    customAttributes: community.customAttributes as CommunitiesInterestsCustomAttributes,
  } as CommunitiesInterestsModel
  return object
}, {}) as Record<number, CommunitiesInterestsModel>
