import React, { useCallback, useMemo, useContext, Fragment } from 'react'
import { connect } from 'react-redux'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { ThemeContext } from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { AnswerModel } from 'src/models/Communities/AnswerModel'
import { QuestionModel } from 'src/models/Communities/QuestionModel'
import { Uid } from 'src/models/UserModel'

import { push, Routes, Params } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'

import { getMyProfileUidSelector } from 'src/redux/selectors/userSelector'
import { answerSelector, questionFromAnswerSelector } from 'src/redux/selectors/communities/questionsSelector'

import CategoryGrid from 'src/components/CategoryGrid'
import BookImage from 'src/components/BookImage'
import UserIcon from 'src/components/UserIconList/UserIcon'
import _AgreeButton from 'src/components/AnswersList/AgreeButton'
import UserIconList from 'src/components/UserIconList'

const Container = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing(3)}px ${({ theme }) => theme.spacing(2)}px;
  border: ${props => props.theme.palette.disabledGrey};
  border-radius: 4;
  background-color: ${props => props.theme.palette.white};
  ${({ theme }) => theme.boxShadow.container};
`

const QuestionText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.typography.heading3};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const FlexRow = styled.View`
  flex-direction: row;
`
const FlexColumn = styled.View`
  flex: 1;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.spacing(2)};
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

const ActionContainer = styled(FlexRow)`
  margin-top: ${({ theme }) => theme.spacing(3)};
  align-items: center;
`

const FlexContainer = styled(FlexRow)`
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const SubmittedText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  padding-left: ${({ theme }) => theme.spacing(1)};
`

const AgreeButton = styled(_AgreeButton)`
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const Divider = styled.View`
  height: 1;
  width: ${({ theme }) => theme.spacing(8)};
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.palette.grey2};
`
const ResponseText = styled.Text`
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey2};
`

interface OwnProps {
  answerId: string
  style?: StyleProp<ViewStyle>
}

interface StateProps{
  answer: AnswerModel
  question: QuestionModel
  myProfileUid: Uid
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
  const { spacing } = useContext(ThemeContext)
  const creatorUid = answer.creator.uid
  const { id, recentAgreedMembers } = answer
  const recentAgreedMemberIds = recentAgreedMembers.map(member => member.uid)
  const allAgreeMembers = answer.noteCount.root
  const redirectToAnswer = useCallback(() => {
    push(Routes.COMMUNITY__COMMENT, { [Params.ANSWER_ID]: answerId, [Params.EAN]: book.ean })
  }, [answerId, book.ean])

  const showAllUsers = useCallback(() => {
    push(Routes.COMMUNITY__RECOMMENDED_USER, { answerId, title: question.title })
  }, [answerId, question.title])

  const renderSubmissionComponent = useMemo(() => {
    if (creatorUid === myProfileUid) {
      return (
        <Fragment />

      )
    }
    return (
      <ActionContainer>
        <AgreeButton answerId={ id } />
        <UserIconList onPress={ showAllUsers } userIds={ recentAgreedMemberIds } canShowHowManyIcons={ 1 } userCount={ allAgreeMembers } />
      </ActionContainer>
    )
  }, [creatorUid, myProfileUid, showAllUsers, recentAgreedMemberIds, allAgreeMembers])


  return (
    <Container onPress={ redirectToAnswer } style={ style }>
      <CategoryGrid categoryIds={ [answer.communityId] } size="small" />
      <QuestionText>
        {question.title}
      </QuestionText>
      <FlexRow>
        <BookImage
          bookOrEan={ book }
          maxWidth={ spacing(9) }
          maxHeight={ spacing(13) }
        />
        <FlexColumn>
          <TitleText>{ book.name }</TitleText>
          <AuthorText>{ book.authors }</AuthorText>
          {renderSubmissionComponent}
        </FlexColumn>
      </FlexRow>

      <FlexContainer>
        <UserIcon userId={ creatorUid } />
        <SubmittedText>{answer.creator.name}</SubmittedText>
      </FlexContainer>
      <Divider />
      <ResponseText>
        { `${countLabelText(question.answerCount, 'answer', 'answers')} from readers` }
      </ResponseText>
    </Container>
  )
}

export default connector(AnswerItem)
