import { AnswerModel } from 'src/models/Communities/AnswerModel'

export const normalizePostAnswerData = (data) => {
  const answer: AnswerModel = {
    id: data._id,
    communityId: data.community._id,
    questionId: data.question._id,
    question: data.question.title,
    title: data.title,
    noteCount: data.noteCount,
    creator: data.creator,
    creationDate: data.creationDate,
    activeDate: data.activeDate,
    product: data.customAttributes.product,
    tag: data.href,
    type: data._type,
    earliestNoteIds: [],
    recentAgreedMembers: [],
    earliestNotes: [],
    agreedCount: 0,
    isAgreed: !!data.isAgreedNote,
  }
  return answer
}
