import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { NavigationInjectedProps } from 'react-navigation'

import Header from 'src/controls/navigation/Header'
import Container from 'src/controls/layout/ScreenContainer'
import RecommendationHeader from 'src/components/Community/RecommendationHeader'
import { QuestionId, RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { BookEANListName } from 'src/models/BookModel'
import { fetchQuestionAction } from 'src/redux/actions/communities/fetchQuestionAction'
import RecommendationBookList from 'src/components/Community/BookList/RecommendationBookList'
import { fetchAnswersForQuestionAction } from 'src/redux/actions/book/fetchAnswersForQuestionAction'
import { push, Routes, Params } from 'src/helpers/navigationService'
import QuestionCta from 'src/components/CtaButtons/QuestionCta'
import Button from 'src/controls/Button'
import { getContentContainerStyleWithAnchor, useResponsiveDimensions } from 'src/constants/layout'
import { ThemeModel } from 'src/models/ThemeModel'

const RecommendButton = styled(Button)``

interface OwnProps extends NavigationInjectedProps {}

interface DispatchProps {
  fetchQuestion: (filter: string, questionId: QuestionId) => void
  fetchAnswers(questionId: string, sort: RecommendationSortNames): void
}

const dispatcher = dispatch => ({
  fetchAnswers: (questionId, sort) => dispatch(fetchAnswersForQuestionAction(questionId, sort)),
  fetchQuestion: (filter, questionId) => dispatch(fetchQuestionAction(filter, questionId)),
})

const connector = connect<{}, DispatchProps, OwnProps>(
  null,
  dispatcher,
)

type Props = OwnProps & DispatchProps

const RecommendationScreen = ({ navigation, fetchQuestion, fetchAnswers }: Props) => {
  const theme = useContext(ThemeContext) as ThemeModel
  const { width } = useResponsiveDimensions()

  const questionId = navigation.getParam(Params.QUESTION_ID)
  let filter = ''
  const [currentSort, setSort] = useState<RecommendationSortNames>(RecommendationSortNames.RECENT)
  useEffect(() => {
    filter = `${BookEANListName.QUESTION_ANSWERS}${questionId}`
    if (navigation.getParam('_reload_question', false)) {
      fetchQuestion(filter, questionId)
      navigation.setParams({ _reload_question: false })
    }
    fetchAnswers(questionId, currentSort)
  }, [questionId, navigation.getParam('_reload_question')])


  const onSortChange = useCallback((sort: RecommendationSortNames) => {
    setSort(sort)
    fetchAnswers(questionId, sort)
  }, [currentSort])

  const contentContainerStyle = useMemo(() => getContentContainerStyleWithAnchor(theme, width), [theme, width])

  return (
    <Container>
      <RecommendationBookList
        contentContainerStyle={ contentContainerStyle }
        questionId={ questionId }
        sort={ currentSort }
        header={ (
          <RecommendationHeader questionId={ questionId } onSortChange={ onSortChange } sort={ currentSort } />
      ) }
      />
      <RecommendButton
        variant="contained"
        onPress={ () => push(Routes.COMMUNITY__ANSWER, { questionId }) }
        isAnchor
      >
        Add your Recommendation
      </RecommendButton>
    </Container>

  )
}

RecommendationScreen.navigationOptions = ({ navigation }) => {
  const questionId = navigation.getParam(Params.QUESTION_ID, '')
  const questionTitle = navigation.getParam(Params.TITLE, 'Questions')
  return ({
    title: questionTitle,
    header: headerProps => <Header headerProps={ headerProps } ctaComponent={ <QuestionCta questionId={ questionId } /> } />,
  })
}

export default connector(RecommendationScreen)
