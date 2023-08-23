import milqApiRequest from 'src/apis/milq'

import { normalizeMemberData } from 'src/helpers/api/milq/normalizeMember'

const MAX_FOLLOWING_PER_SEARCH = 20

interface Params {
  uid: string;
  skip?: number;
}

export const fetchFollowing = ({ uid, skip }: Params) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/members/${uid}/following`,
  params: {
    from: skip,
    limit: MAX_FOLLOWING_PER_SEARCH,
  },
})

export const normalizeFollowingReponseData = (data: any) => {
  const members = data.reduce((object, user) => {
    object[user.uid] = normalizeMemberData(user) // eslint-disable-line
    return object
  }, {})

  const ids = data.map(user => user.uid)

  return {
    members,
    ids,
  }
}

export const milqFollowUser = ({ uid }: Params) => milqApiRequest({
  method: 'POST',
  endpoint: `api/v0/members/${uid}/follow`,
})

export const milqUnfollowUser = ({ uid }: Params) => milqApiRequest({
  method: 'POST',
  endpoint: `api/v0/members/${uid}/unfollow`,
})
