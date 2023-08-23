import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import { connect } from 'react-redux'

import { communityFromQuestionSelector, recentAnswersSelector, questionSelector } from 'src/redux/selectors/communities/questionsSelector'
import { CommunitiesInterestsModel } from 'src/models/Communities/InterestModel'
import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'

import Button from 'src/controls/Button'
import UserIcon from 'src/components/UserIconList/UserIcon'
import BookList from 'src/components/Community/QuestionsList/BookList'
import CategoryGrid from 'src/components/CategoryGrid'

import { push, Routes, Params } from 'src/helpers/navigationService'
import { extractBooksFromAnswer } from 'src/helpers/api/milq/extractImagesFromAnswer'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { AnswerModel } from 'src/models/Communities/AnswerModel'

import countLabelText from 'src/helpers/countLabelText'


const Container = styled.TouchableOpacity`
  padding-vertical: ${props => props.theme.spacing(3)}px;
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container}
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-top: ${({ theme }) => theme.spacing(3)}px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  text-align: center;
`

const CreatorContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 0px auto;
`

const UserText = styled.Text`
  margin-left: ${props => props.theme.spacing(1)};
  ${({ theme }) => theme.typography.body2};
`

const Divider = styled.View`
  height: 1px;
  width: 20%;
  align-self: center;
  background-color: ${({ theme }) => theme.palette.grey3};
  margin: ${props => props.theme.spacing(2)}px 0px;
`

const ResponseText = styled.Text`
  text-align: center;
  color: ${props => props.theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
`

const RecommendButton = styled(Button)`
  align-self: center;
`

interface StateProps {
  community: CommunitiesInterestsModel
  recentAnswers: AnswerModel[];
  question: QuestionModel;
  myProfileUid: string
}

interface OwnProps {
  style?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  questionId: string | number;
}

const selector = () => {
  const _recentAnswersSelector = recentAnswersSelector()
  return ((state, ownProps) => ({
    myProfileUid: getMyProfileUidSelector(state),
    question: questionSelector(state, ownProps),
    community: communityFromQuestionSelector(state, ownProps),
    recentAnswers: _recentAnswersSelector(state, ownProps),
  }))
}

type Props = OwnProps & StateProps

const connector = connect<StateProps, {}, OwnProps>(selector)

const RecommendationQuestionsItem = ({ style, question, community, recentAnswers, myProfileUid }: Props) => {
  const { palette } = useContext(ThemeContext)
  const navigateToUserProfile = () => push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: question.creator.uid })
  const navigateToQuestion = () => push(Routes.COMMUNITY__QUESTION, { [Params.QUESTION_ID]: question.id })
  const navigateToAnswer = () => push(Routes.COMMUNITY__ANSWER, { [Params.QUESTION_ID]: question.id, title: question.title })
  const buttonText = { color: palette.linkGreen }
  const myPost = myProfileUid === question.creator.uid
  const creatorName = myPost ? 'Asked by You' : question.creator.name
  const answerText =
    question.answerCount > 0 ? `${countLabelText(question.answerCount, 'answer', 'answers')} from readers` : 'Be the first to respond!'
  return (
    <Container
      style={ style }
      onPress={ navigateToQuestion }
    >
      <CategoryGrid categoryIds={ [question.communityId] } center size="small" />
      <TitleText>
        { question.title }
      </TitleText>
      <CreatorContainer onPress={ navigateToUserProfile }>
        <UserIcon userId={ question.creator.uid } />
        <UserText>
          { creatorName }
        </UserText>
      </CreatorContainer>
      <Divider />
      <ResponseText>{ answerText }</ResponseText>
      <BookList answerCount={ question.answerCount } books={ extractBooksFromAnswer(recentAnswers) } />
      { !myPost && (
        <RecommendButton
          textStyle={ buttonText }
          center
          onPress={ navigateToAnswer }
        >
          Add your Recommendation
        </RecommendButton>
      ) }
    </Container>
  )
}

export default connector(RecommendationQuestionsItem)
