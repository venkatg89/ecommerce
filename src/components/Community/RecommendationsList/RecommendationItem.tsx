import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

import BookCarousel from 'src/components/LegacyBookCarousel'
import _Buffering from 'src/components/Buffering'

import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { AnswerModel } from 'src/models/Communities/AnswerModel'

import { extractBooksFromAnswer } from 'src/helpers/api/milq/extractImagesFromAnswer'
import countLabelText from 'src/helpers/countLabelText'
import { push, Routes } from 'src/helpers/navigationService'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { recentAnswersSelector } from 'src/redux/selectors/communities/questionsSelector'

// Place Holder for the new field
const LoremTitle = 'Question Title'

const Buffering = styled(_Buffering)`
  height: 105px;
`

const Item = styled.View`
  height: 490px;
  margin: 10px 0;
  padding: 10px 15px 20px;
  border: darkgray;
  background-color: transparent;
`

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
  text-align-vertical: center;
  text-align: center;
  color: black;
  margin-top: 20px;
`

const Author = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`

const Separator = styled.Text`
  height: 1px;
  width: 33%;
  align-self: center;
  background-color: black;
  margin: 15px 0px 10px;
`

const StandardText = styled.Text`
  font-size: 18px;
  text-align: center;
  text-align-vertical: center;
  justify-content: center;
`

const AnswerCount = styled(StandardText)`
  height: 20px;
  margin-bottom: 20px;
`

const Description = styled(StandardText)`
  height: 130px;
`

const AnswerButton = styled.Button``

interface OwnProps {
  question: QuestionModel
}

interface StateProps {
  userid?: string,
  recentAnswers: AnswerModel[];
}

const selector = () => {
  const _recentAnswersSelector = recentAnswersSelector()
  return ((state, ownProps) => ({
    userid: getMyProfileUidSelector(state),
    recentAnswers: _recentAnswersSelector(state, ownProps),
  }))
}

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

class RecommendationItem extends Component<Props> {
  answerQuestion = () => {
    const { question } = this.props
    push(Routes.COMMUNITY__ANSWER, { questionId: question.id, title: question.title })
  }

  viewQuestion = (questionid) => {
    push(Routes.COMMUNITY__QUESTION, { questionId: questionid })
  }

  renderCarousel = () => {
    const { recentAnswers } = this.props
    const books = extractBooksFromAnswer(recentAnswers)
    return (
      <BookCarousel
        bookOrEanList={ books }
        style={ { marginVertical: 20 } }
        bookMaxHeight={ 105 }
        bookMaxWidth={ 70 }
      />
    )
  }

  render() {
    const { question, userid, recentAnswers } = this.props
    const books = extractBooksFromAnswer(recentAnswers)
    const { answerQuestion, viewQuestion, renderCarousel } = this
    const creatorName = userid === question.creator.name ? 'Asked by You' : question.creator.name
    return (
      <Item>
        <Title>{ LoremTitle }</Title>
        <Author>{ creatorName }</Author>
        <Separator />
        <TouchableOpacity onPress={ () => viewQuestion(question.id) }>
          <Description>
            { question.title }
          </Description>
        </TouchableOpacity>
        <AnswerCount>{ countLabelText(question.answerCount, 'Answer', 'Answers') }</AnswerCount>
        <Buffering
          condition={ !!Object.values(books).length }
          renderContent={ renderCarousel }
        />
        <AnswerButton title="ANSWER" onPress={ answerQuestion } />
      </Item>
    )
  }
}

export default connector(RecommendationItem)
