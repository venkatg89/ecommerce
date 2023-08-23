import milqApiRequest from 'src/apis/milq'

export const fetchQuestion = (questionId, params) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/questions/${questionId}`,
  params,
})
