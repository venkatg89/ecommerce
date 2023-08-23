import milqApiRequest from 'src/apis/milq'
import { QuestionId } from 'src/models/Communities/QuestionModel'
import { BookModelForMilq } from 'src/models/BookModel'

export interface PostAnswerData {
  questionId: QuestionId,
  title: string,
  product: BookModelForMilq,
}

export const postAnswer = (data: PostAnswerData) => milqApiRequest({
  method: 'POST',
  endpoint: 'api/v0/answers',
  data,
})
