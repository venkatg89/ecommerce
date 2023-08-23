import milqApiRequest from 'src/apis/milq'
import { QuestionId } from 'src/models/Communities/QuestionModel'
import { AnswerId } from 'src/models/Communities/AnswerModel'

export const deleteQuestion = (questionId: QuestionId) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/questions/${questionId}`,
})


export const deleteAnswer = (answerId: AnswerId) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/answers/${answerId}`,
})

export const deleteComment = (commentId: number) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/notes/${commentId}`,
})
