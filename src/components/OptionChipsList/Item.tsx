import React from 'react'
import styled from 'styled-components/native'

import { icons } from 'assets/images'

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border: ${(props) => props.theme.palette.grey5};
  border-radius: 86;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  background-color: ${({ selected, theme }) =>
    selected ? theme.palette.grey5 : theme.palette.white};
  padding-vertical: ${({ theme }) => theme.spacing(1)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
`

const NameText = styled.Text`
  ${({ selected, theme }) =>
    selected ? theme.typography.subTitle2 : theme.typography.body2}
`

const Icon = styled.Image`
  height: ${({ theme }) => theme.spacing(2)};
  width: ${({ theme }) => theme.spacing(2)};
  margin-left: ${({ theme }) => theme.spacing(0.5)};
  margin-right: ${({ theme }) => -theme.spacing(0.5)};
`

export interface ChipModel {
  name: string
  id: string
  selected?: boolean
  dropdownIcon?: boolean
  onPressOverride?: () => void
}

interface OwnProps {
  chip: ChipModel
  onSelect: (id: string, name: string) => void
  disableIcons?: boolean
  selected?: boolean
}

type Props = OwnProps

const Item = ({ chip, onSelect, disableIcons, selected }: Props) => {
  return (
    <Container
      selected={selected || chip.selected}
      onPress={() => {
        chip.onPressOverride
          ? chip.onPressOverride()
          : onSelect(chip.id, chip.name)
      }}
    >
      <NameText selected={chip.selected}>{chip.name}</NameText>
      {((selected || chip.selected) && !disableIcons && (
        <Icon source={icons.actionClose} />
      )) ||
        (chip.dropdownIcon && <Icon source={icons.chevronDown} />)}
    </Container>
  )
}

export default Item
