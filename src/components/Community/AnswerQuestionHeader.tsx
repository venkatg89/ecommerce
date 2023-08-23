import React from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Content = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

const DescriptionText = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
`

interface Props {
  questionTitle: string
}

const AnswerQuestionHeader = ({ questionTitle }:Props) => (
  <Container>
    <Title>Add your recommendation</Title>
    <Content>{ questionTitle }</Content>
    <DescriptionText>Find your book by using the search box below.</DescriptionText>
  </Container>
)

export default AnswerQuestionHeader
