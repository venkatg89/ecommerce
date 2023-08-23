import React from 'react'
import styled from 'styled-components/native'
import { icons } from 'assets/images'

const Container = styled.TouchableOpacity`
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
    isSelected ? theme.palette.grey5 : theme.palette.white};
  margin-right: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Label = styled.Text`
  font-size: 14;
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.subTitle2};
  margin-right: 4;
  ${({ isBold }) => isBold && 'font-weight: bold'};
`

const Icon = styled.Image`
  width: 16;
  height: 16;
  ${({ grey, theme }) => grey && `tint-color: ${theme.palette.grey3}`};
`

interface Props {
  withIcon: boolean
  text: string
  isSelected: boolean
  onSelect: () => void
}

const TagLabel = ({ withIcon, text, isSelected, onSelect }: Props) => {
  return (
    <Container isSelected={isSelected} onPress={onSelect}>
      <Label isBold={isSelected}>{text}</Label>
      {withIcon && (
        <Icon
          source={isSelected ? icons.checkboxCheckedCircle : icons.addCircle}
          grey={!isSelected}
        />
      )}
    </Container>
  )
}

export default TagLabel
