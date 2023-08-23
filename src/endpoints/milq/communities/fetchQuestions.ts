import milqApiRequest from 'src/apis/milq'

export const fetchQuestions = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/questions',
  params,
})
