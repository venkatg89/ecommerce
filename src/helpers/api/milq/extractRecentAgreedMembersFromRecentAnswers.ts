import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { SimpleMember } from 'src/models/Communities/QuestionModel'

export const extractRecentAgreedMembersFromRecentAnswers = (array: AnswerModel[]): SimpleMember[] => array
  .reduce((acc, current) => [...acc, ...current.recentAgreedMembers], [] as SimpleMember[])
  .reduce((accumulator, current) => {
    if (!accumulator.find(({ uid }) => uid === current.uid)) {
      accumulator.push(current)
    }
    return accumulator
  }, [] as SimpleMember[])


export const extractquestionIdFromAnswers = (recentAnswers: AnswerModel[]) => {
  const hashMap = {}
  recentAnswers.forEach((item) => {
    hashMap[item.question] = { questionId: item.questionId, creationDate: item.creationDate }
  })
  return Object.keys(hashMap).map(i => hashMap[i])
}
