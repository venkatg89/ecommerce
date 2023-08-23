import {
  QuestionModel,
  SimpleMember,
  QuestionKarma,
  QuestionNoteCount,
  QuestionResponseData,
  QuestionId,
} from 'src/models/Communities/QuestionModel'
import { Ean, BookModel } from 'src/models/BookModel'
import {
  AnswerId,
  AnswerModel,
  AnswersResponseData,
  AnswerNoteCount,
} from 'src/models/Communities/AnswerModel'
import {
  UserPostItem,
  myPostType,
} from 'src/models/Communities/MyPostModel'
import Logger from 'src/helpers/logger'

const logger = Logger.getInstance()

export const normalizeAnswerData = (answer: any): AnswerModel => ({
  id: answer._id as AnswerId,
  communityId: answer.community._id,
  questionId: answer.question._id as QuestionId,
  question: answer.question.title,
  title: answer.title,
  noteCount: answer.noteCount as AnswerNoteCount,
  creator: answer.creator as SimpleMember,
  creationDate: answer.creationDate,
  activeDate: answer.activeDate,
  product: answer.customAttributes && answer.customAttributes.product as BookModel,
  tag: answer.href,
  type: answer.type,
  earliestNoteIds: answer.earliestNoteIds,
  recentAgreedMembers: answer.recentAgreedMembers,
  earliestNotes: answer.earliestNotes,
  agreedCount: answer.agreedCount,
  isAgreed: !!answer.isAgreedNote,
})


export function normalizeAnswersData(answers: any): AnswersResponseData {
  const empty: AnswersResponseData = { answers: {}, questionIds: [], myAnswers: [] }
  if (!answers) {
    return empty
  }
  const eansSoFar = new Set<Ean>()
  return answers.reduce((result: AnswersResponseData, answer) => {
    const answerNormalized = normalizeAnswerData(answer)
    if (!answerNormalized.product) {
      logger.info(`normalizeAnswersData - answer ${answerNormalized.id} does not contain a product, and can't be interprered. Skipping.`)
      return result
    }
    if (eansSoFar.has(answerNormalized.product.ean)) {
      logger.info(`normalizeAnswersData - answer ${answerNormalized.id} repeats the answer of ean ${answerNormalized.product.ean}. Skipping`)
      return result // Don't process the same book answer twice or more
    }
    eansSoFar.add(answerNormalized.product.ean)

    result.questionIds.push(answerNormalized.questionId.toString())
    // eslint-disable-next-line no-param-reassign
    result.answers[answer._id] = answerNormalized
    const item: UserPostItem = {
      type: myPostType.ANSWER,
      referenceId: answer._id,
      creationDate: answer.creationDate,
    }
    result.myAnswers.push(item)
    return result
  }, empty)
}

export const normalizeQuestionResponseData = (question:any): QuestionModel => ({
  id: question._id as QuestionId,
  creator: question.creator as SimpleMember,
  title: question.title,
  tag: question.href,
  creationDate: question.creationDate,
  activeDate: question.activeDate,
  displayed: question.displayed,
  // recentAnswerIds and recentAnswers are not the same and sometimes one contains info the other doesn't, concat them together
  recentAnswerIds: [...new Set([...(question.recentAnswerIds || []), ...(question.recentAnswers && question.recentAnswers.map(answer => answer._id) || [])])],
  answerCount: question.answerCount,
  noteCount: question.noteCount as QuestionNoteCount,
  communityId: question.communityId,
  karma: question.karma as QuestionKarma,
} as QuestionModel)

export const extractQuestionRecentAnswers = question => (question.recentAnswers && normalizeAnswersData(question.recentAnswers).answers || {})

export const normalizeQuestionsReponseData = questions => questions.reduce((result, question) => {
  // eslint-disable-next-line no-param-reassign
  result.questions[question._id] = normalizeQuestionResponseData(question)
  result.questionIds.push(question._id.toString())
  result.myQuestions.push({
    type: myPostType.QUESTION,
    referenceId: question._id,
    creationDate: question.creationDate,
  } as UserPostItem)
  result.answers = { ...result.answers, ...extractQuestionRecentAnswers(question) } // eslint-disable-line
  return result
}, {
  answers: {},
  questions: {},
  questionIds: [],
  myQuestions: [] as UserPostItem[],
} as QuestionResponseData) as QuestionResponseData


interface Activity {
  actor: string
  target: string
  time: string
  topic: string
  verb: string
}

type QuestionOrAnswerModel = QuestionModel | AnswerModel

interface FeedData {
  activities: Activity[]
  dictionary: Record<string, QuestionOrAnswerModel>
}

interface FeedDataResponse {
  questions: Record<string, QuestionModel>
  questionIds: QuestionId[]
  answers: Record<string, AnswerModel>
}

const extractIdRegex = /^[^:]+:/g

export const normalizeFeedData = (feedData: FeedData) => {
  const result: FeedDataResponse = {
    answers: {},
    questions: {},
    questionIds: [],
  }
  const { activities, dictionary } = feedData
  const questions = activities.filter(activity => activity.verb.includes('question'))
  questions.forEach((question) => {
    const { target } = question
    const questionId = target.replace(extractIdRegex, '')
    result.questionIds.push(questionId)
    result.questions[questionId] = normalizeQuestionResponseData(dictionary[target])
  })

  Object.entries(dictionary).forEach((item) => {
    const [key, value] = item
    const [type, id] = key.split(':')
    switch (type) {
      case 'answer':
        result.answers[id] = normalizeAnswerData(value)
        break
      default: break
    }
  })
  return result
}
