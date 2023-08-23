import { CommunityDictionnary } from 'src/constants/communityDictionnary'
import { extractTypeFromDictionary } from 'src/helpers/api/milq/extractTypeFromDictionary'
import { normalizeMemberData } from 'src/helpers/api/milq/normalizeMember'
import { AnswersResponseData } from 'src/models/Communities/AnswerModel'
import { QuestionResponseData, QuestionModel } from 'src/models/Communities/QuestionModel'
import { NotificationType } from 'src/models/SocialModel/NotificationModel'
import { normalizeAnswersData, normalizeQuestionsReponseData } from 'src/helpers/api/milq/nomalizeQuestions'
import { normalizeHistoryResponseData } from 'src/endpoints/nodeJs/history'


export interface NotificationsModel {
  type: NotificationType;
  data: number | string;
  creationDate: number;
}

export const normalizeMilqNotificationsResponse = (response, uid) => {
  const answersData = extractTypeFromDictionary(response.data.dictionary, CommunityDictionnary.ANSWER)
  const questionsData = extractTypeFromDictionary(response.data.dictionary, CommunityDictionnary.QUESTION)
  const membersData = extractTypeFromDictionary(response.data.dictionary, CommunityDictionnary.MEMBER)
  const answersResponseData = normalizeAnswersData(answersData) as AnswersResponseData
  const questionsResponseData = normalizeQuestionsReponseData(questionsData) as QuestionResponseData
  const missingQuestionIds = answersResponseData.questionIds.filter(item => !questionsResponseData.questionIds.includes(item))

  const myAnswerNotifications = Object.assign(answersResponseData.answers, questionsResponseData.answers)

  const members = membersData.reduce((acc, member) => ({
    ...acc,
    [member.uid]: normalizeMemberData(member),
  }), {})

  const recentAgreedMembers = Object.keys(myAnswerNotifications).reduce((acc, val) => {
    const answer = myAnswerNotifications[val]
    if (!answer) {
      return acc
    }

    const isOwner = (answer.creator.uid === uid)
    const membersAgree = (answer.recentAgreedMembers.filter(item => item.uid !== uid).length > 0)
    if (isOwner && membersAgree) {
      acc.push({
        type: NotificationType.AGREEDANSWER,
        data: answer.questionId,
        creationDate: answer.creationDate,
      })
    }

    return acc
  }, [] as NotificationsModel[])

  const answersNotifications = Object.values(myAnswerNotifications).reduce((acc, answer) => {
    const isOwner = answer.creator.uid === uid
    if (!isOwner) {
      acc.push({
        type: NotificationType.ANSWER,
        data: answer.id,
        creationDate: answer.creationDate,
      })
    }
    return acc
  }, [] as NotificationsModel[])

  const questionNotifications = questionsResponseData.myQuestions.map(item => ({
    type: item.type as unknown as NotificationType,
    data: item.referenceId,
    creationDate: item.creationDate,
  }))
  const myNotifications: NotificationsModel[] = [
    ...questionNotifications,
    ...answersNotifications,
    ...recentAgreedMembers,
  ]

  return {
    questionIds: missingQuestionIds,
    questions: questionsResponseData.questions,
    myAnswerNotifications,
    myNotifications,
    members,
  }
}

export const normalizeNodeJsHistoryResponse = (response) => {
  const { eans: bookEans, posts } = normalizeHistoryResponseData(response.data)
  const eans = [...new Set(bookEans)]
  const historyNotifications = posts.map(item => ({
    type: item.type,
    data: item,
    creationDate: Number(new Date(item.creationDate)),
  }
  ))

  return {
    eans,
    posts,
    historyNotifications,
  }
}


export const normalizeNotificationFallback = (questions:QuestionModel[]): NotificationsModel[] => questions.map(question => ({
  type: NotificationType.QUESTION,
  data: Number(question.id),
  creationDate: question.creationDate,
}))
