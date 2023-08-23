import milqApiRequest from 'src/apis/milq'

export const fetchHomeFeed = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/entities/bn-app-social-feed',
  params,
})
