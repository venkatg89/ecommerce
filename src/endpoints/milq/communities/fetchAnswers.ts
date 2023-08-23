import milqApiRequest from 'src/apis/milq'

export const fetchAnswers = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v1/answers',
  params,
})
