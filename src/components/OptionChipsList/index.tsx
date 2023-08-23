import React, { useMemo } from 'react'
import styled from 'styled-components/native'

import Item, { ChipModel } from './Item'

const Container = styled.View`
  flex: 1;
`

const ScrollContainer = styled.ScrollView`
  margin-top: ${({ theme }) => theme.spacing(1)};
`

const NonScrollableContainer = styled.View`
  ${({ list, theme }) =>
    !list
      ? `
 flex-direction: row;
 flex-wrap: wrap;
 margin-right: ${-theme.spacing(1)};
 margin-top: ${theme.spacing(1)};
 `
      : 'align-items: flex-start;'}
`

const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
`

export interface ChipGroupModel {
  name?: string
  chips: ChipModel[]
}

interface OwnProps {
  style?: any
  chips: ChipGroupModel
  onViewAll?: () => void
  onSelect: (id: string) => void
  scrollable?: boolean
  list?: boolean
  disableIcons?: boolean
}

type Props = OwnProps

const ChipList = ({
  style,
  chips,
  onViewAll,
  onSelect,
  scrollable,
  list,
  disableIcons,
}: Props) => {
  const Content = useMemo(
    () => (scrollable ? ScrollContainer : NonScrollableContainer),
    [scrollable],
  )
  return (
    <Container style={style}>
      {chips.name && (
        <HeaderContainer>
          <HeaderText>{chips.name}</HeaderText>
        </HeaderContainer>
      )}
      <Content horizontal showsHorizontalScrollIndicator={false} list={list}>
        {chips.chips.map((chip) => (
          <Item
            key={chip.id}
            chip={chip}
            onSelect={onSelect}
            disableIcons={disableIcons}
          />
        ))}
      </Content>
    </Container>
  )
}

export { ChipModel }

export default ChipList
