import milqApiRequest from 'src/apis/milq'

export const fetchComment = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/notes',
  params,
})
