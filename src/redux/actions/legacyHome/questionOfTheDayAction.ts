import { State } from 'src/redux/reducers'
import { getPriorityFeaturedEntities, normalizeQuestionOfTheDay, NormalizedQuestionOfTheDay } from 'src/endpoints/milq/other'
import { homeDiscoveryUpdateCardAction } from 'src/redux/actions/legacyHome/discoveryActions'
import { setBooksAction } from 'src/redux/actions/book/searchBookAction'
import { CardIds } from 'src/redux/reducers/LegacyHomeReducer/DiscoveryReducer/CardsReducer'
import { setQuestionAction } from 'src/redux/actions/communities/recommendationAction'
import { setCommunitiesAction } from 'src/redux/actions/communities/fetchInterestsAction'
import { allCommunitiesInterestSelector } from 'src/redux/selectors/communities/interestsListSelector'
import { fetchAnswersByIdsAction } from 'src/redux/actions/communities/fetchAnswersByIdsAction'
import Logger from 'src/helpers/logger'

export const questionOfTheDayAction: () => ThunkedAction<State> =
  () => async (dispatch, getState) => {
    const response = await getPriorityFeaturedEntities()
    let content: Nullable<NormalizedQuestionOfTheDay> = null
    if (response.ok) {
      content = normalizeQuestionOfTheDay(response.data)
      if (content) {
        Logger.getInstance().info(`questionOfTheDayAction - question ${content.question.id} data is missing full answers: ${content.missingFullAnswersIds}`)
        if (content.missingFullAnswersIds.length > 0) {
          await dispatch(fetchAnswersByIdsAction(content.missingFullAnswersIds))

          const state = getState()
          const moreLoadedBooks =
            content.missingFullAnswersIds
              .map(answerId => state.communities.answers[answerId])
              .filter(answer => !!answer) // Remove any still missing answers
              .map(answer => answer.product) // The product is the book model
          content.books.push(...moreLoadedBooks)
        }

        await Promise.all([
          dispatch(setBooksAction(content.books.reduce((acc, val) => ({
            ...(acc || {}),
            [val.ean]: val,
          }), {}))),
          dispatch(setQuestionAction({
            questionId: content.question!.id,
            question: content.question,
          })),
          dispatch(setCommunitiesAction({
            ...allCommunitiesInterestSelector(getState()),
            [content.community!.id]: content.community,
          })),
        ])
      }
    }

    await dispatch(homeDiscoveryUpdateCardAction({
      id: CardIds.QUESTION_OF_THE_DAY,
      content: content || {},
    }))
  }
