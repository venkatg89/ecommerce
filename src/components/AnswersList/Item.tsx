import React from 'react'
import { connect } from 'react-redux'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import BookImage from 'src/components/BookImage'
import UserIconList from 'src/components/UserIconList'
import UserIcon from 'src/components/UserIconList/UserIcon'
import CategoryGrid from 'src/components/CategoryGrid'
import _AgreeButton from 'src/components/AnswersList/AgreeButton'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { answerSelector, questionFromAnswerSelector } from 'src/redux/selectors/communities/questionsSelector'

import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { push, Routes, Params } from 'src/helpers/navigationService'

import countLabelText from 'src/helpers/countLabelText'

const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container};
`

const QuestionTitleText = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.palette.grey1};
  margin: ${({ theme }) => theme.spacing(3)}px 0px;
  ${({ theme }) => theme.typography.heading2};
`

const FlexRow = styled.View`
  flex-direction: row;
`

const ActionContainer = styled(FlexRow)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  align-items: center;
`

const FlexColumn = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: 24;
`

const TitleText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1) / 2};
`

const AuthorText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const AgreeButton = styled(_AgreeButton)`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const SubmittedText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const Divdier = styled.View`
  height: 1px;
  width: 20%;
  align-self: center;
  background-color: ${({ theme }) => theme.palette.grey3};
  margin: ${props => props.theme.spacing(3)}px 0px;
`

const Response = styled.Text`
  text-align: center;
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface OwnProps {
  answerId: string | number
  style?: StyleProp<ViewStyle>
}

interface StateProps {
  myProfileUid: string;
  question: QuestionModel
  answer: AnswerModel
}

const selector = createStructuredSelector({
  myProfileUid: getMyProfileUidSelector,
  question: (state, props) => {
    const ownProps = props as OwnProps
    const { answerId } = ownProps
    return questionFromAnswerSelector(state, { answerId })
  },
  answer: answerSelector,
})


const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = OwnProps & StateProps

const AnswerItem = ({ style, answer, myProfileUid, question, answerId }: Props) => {
  const book = answer.product
  const creatorUid = answer.creator.uid
  const { id, recentAgreedMembers } = answer
  const recentAgreedMemberIds = recentAgreedMembers.map(member => member.uid)
  const allAgreeMembers = answer.noteCount.root
  const redirectToAnswer = () => {
    push(Routes.COMMUNITY__COMMENT, { [Params.ANSWER_ID]: answerId, [Params.EAN]: book.ean })
  }

  const showAllUsers = () => {
    push(Routes.COMMUNITY__RECOMMENDED_USER, { answerId: answer.id, title: question.title })
  }

  const renderSubmissionComponent = () => {
    if (creatorUid === myProfileUid) {
      return (
        <ActionContainer>
          <UserIcon userId={ creatorUid } />
          <SubmittedText>Submitted by You</SubmittedText>
        </ActionContainer>
      )
    }
    // TODO Mark already recommended books in search result as agreed
    return (
      <ActionContainer>
        <AgreeButton answerId={ id } />
        <UserIconList onPress={ showAllUsers } userIds={ recentAgreedMemberIds } canShowHowManyIcons={ 1 } userCount={ allAgreeMembers } />
      </ActionContainer>
    )
  }

  return !!book && !!answer ? (
    <Container onPress={ redirectToAnswer } style={ style }>
      <CategoryGrid categoryIds={ [answer.communityId] } center size="small" />
      <QuestionTitleText>{ answer.question }</QuestionTitleText>
      <FlexRow>
        <BookImage
          bookOrEan={ book }
          maxWidth={ 9 * 8 }
          maxHeight={ 13 * 8 }
        />
        <FlexColumn>
          <TitleText>{ book.name }</TitleText>
          <AuthorText>{ book.authors }</AuthorText>
          { renderSubmissionComponent() }
        </FlexColumn>
      </FlexRow>
      <Divdier />
      <Response>
        { countLabelText(question.answerCount, 'Answer', 'Answers') }
      </Response>
    </Container>
  ) : <React.Fragment key={ Math.random() /* this fragment prevents a bug if the book or answer are not loaded yet */ } />
}


export default connector(AnswerItem)
