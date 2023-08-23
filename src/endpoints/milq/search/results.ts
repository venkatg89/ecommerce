import milqApi from 'src/apis/milq'

import { SearchTypesKeys } from 'src/constants/search'
import {
  checkForMemberIdFromKey, checkForQuestionIdFromKey,
  checkForAnswerIdFromKey, checkForCategoryIdFromKey,
} from 'src/helpers/api/milq/searchListingKeys'

import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { ProfileModel } from 'src/models/UserModel'
import { normalizeMemberData } from 'src/helpers/api/milq/normalizeMember'
import { normalizeCategoryData } from 'src/helpers/api/milq/normalizeCategory'
import { normalizeQuestionResponseData, normalizeAnswerData, extractQuestionRecentAnswers } from 'src/helpers/api/milq/nomalizeQuestions'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { AnswerModel } from 'src/models/Communities/AnswerModel'

export interface SearchResultsParams {
  query: string;
  searchType: SearchTypesKeys;
  skip?: number;
}

export const getResultLimit = (searchType: SearchTypesKeys) => {
  switch (searchType) {
    case SearchTypesKeys.READERS: {
      return 20
    }
    case SearchTypesKeys.QUESTIONS: {
      return 10
    }
    case SearchTypesKeys.ANSWERS: {
      return 10
    }
    case SearchTypesKeys.CATEGORIES: {
      return 20
    }
    // case SearchTypesKeys.Books
    default:
      return 15
  }
}

export const getMilqSearchResults = ({ query, searchType, skip = 0 }: SearchResultsParams) => milqApi({
  method: 'GET',
  endpoint: '/api/v0/entities/search',
  params: {
    q: query,
    type: searchType,
    from: skip,
    limit: getResultLimit(searchType),
  },
})

interface ResponseProps {
  listings: string[]
  members?: Record<string, ProfileModel>
  questions?: Record<string, QuestionModel>
  answers?: Record<string, AnswerModel>
  categories?: Record<string, CommunitiesInterestsModel>
  recentAnswers?: Record<string, AnswerModel>
}

export const normalizeMilqSearchResultsResponseData = (data: any): ResponseProps => {
  const members: Record<string, ProfileModel> = {}
  const questions: Record<string, QuestionModel> = {}
  const answers: Record<string, AnswerModel> = {}
  const categories: Record<string, CommunitiesInterestsModel> = {}
  let recentAnswers: Record<string, AnswerModel> = {}

  Object.keys(data.dictionary).forEach((key) => {
    // members data
    const memberId = checkForMemberIdFromKey(key)
    if (memberId) {
      const member = data.dictionary[key]
      members[memberId] = normalizeMemberData(member)
      return
    }

    // questions data
    const questionId = checkForQuestionIdFromKey(key)
    if (questionId) {
      const question = data.dictionary[key]
      const questionRecentAnswers = extractQuestionRecentAnswers(question)
      questions[questionId] = normalizeQuestionResponseData(question)
      recentAnswers = { ...recentAnswers, ...questionRecentAnswers }
      return
    }

    // answer data
    const answerId = checkForAnswerIdFromKey(key)
    if (answerId) {
      const answer = data.dictionary[key]
      answers[answerId] = normalizeAnswerData(answer)
      return
    }

    // category data
    const categoryId = checkForCategoryIdFromKey(key)
    if (categoryId) {
      const category = data.dictionary[key]
      categories[categoryId] = normalizeCategoryData(category)
    }
  })

  // get list order
  const listings: string[] = data.results

  return ({
    listings,
    ...(Object.keys(members).length > 0 && { members }),
    ...(Object.keys(questions).length > 0 && { questions }),
    ...(Object.keys(answers).length > 0 && { answers }),
    ...(Object.keys(categories).length > 0 && { categories }),
    ...(Object.keys(recentAnswers).length > 0 && { recentAnswers }),
  })
}
