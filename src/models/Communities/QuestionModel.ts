import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import { UserPostItem } from './MyPostModel'

export const QUESTION_PAGE_LENGTH = 10

export interface SimpleMember {
  uid: string,
  name: string,
}

export interface QuestionNoteCount {
  root: number,
  all: number,
}

export interface QuestionKarma {
  like: number,
  score: number,
}

export type QuestionId = string

export interface QuestionModel {
  id: QuestionId,
  communityId: string,
  creator: SimpleMember,
  title: string,
  answerCount: number,
  noteCount: QuestionNoteCount,
  creationDate: Timestamp,
  activeDate?: Timestamp,
  tag?: string,
  recentAnswerIds: AnswerId[],
  karma?: QuestionKarma,
}

export type QuestionsList = QuestionModel[]

export type QuestionsDictionnary = Record<number, QuestionModel>

export interface QuestionResponseData {
  answers: Record<string, AnswerModel>
  questions: QuestionsDictionnary
  questionIds: QuestionId[]
  myQuestions: UserPostItem[]
}

export enum RecommendationFilterNames {
  MY_POST = 'my_post',
  MY_COMMUNITIES = 'my_communities',
  CATEGORY = 'category',
  ALL = 'all'
}

export enum RecommendationSortNames {
  RECENT = 'recent',
  POPULAR = 'popular',
}
