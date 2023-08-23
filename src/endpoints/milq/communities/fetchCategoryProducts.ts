import milqApiRequest from 'src/apis/milq'

export const fetchCommunityProducts = (communityId: string, params?) => milqApiRequest({
  method: 'GET',
  endpoint: `/api/v0/communities/${communityId}/products`,
  params,
})
