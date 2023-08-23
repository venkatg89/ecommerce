import milqApiRequest from 'src/apis/milq'

export const askQuestion = data => milqApiRequest({
  method: 'POST',
  endpoint: 'api/v0/questions',
  data,
})
