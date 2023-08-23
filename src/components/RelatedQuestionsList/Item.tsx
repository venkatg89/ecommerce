import React, { memo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components/native'

import CategoryGrid from 'src/components/CategoryGrid'
import UserIcon from 'src/components/UserIconList/UserIcon'

import { push, Routes, Params } from 'src/helpers/navigationService'
import countLabelText from 'src/helpers/countLabelText'
import { QuestionModel } from 'src/models/Communities/QuestionModel'

import { questionSelector } from 'src/redux/selectors/communities/questionsSelector'

interface ContainerProps {
  last?: boolean;
}

const Container = styled.TouchableOpacity<ContainerProps>`
  ${({ last }) => (last ? 'margin-top: 20;' : '')}
  background-color: ${({ theme }) => theme.palette.white};
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  border-width: 1;
  border-color: ${({ theme }) => theme.palette.disabledGrey};
  ${({ theme }) => theme.boxShadow.container}
  border-radius: 3;
`

const QuestionText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(3)};
  min-height: ${({ theme }) => theme.spacing(8)};
  ${({ theme }) => theme.typography.heading3}
  color: ${({ theme }) => theme.palette.grey1};
`

const User = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const UserText = styled.Text`
  margin-left: ${({ theme }) => (theme.spacing(1) / 2)};
  ${({ theme }) => theme.typography.body2}
  color: ${({ theme }) => theme.palette.grey3};
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

interface OwnProps extends ContainerProps {
  style?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  questionId: string;
}

interface StateProps {
  question: QuestionModel;
}

const selector = createStructuredSelector({
  question: questionSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const RelatedQuestionItem = ({ style, question, last }: Props) => (
  <Container
    style={ style }
    onPress={ () => { push(Routes.COMMUNITY__QUESTION, { [Params.QUESTION_ID]: question.id }) } }
    last={ last }
  >
    <CategoryGrid categoryIds={ [question.communityId] } size="small" />
    <QuestionText>
      { question.title }
    </QuestionText>
    <User
      onPress={ () => { push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: question.creator.uid }) } }
    >
      <UserIcon userId={ question.creator.uid } size="md" />
      <UserText>
        { question.creator.name }
      </UserText>
    </User>
    <Divider />
    <ResponseText>
      { `${countLabelText(question.answerCount, 'answer', 'answers')} from readers` }
    </ResponseText>
  </Container>
)

export default memo(connector(RelatedQuestionItem))
