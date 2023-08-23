import milqApiRequest from 'src/apis/milq'

import { normalizeMemberData } from 'src/helpers/api/milq/normalizeMember'

const MAX_FOLLOWERS_PER_SEARCH = 20

interface Params {
  uid: string;
  skip?: number;
}

export const fetchFollowers = ({ uid, skip }: Params) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/members/${uid}/followers`,
  params: {
    from: skip,
    limit: MAX_FOLLOWERS_PER_SEARCH,
  },
})

export const normalizeFollowersReponseData = (data: any) => {
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
