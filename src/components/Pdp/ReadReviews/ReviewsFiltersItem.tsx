import React from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'

const Container = styled.View`
  height: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.spacing(2)};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1;
  border-color: ${({ theme }) => theme.palette.grey5};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  align-self: flex-start;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.palette.grey5 : theme.palette.white};  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Label = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2};
  margin-right: 4;
  ${({ isBold }) => isBold && 'font-weight: bold'};

`

const Icon = styled.Image`
  width: 16;
  height: 16;
  ${({ grey, theme }) => grey && `tint-color: ${theme.palette.grey3}`};

`

interface Props {
  text: string
  isSelected?: boolean
}

const ReviewsFilterItem = ({ text, isSelected }: Props) => {
  return (
    <Container isSelected={isSelected}>
      <Label isBold={isSelected}>{text}</Label>
      <Icon
        source={isSelected ? icons.actionClose : icons.down}
        grey={!isSelected}
      />
    </Container>
  )
}

export default ReviewsFilterItem
