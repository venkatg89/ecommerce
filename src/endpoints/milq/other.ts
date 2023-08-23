import milqApiRequest from 'src/apis/milq'

import { AnswerId } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { BookModel } from 'src/models/BookModel'

import { normalizeQuestionResponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { normalizeCategoryData } from 'src/helpers/api/milq/normalizeCategory'

export const getPriorityFeaturedEntities = () => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/entities/priorityfeatured',
})

export interface NormalizedQuestionOfTheDay {
  question: QuestionModel,
  community: CommunitiesInterestsModel,
  books: BookModel[],
  missingFullAnswersIds: AnswerId[]
}

export const normalizeQuestionOfTheDay = (data: any): Nullable<NormalizedQuestionOfTheDay> => {
  if (!Object.keys(data).length) {
    return null
  }

  let featureQuestion = data.activities.filter(item => item.verb === 'featurequestion')
  if (!featureQuestion.length) {
    return null
  }

  featureQuestion = featureQuestion.shift()
  const question = data.dictionary[featureQuestion.target]
  const community = data.dictionary[featureQuestion.topic]
  if (!question || !community) {
    return null
  }

  const presentFullAnswersIds: AnswerId[] = question.recentAnswers.map(item => item.Id)
  const missingFullAnswersIds: AnswerId[] = question.recentAnswerIds.filter(id => !presentFullAnswersIds.includes(id))

  return {
    question: normalizeQuestionResponseData(question),
    community: normalizeCategoryData(community),
    books: question.recentAnswers.map(item => item.customAttributes.product),
    missingFullAnswersIds,
  }
}
