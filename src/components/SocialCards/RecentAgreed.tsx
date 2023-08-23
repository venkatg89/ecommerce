import React, { useContext } from 'react'
import { connect } from 'react-redux'
import _Button from 'src/controls/Button'
import countLabelText from 'src/helpers/countLabelText'
import { toTodayTomorrowTimeOrDate } from 'src/helpers/dateFormatters'
import { extractBooksFromAnswer } from 'src/helpers/api/milq/extractImagesFromAnswer'
import { extractRecentAgreedMembersFromRecentAnswers } from 'src/helpers/api/milq/extractRecentAgreedMembersFromRecentAnswers'
import { push, Routes } from 'src/helpers/navigationService'
import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { questionSelector, recentAnswersSelector } from 'src/redux/selectors/communities/questionsSelector'
import styled, { ThemeContext } from 'styled-components/native'
import _BookList from '../Community/QuestionsList/BookList'
import UserIconList from '../UserIconList'
import { TouchableOpacity } from 'react-native'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

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
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Column = styled.View`
  flex:1;
  flex-direction:column;
  padding-left: ${({ theme }) => theme.spacing(2)};
`

const Username = styled.Text`
  flex-shrink:1;
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
  questionId: AnswerId
}

interface StateProps {
  question: QuestionModel
  recentAnswers: AnswerModel[]
  uid: string
}

const selector = () => {
  const _recentAnswersSelector = recentAnswersSelector()
  return ((state, ownProps) => ({
    question: questionSelector(state, ownProps),
    uid: getMyProfileUidSelector(state),
    recentAnswers: _recentAnswersSelector(state, { questionId: ownProps.questionId }),
  }))
}

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const RecentAgreed = ({ question, recentAnswers, uid }: Props) => {
  const { palette } = useContext(ThemeContext)
  const answerQuestion = () => {
    push(Routes.COMMUNITY__ANSWER, { questionId: question.id })
  }
  const books = extractBooksFromAnswer(recentAnswers)
  const recentAgreedMembers = extractRecentAgreedMembersFromRecentAnswers(recentAnswers)
  const responeses = question.answerCount > 0 ? countLabelText(question.answerCount, 'answer', 'answers') : 'Be the first to respond!'

  return (
    <Container onPress={ answerQuestion }>
      <HeaderWrapper>
        <UserIconList
          onPress={ () => push(Routes.COMMUNITY__RECOMMENDED_USER, { answerId: recentAnswers[0].id, title: question.title }) }
          userIds={ recentAgreedMembers.map(member => member.uid) }
          userCount={ recentAgreedMembers.length }
        />
        <Column>
          <Username numberOfLines={ 3 }>
            {`${recentAgreedMembers.map(item => item.name).join(', ')} agreed with your answer.`}
          </Username>
          <Time>{toTodayTomorrowTimeOrDate(new Date(question.activeDate || question.creationDate))}</Time>
        </Column>
      </HeaderWrapper>
      <BodyWrapper>
        <TouchableOpacity onPress={ () => push(Routes.COMMUNITY__QUESTION, { questionId: question.id }) }>
          <ListName>{question.title}</ListName>
        </TouchableOpacity>
        <BookList answerCount={ question.answerCount } books={ books } />
        <Response>{ responeses }</Response>
        <ButtonContainer>
          <Button onPress={ answerQuestion } size="small" textStyle={ { color: palette.linkGreen } }>
            Add your Recommendation
          </Button>
        </ButtonContainer>
      </BodyWrapper>
    </Container>
  )
}

export default React.memo(connector(RecentAgreed))
