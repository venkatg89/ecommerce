import milqApiRequest from 'src/apis/milq'

export const fetchAnswer = (answerid, params) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/questions/${answerid}`,
  params,
})
