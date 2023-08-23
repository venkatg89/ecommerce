import milqApiRequest from 'src/apis/milq'

export const fetchUserQuestions = (uid: string, params?) => milqApiRequest({
  method: 'GET',
  endpoint: `/api/v0/members/${uid}/questions`,
  params,
})
