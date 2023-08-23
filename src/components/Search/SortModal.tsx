import React from 'react'
import styled from 'styled-components/native'

import DraggableModal from 'src/controls/Modal/BottomDraggable'
import _OptionChipsList, { ChipGroupModel } from 'src/components/OptionChipsList'

const OptionChipsList = styled(_OptionChipsList)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const HeaderText = styled.Text`
  align-self: center;
  ${({ theme }) => theme.typography.subTitle1}
`

interface OwnProps {
  isOpen: boolean
  onDismiss: () => void
  sortChipGroup: ChipGroupModel
  onApplySortTerm: (sortTerm: string) => void
}

type Props = OwnProps

const SearchSortModal = ({ isOpen, onDismiss, sortChipGroup, onApplySortTerm }: Props) => {
  return (
    <DraggableModal
      isOpen={ isOpen }
      onDismiss={ onDismiss }
      fullContent
      header={ (
        <HeaderText>Sort By</HeaderText>
      ) }
    >
      <OptionChipsList
        chips={ sortChipGroup }
        onSelect={ onApplySortTerm }
        list
        disableIcons
      />
    </DraggableModal>
  )
}

export default SearchSortModal
