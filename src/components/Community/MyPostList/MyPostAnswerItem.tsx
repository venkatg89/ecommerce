import React, { useContext } from 'react'
import { connect } from 'react-redux'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'

import BookImage from 'src/components/BookImage'
import UserIcon from 'src/components/UserIconList/UserIcon'
import CategoryGrid from 'src/components/CategoryGrid'

import { push, Routes, Params } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'

import {
  answerSelector,
  questionFromAnswerSelector,
} from 'src/redux/selectors/communities/questionsSelector'


const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
`

const GenreWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`

const Question = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  margin: ${({ theme }) => theme.spacing(3)}px 0px;
  ${({ theme }) => theme.typography.heading2};
`

const Answer = styled.View`
  flex-direction: row;
`

const Info = styled.View`
  flex-shrink: 1;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1) / 2};
`

const Author = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`
const Submitted = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
`

const Creator = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const Border = styled.View`
  height: 1px;
  width: 20%;
  align-self: center;
  background-color: rgb(119, 119, 119);
  margin: ${props => props.theme.spacing(2)}px 0px;
`

const Response = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`


interface OwnProps {
  answerId: AnswerId
}

interface StateProps {
  answer: AnswerModel
  question: QuestionModel
}

const selector = createStructuredSelector({
  answer: answerSelector,
  question: questionFromAnswerSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const MyPostAnswerItem = ({ answerId, answer, question }: Props) => {
  // TODO Add list of user that agreed with the book in the search result
  // TODO Mark already recommended books in search result as agreed
  const { spacing } = useContext(ThemeContext)
  const book = answer.product
  return (
    <Container onPress={ () => { push(Routes.COMMUNITY__COMMENT, { [Params.ANSWER_ID]: answerId, [Params.EAN]: book.ean }) } }>
      <GenreWrapper>
        <CategoryGrid categoryIds={ [question.communityId] } center size="small" />
      </GenreWrapper>
      <Question>{ question.title }</Question>
      <Answer>
        <BookImage bookOrEan={ book } maxWidth={ spacing(9) } maxHeight={ spacing(13) } />
        <Info>
          <Title>{ book.name }</Title>
          <Author>{ book.authors }</Author>
          <Submitted>
            <UserIcon userId={ question.creator.uid } />
            <Creator>Submitted by you</Creator>
          </Submitted>
        </Info>
      </Answer>
      <Border />
      <Response>{ countLabelText(question.answerCount, 'Answer', 'Answers') }</Response>
    </Container>
  )
}

export default connector(MyPostAnswerItem)
