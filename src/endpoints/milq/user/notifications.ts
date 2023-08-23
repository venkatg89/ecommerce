import milqApiRequest from 'src/apis/milq'
import { AnswerId } from 'src/models/Communities/AnswerModel'

interface QuestionNotifications {
  questionId: string;
}

export const getQuestionNotifications = ({ questionId }: QuestionNotifications) => milqApiRequest({
  method: 'POST',
  endpoint: `/api/v0/questions/${questionId}/follow`,
})

export const stopQuestionNotifications = ({ questionId }: QuestionNotifications) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/questions/${questionId}/follow`,
})

interface AnswerNotifications {
  answerId: AnswerId;
}

export const getAnswerNotifications = ({ answerId }: AnswerNotifications) => milqApiRequest({
  method: 'POST',
  endpoint: `/api/v0/answers/${answerId}/follow`,
})

export const stopAnswerNotifications = ({ answerId }: AnswerNotifications) => milqApiRequest({
  method: 'DELETE',
  endpoint: `/api/v0/answers/${answerId}/follow`,
})
