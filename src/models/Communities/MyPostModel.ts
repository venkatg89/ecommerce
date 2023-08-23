import { AnswerId } from './AnswerModel'
import { QuestionId } from './QuestionModel'

export enum myPostType {
  QUESTION = 'questions',
  ANSWER = 'answers',
  AGREEDANSWER = 'agreedanswers',
}

export interface UserPostItem {
  type: myPostType,
  creationDate: Timestamp,
  referenceId: AnswerId | QuestionId,
}

export type MyPostListModel = Record<string, UserPostItem>

export type UserPostListModel = UserPostItem[]
