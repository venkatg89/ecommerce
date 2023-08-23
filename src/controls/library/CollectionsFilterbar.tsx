import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'

import Button from 'src/controls/Button'

import countLabelText from 'src/helpers/countLabelText'

import { icons } from 'assets/images'
import CollectionsSortFilter from 'src/controls/SortFilter/CollectionsSortFitler'

import { CollectionPrivacyNames, CollectionsSortNames } from 'src/models/CollectionModel'

interface OwnProps {
  count: number
  applyFilter: (sort: CollectionsSortNames, filter: Nullable<CollectionPrivacyNames>) => void
  isLocal: boolean
}


const FitlerBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
`

const LabelText = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
  flex: 1;
  text-align: center;
  padding-right: ${({ theme }) => theme.spacing(2)};
`

interface IconProps {
  disabled?: boolean
}

const FilterBarIcon = styled.Image<IconProps>`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
  ${({ theme, disabled }) => (disabled ? `tint-color: ${theme.palette.disabledGrey}` : '')}
`
type Props = OwnProps

const CollectionsFilterbar = ({ count, applyFilter, isLocal }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const handleOpenFilter = useCallback(() => {
    setOpen(true)
  }, [open])
  const handleCloseFilter = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <FitlerBarContainer>
        <Button
          icon
          onPress={ handleOpenFilter }
          disabled={ count < 1 }
        >
          <FilterBarIcon disabled={ count < 1 } source={ icons.sort } />
        </Button>
        <LabelText>{ countLabelText(count, 'list', 'lists')}</LabelText>
      </FitlerBarContainer>
      <CollectionsSortFilter open={ open } onDismiss={ handleCloseFilter } applyFilter={ applyFilter } isLocal={ isLocal } />
    </>
  )
}

export default CollectionsFilterbar
