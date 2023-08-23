import React, { useContext } from 'react'
import { connect } from 'react-redux'
import UserIcon from 'src/components/UserIconList/UserIcon'
import _Button from 'src/controls/Button'
import countLabelText from 'src/helpers/countLabelText'
import { toTodayTomorrowTimeOrDate } from 'src/helpers/dateFormatters'
import { extractBooksFromAnswer } from 'src/helpers/api/milq/extractImagesFromAnswer'
import { push, Routes, Params } from 'src/helpers/navigationService'
import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionId, QuestionModel } from 'src/models/Communities/QuestionModel'
import { questionSelector, recentAnswersSelector } from 'src/redux/selectors/communities/questionsSelector'
import styled, { ThemeContext } from 'styled-components/native'
import _BookList from '../Community/QuestionsList/BookList'
import { TouchableOpacity } from 'react-native'

const Container = styled.TouchableOpacity`
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
`

const BodyWrapper = styled.View`
  padding:0px ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
`

const ListName = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  ${({ theme }) => theme.typography.heading2};
`


const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const Response = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
`

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1)};
`

const Column = styled.View`
  flex:1;
  flex-direction:column;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Username = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color:${({ theme }) => theme.palette.grey1};
`

const Time = styled.Text`
  ${({ theme }) => theme.typography.caption};
  color:${({ theme }) => theme.palette.grey2};
`

const BookList = styled(_BookList)`
  margin: ${({ theme }) => theme.spacing(2)}px 0px;
`

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  questionId: QuestionId
}

interface StateProps {
  question: QuestionModel
  recentAnswers: AnswerModel[]
}

const selector = () => {
  const _recentAnswersSelector = recentAnswersSelector()
  return ((state, ownProps) => ({
    question: questionSelector(state, ownProps),
    recentAnswers: _recentAnswersSelector(state, ownProps),
  }))
}

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const AskedAQuestion = ({ question, recentAnswers }: Props) => {
  const { palette } = useContext(ThemeContext)

  const answerQuestion = () => {
    push(Routes.COMMUNITY__ANSWER, { questionId: question.id })
  }
  const books = extractBooksFromAnswer(recentAnswers)
  const responses = question.answerCount > 0 ? countLabelText(question.answerCount, 'answer', 'answers') : 'Be the first to answer!'
  return (
    <Container onPress={ answerQuestion }>
      <HeaderWrapper>
        <TouchableOpacity onPress={ () => push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: question.creator.uid }) }>
          <UserIcon userId={ question.creator.uid || '' } />
        </TouchableOpacity>
        <Column>
          <Username>
            {question.creator.name}
            {' '}
              asked a question.
          </Username>
          <Time>{toTodayTomorrowTimeOrDate(new Date(question.creationDate))}</Time>
        </Column>
      </HeaderWrapper>
      <BodyWrapper>
        <TouchableOpacity onPress={ () => push(Routes.COMMUNITY__QUESTION, { questionId: question.id }) }>
          <ListName>{question.title}</ListName>
        </TouchableOpacity>
        <BookList answerCount={ question.answerCount } books={ books } />
        <Response>{ responses }</Response>
        <ButtonContainer>
          <Button onPress={ answerQuestion } size="small" textStyle={ { color: palette.linkGreen } }>
            Add your Recommendation
          </Button>
        </ButtonContainer>
      </BodyWrapper>
    </Container>
  )
}

export default React.memo(connector(AskedAQuestion))
