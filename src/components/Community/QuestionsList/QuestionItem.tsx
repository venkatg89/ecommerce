import { connect } from 'react-redux'
import React, { useContext } from 'react'
import styled from 'styled-components/native'
import { ThemeContext } from 'styled-components'

import UserIcon from 'src/components/UserIconList/UserIcon'
import CategoryGrid from 'src/components/CategoryGrid'
import { QuestionModel, QuestionId } from 'src/models/Communities/QuestionModel'
import { extractBooksFromAnswer } from 'src/helpers/api/milq/extractImagesFromAnswer'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import routes from 'src/constants/routes'
import {
  questionSelector,
  recentAnswersSelector,
} from 'src/redux/selectors/communities/questionsSelector'
import { AnswerModel } from 'src/models/Communities/AnswerModel'
import _Button from 'src/controls/Button'
import BookList from './BookList'
import { push, Routes, Params } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'

const Item = styled.TouchableOpacity`
  padding-vertical: ${props => props.theme.spacing(3)}px;
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
`

const ItemWrapper = styled.View`
  padding-horizontal: ${props => props.theme.spacing(2)}px;
`

const GenreWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`

const Submitted = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 0px auto;
`

const Creator = styled.Text`
  margin-left: ${props => props.theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
`

const Separator = styled.Text`
  height: 1px;
  width: 20%;
  align-self: center;
  background-color: rgb(119, 119, 119);
  margin: ${props => props.theme.spacing(2)}px 0px;
`

const Response = styled.Text`
  text-align: center;
  color: ${props => props.theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
`

const Title = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.typography.heading2};
`

const ButtonContainer = styled.View`
  align-items: center;
`

const Button = styled(_Button)`
  padding: ${({ theme }) => theme.spacing(1)}px;
`

interface OwnProps {
  // eslint-disable-next-line react/no-unused-prop-types
  questionId: QuestionId
  mypost?: boolean
}

interface StateProps {
  userid?: string
  question: QuestionModel
  recentAnswers: AnswerModel[]
}

const selector = () => {
  const _recentAnswersSelector = recentAnswersSelector()
  return ((state, ownProps) => ({
    userid: getMyProfileUidSelector(state),
    question: questionSelector(state, ownProps),
    recentAnswers: _recentAnswersSelector(state, ownProps),
  }))
}

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const QuestionItem = ({ question, userid, recentAnswers, mypost }: Props) => {
  const answerQuestion = () => {
    push(routes.COMMUNITY__ANSWER, { questionId: question.id })
  }
  const viewQuestion = () => {
    push(routes.COMMUNITY__QUESTION, { questionId: question.id, title: question.title })
  }

  const { palette } = useContext(ThemeContext)
  const books = extractBooksFromAnswer(recentAnswers)
  const creatorName = userid === question.creator.uid ? 'Asked by You' : question.creator.name
  const answerText =
    question.answerCount > 0 ? `${countLabelText(question.answerCount, 'answer', 'answers')} from readers` : 'Be the first to respond!'
  return (
    <Item
      accessible={ false }
      onPress={ viewQuestion }
    >
      <ItemWrapper
        accessible
        accessibilityRole="header"
        accessibilityHint="press to view recommendations"
      >
        <GenreWrapper>
          <CategoryGrid categoryIds={ [question.communityId] } center size="small" />
        </GenreWrapper>
        <Title>
          {question.title}
        </Title>
        <Submitted
          onPress={ () => { push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: question.creator.uid }) } }
        >
          <UserIcon userId={ question.creator.uid } />
          <Creator
            accessibilityLabel={ `created by: ${creatorName}.` }
          >
            {creatorName}
          </Creator>
        </Submitted>
        <Separator accessible={ false } />
        <Response>{answerText}</Response>
      </ItemWrapper>
      <BookList answerCount={ question.answerCount } books={ books } />
      {!mypost && (
      <ButtonContainer>
        <Button
          accessibilityLabel="Add your recommendation"
          importantForAccessibility="yes"
          onPress={ answerQuestion }
          size="small"
          textStyle={ { color: palette.linkGreen } }
        >
          Add your Recommendation
        </Button>
      </ButtonContainer>
      )}
    </Item>
  )
}

export default connector(QuestionItem)
