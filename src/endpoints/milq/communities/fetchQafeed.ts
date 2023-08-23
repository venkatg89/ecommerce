import milqApiRequest from 'src/apis/milq'

export const fetchQafeed = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/questions/bn-question-feed',
  params,
})
