import milqApiRequest from 'src/apis/milq'

export const milqAgreeToAnswer = (answerId: number) => milqApiRequest({
  method: 'POST',
  endpoint: 'api/v0/notes',
  data: {
    answerId,
    isAgreedNote: true,
  },
})

export const milqUnagreeToAnswer = (answerId: number) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/answers/${answerId}/agree`,
})

export const milqGetAgreedAnswers = (uid: string) => milqApiRequest({
  method: 'GET',
  endpoint: `api/v0/members/${uid}/agreedanswers`,
})
