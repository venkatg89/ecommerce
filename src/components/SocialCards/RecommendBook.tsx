import React, { useContext } from 'react'
import { connect } from 'react-redux'
import AgreeButton from 'src/components/AnswersList/AgreeButton'
import ListItem from 'src/components/BookGridList/ListItem'
import UserIconList from 'src/components/UserIconList'
import UserIcon from 'src/components/UserIconList/UserIcon'
import _Button from 'src/controls/Button'
import countLabelText from 'src/helpers/countLabelText'
import { toTodayTomorrowTimeOrDate } from 'src/helpers/dateFormatters'
import { push, Routes, Params } from 'src/helpers/navigationService'
import { AnswerId, AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { answerSelector, questionFromAnswerSelector } from 'src/redux/selectors/communities/questionsSelector'
import styled, { ThemeContext } from 'styled-components/native'
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
  margin: ${({ theme }) => theme.spacing(3)}px 0px;
  ${({ theme }) => theme.typography.heading2};
`


const ButtonContainer = styled.View`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const AgreedButton = styled(AgreeButton)`
  margin-right: ${({ theme }) => theme.spacing(2)}px;
`

const Row = styled.View`
  flex-direction: row;
`
const Response = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey2};
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  ${({ theme }) => theme.typography.body2};
`

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(1)};
  padding-right: ${({ theme }) => theme.spacing(2)};
`

const Column = styled.View`
  flex-direction:column;
  flex:1;
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

interface OwnProps {
  answerId: AnswerId
}

interface StateProps {
  answer: AnswerModel
  question: QuestionModel
}

const selector = (state, ownProps) => ({
  answer: answerSelector(state, ownProps),
  question: questionFromAnswerSelector(state, ownProps),
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

export default connector(
  ({ answer, question }: Props) => {
    const { palette } = useContext(ThemeContext)

    const answerQuestion = () => {
      push(Routes.COMMUNITY__ANSWER, { questionId: question.id })
    }
    const showAllUsers = () => {
      push(Routes.COMMUNITY__RECOMMENDED_USER, { answerId: answer.id, title: question.title })
    }
    const book = answer.product
    const recentAgreedMemberIds = answer.recentAgreedMembers.map(member => member.uid)
    const responeses = question.answerCount > 0 ? countLabelText(question.answerCount, 'answer', 'answers') : 'Be the first to respond!'

    const ActionComponent = () => (
      <Row>
        <AgreedButton answerId={ answer.id } />
        <UserIconList
          onPress={ showAllUsers }
          userIds={ recentAgreedMemberIds }
          userCount={ recentAgreedMemberIds.length }
        />
      </Row>
    )
    return (
      <Container onPress={ answerQuestion }>
        <HeaderWrapper>
          <TouchableOpacity onPress={ () => push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: answer.creator.uid }) }>
            <UserIcon userId={ answer.creator.uid || '' } />
          </TouchableOpacity>
          <Column>
            <Username>
              {`${answer.creator.name} recommended a book.`}
            </Username>
            <Time>{toTodayTomorrowTimeOrDate(new Date(answer.creationDate))}</Time>
          </Column>
        </HeaderWrapper>
        <BodyWrapper>
          <TouchableOpacity onPress={ () => push(Routes.COMMUNITY__QUESTION, { questionId: answer.questionId }) }>
            <ListName>{question.title}</ListName>
          </TouchableOpacity>
          <ListItem bookOrEan={ book } ActionComponent={ ActionComponent } />
          <Response>{ responeses }</Response>
          <ButtonContainer>
            <Button onPress={ answerQuestion } size="small" textStyle={ { color: palette.linkGreen } }>
            Add your Recommendation
            </Button>
          </ButtonContainer>
        </BodyWrapper>
      </Container>
    )
  },
)
