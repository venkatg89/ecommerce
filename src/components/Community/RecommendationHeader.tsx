/* eslint-disable react/no-unused-prop-types */
import React, { useState, useCallback, Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { createStructuredSelector } from 'reselect'

import { QuestionModel, RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { questionSelector } from 'src/redux/selectors/communities/questionsSelector'
import { toDayMonth } from 'src/helpers/dateFormatters'
import { push, Routes, Params } from 'src/helpers/navigationService'

import CategoryGrid from 'src/components/CategoryGrid'
import UserIcon from 'src/components/UserIconList/UserIcon'
import Button from 'src/controls/Button'
import SortFilter from 'src/controls/SortFilter/CommunitySortFilter'

import { icons } from 'assets/images'

const Content = styled.View`
`

const Title = styled.Text`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.heading2};
`

const FlexRow = styled.View`
  flex-direction: row;
  align-items: center;
`

const UserInfoContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

const Username = styled.Text`
  margin-left: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.body2};
`

const Flex = styled.View`
  flex: 1;
`

const Date = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
`

const AnswerCount = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  flex: 1;
  text-align: center;
  padding-right: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.typography.body2};
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const AnswerContainer = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  align-items: center;
`

interface OwnProps {
  questionId: string
  onSortChange
  sort: RecommendationSortNames
}

interface StateProps {
  question: QuestionModel
}

const selector = createStructuredSelector({
  question: questionSelector,
})

const connector = connect<StateProps, {}, OwnProps>(selector)

type Props = StateProps & OwnProps

const RecommendationHeader = ({ question, onSortChange }: Props) => {
  const [isOpen, setOpen] = useState(false)
  const handleOpenFitler = useCallback(() => setOpen(!isOpen), [isOpen])

  const goToProfile = useCallback(() => {
    push(Routes.PROFILE__MAIN, { [Params.MILQ_MEMBER_UID]: question.creator.uid })
  }, [])

  const toggleFilter = (filter, sort) => {
    onSortChange(sort)
  }

  if (!question) {
    return <Fragment />
  }

  const response = question.answerCount === 1 ? 'Answer' : 'Answers'
  return (
    <Content>
      <CategoryGrid categoryIds={ [question.communityId] } />
      <Title
        accessibilityRole="header"
      >
        {question.title}
      </Title>
      <FlexRow>
        <UserInfoContainer onPress={ goToProfile }>
          <UserIcon userId={ question.creator.uid } />
          <Username>{question.creator.name}</Username>
        </UserInfoContainer>
        <Flex />
        <Date>{toDayMonth(question.creationDate)}</Date>
      </FlexRow>

      <AnswerContainer>
        <Button
          accessibilityLabel="sort and filter"
          icon
          onPress={ handleOpenFitler }
        >
          <Icon source={ icons.sort } />
        </Button>
        <AnswerCount>{`${question.answerCount} ${response}`}</AnswerCount>
      </AnswerContainer>
      <SortFilter open={ isOpen } onClose={ handleOpenFitler } onlySort toggleFilter={ toggleFilter } />
    </Content>
  )
}

export default connector(RecommendationHeader)
