import React, { memo } from 'react'
import styled from 'styled-components/native'


interface OwnProps {
  errorText1: string
  errorText2: string
}

const EmptyStateContainer = styled.View`
  width: 100%;
`
const ScrollViewContainer = styled.ScrollView`
  flex-grow: 0;
`

interface EmptyTextProps {
  gutterBottom?: boolean
}

const EmptyStateText = styled.Text<EmptyTextProps>`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ gutterBottom, theme }) => (gutterBottom ? theme.spacing(2) : 0)};
`
type Props = OwnProps

const CollectionEmptyState = memo(({ errorText1, errorText2 }: Props) => (
  <ScrollViewContainer>
    <EmptyStateContainer>
      <EmptyStateText gutterBottom>{errorText1}</EmptyStateText>
      <EmptyStateText numberOfLines={ 2 }>{errorText2}</EmptyStateText>
    </EmptyStateContainer>
  </ScrollViewContainer>
))


export default CollectionEmptyState
