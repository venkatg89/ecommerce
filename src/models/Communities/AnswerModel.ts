import { SimpleMember, QuestionId } from 'src/models/Communities/QuestionModel'
import { BookModel } from 'src/models/BookModel'
import { InterestId } from './InterestModel'
import { UserPostItem } from './MyPostModel'

export type AnswerId = number
export type CommentId = number

export interface AnswerNoteCount {
  root: number,
  all: number,
  ansComment: number,
  textNote: number
}

export interface AnswerModel {
  id: number,
  communityId: number,
  questionId: QuestionId,
  question: string;
  title: string,
  noteCount: AnswerNoteCount,
  creator: SimpleMember,
  creationDate: Timestamp,
  activeDate: Timestamp,
  product: BookModel,
  tag: string,
  type?: string,
  earliestNoteIds: number[],
  recentAgreedMembers: SimpleMember[],
  earliestNotes: [],
  agreedCount: number
  isAgreed: boolean;
}

export interface AnswersResponseData {
  answers: Record<number, AnswerModel>,
  myAnswers: UserPostItem[],
  questionIds: QuestionId[],
}

export interface CommentFeatured {
  ts: number,
  communityId: number,
}

export interface CommentModel {
  id: CommentId,
  answerId: AnswerId,
  parentId: CommentId,
  interestId: InterestId,
  tag: string,
  creator: SimpleMember,
  text: string,
  creationDate: Timestamp,
  isAgreedNote: boolean,
  childCount?: number,
  likes: number,
  childNotes?: CommentModel[],
  featured: CommentFeatured,
}

export type CommentRecords = Record<CommentId, CommentModel>

export type CommentResultData = {
  comments: CommentRecords
  childrenNotes:CommentRecords[]
}
