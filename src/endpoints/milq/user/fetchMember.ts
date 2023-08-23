import milqApiRequest from 'src/apis/milq'

import { normalizeMemberData } from 'src/helpers/api/milq/normalizeMember'

export const fetchMember = uid => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/members/${uid}`,
})

export const fetchMembers = (uids: string[]) => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/members',
  params: {
    uids: uids.join(','),
  },
})

export const normalizeFetchMembersResponseData = data => (
  data.reduce((obj, member) => ({
    ...(obj || {}),
    [member.uid]: normalizeMemberData(member),
  }), {})
)
