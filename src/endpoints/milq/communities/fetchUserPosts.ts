import milqApiRequest from 'src/apis/milq'

import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { UserPostItem, myPostType } from 'src/models/Communities/MyPostModel'
import { normalizeQuestionResponseData, normalizeAnswerData } from 'src/helpers/api/milq/nomalizeQuestions'
import { checkForQuestionIdFromKey, checkForAnswerIdFromKey } from 'src/helpers/api/milq/searchListingKeys'
import { UserPostTypeKeys } from 'src/constants/userPost'


export const fetchUserPosts = params => milqApiRequest({
  method: 'GET',
  endpoint: 'api/v0/members/entities',
  params,
})


export const normalizeUserPostsResponseData = (data: any) => {
  const questions: Record<string, QuestionModel> = {}
  const answers: Record<string, AnswerModel> = {}
  const userPosts: UserPostItem[] = []
  data.activities.forEach((activity) => {
    if (activity.verb === UserPostTypeKeys.QUESTIONS) {
      const questionId = checkForQuestionIdFromKey(activity.target)
      if (questionId) {
        const question = data.dictionary[activity.target]
        questions[questionId] = normalizeQuestionResponseData(question)
        userPosts.push({ type: myPostType.QUESTION, referenceId: questionId, creationDate: question.creationDate })
      }
    }

    const answerId = checkForAnswerIdFromKey(activity.target)
    if (answerId) {
      const answer = data.dictionary[activity.target]
      answers[answerId] = normalizeAnswerData(answer)
      if (activity.verb === UserPostTypeKeys.AGREEDANSWERS) {
        userPosts.push(({ type: myPostType.AGREEDANSWER, referenceId: answerId, creationDate: answer.creationDate }))
      }
      if (activity.verb === UserPostTypeKeys.ANSWERS) {
        userPosts.push(({ type: myPostType.ANSWER, referenceId: answerId, creationDate: answer.creationDate }))
      }
    }
  })
  return ({
    userPosts,
    questions,
    answers,
  })
}
