import { SearchTypesKeys } from 'src/constants/search'
// this is the server format for search for '/api/v0/entities/search'
export const MEMBER_REGEX = new RegExp(`${SearchTypesKeys.READERS}:\(\.\+\)`) // eslint-disable-line
export const QUESTION_REGEX = new RegExp(`${SearchTypesKeys.QUESTIONS}:\(\.\+\)`) // eslint-disable-line
export const ANSWER_REGEX = new RegExp(`${SearchTypesKeys.ANSWERS}:\(\.\+\)`) // eslint-disable-line
export const CATEGORY_REGEX = new RegExp(`${SearchTypesKeys.CATEGORIES}:\(\.\+\)`) // eslint-disable-line
export const BOOK_REGEX = new RegExp(`${SearchTypesKeys.BOOKS}:\(\.\+\)`) // eslint-disable-line

export function checkForMemberIdFromKey(key: string): Nullable<string> {
  const memberKeys = key.match(MEMBER_REGEX)
  return memberKeys
    ? memberKeys[1]
    : null
}

export function checkForQuestionIdFromKey(key: string): Nullable<string> {
  const questionKeys = key.match(QUESTION_REGEX)
  return questionKeys
    ? questionKeys[1]
    : null
}

export function checkForBooksIdFromKey(key: string): Nullable<string> {
  const bookKeys = key.match(BOOK_REGEX)
  return bookKeys
    ? bookKeys[1]
    : null
}

export function checkForAnswerIdFromKey(key: string): Nullable<string> {
  const answerKeys = key.match(ANSWER_REGEX)
  return answerKeys
    ? answerKeys[1]
    : null
}

export function checkForCategoryIdFromKey(key: string): Nullable<string> {
  const categoryKeys = key.match(CATEGORY_REGEX)
  return categoryKeys
    ? categoryKeys[1]
    : null
}
