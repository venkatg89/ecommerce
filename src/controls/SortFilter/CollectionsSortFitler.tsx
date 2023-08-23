import React, { useState, useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/native'

import BottomDraggable from 'src/controls/Modal/BottomDraggable'
import Button from 'src/controls/Button'

import { CollectionPrivacyNames, CollectionsSortNames } from 'src/models/CollectionModel'

import { icons } from 'assets/images'

interface OwnProps {
  open: boolean
  onDismiss: () => void
  applyFilter: (sort: CollectionsSortNames, filter: Nullable<CollectionPrivacyNames>) => void
  isLocal: boolean
}

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`
const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-right: ${({ theme }) => theme.spacing(3)};
`

const FilterTitle = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface ButtonProps {
  center?: boolean
}

const RoundButton = styled(Button)<ButtonProps>`
  border-radius: 16;
  height: ${({ theme }) => theme.spacing(4)};
  ${({ center, theme }) => (center ? `margin-horizontal: ${theme.spacing(1)};` : '')}
  ${({ theme, selected }) => (!selected ? `border-color: ${theme.palette.grey4};` : '')}
  padding: 0px ${({ theme }) => theme.spacing(2)}px;
`

type Props = OwnProps

const CollectionsSortFilter = ({ open, onDismiss, applyFilter, isLocal }: Props) => {
  const { palette } = useContext(ThemeContext)
  const [filter, setFilter] = useState<Nullable<CollectionPrivacyNames>>(null)
  const [sort, setSort] = useState<CollectionsSortNames>(CollectionsSortNames.DATE_ADDED)

  const handleClose = useCallback(() => {
    onDismiss()
    applyFilter(sort, filter)
  }, [open, sort, filter])

  const handleReset = useCallback(() => {
    setFilter(null)
    setSort(CollectionsSortNames.DATE_ADDED)
  }, [])

  const getTextStyle = useCallback((tab, current) => {
    const textStyle = { textTransform: 'capitalize' }
    if (tab === current) {return textStyle}
    return { color: palette.grey3, ...textStyle }
  }, [])

  const handleSetSort = useCallback((option: CollectionsSortNames) => () => {
    setSort(option)
  }, [sort])

  const handleSetFilter = useCallback((option: CollectionPrivacyNames) => () => {
    setFilter(option)
  }, [filter])

  return (
    <BottomDraggable
      isOpen={ open }
      onDismiss={ handleClose }
      hideCloseButton
    >
      <HeaderContainer>
        <Button linkGreen onPress={ handleReset } size="small">
          Reset
        </Button>
        <HeaderText>Fitler</HeaderText>
        <Button icon onPress={ handleClose }>
          <Icon source={ icons.actionClose } />
        </Button>
      </HeaderContainer>

      <FilterTitle>Sort by</FilterTitle>
      <ButtonsContainer>
        {Object.values(CollectionsSortNames).map((option, index) => (
          <RoundButton
            key={ option }
            center={ index === 1 }
            variant="outlined"
            selected={ option === sort }
            onPress={ handleSetSort(option) }
            textStyle={ getTextStyle(option, sort) }
          >
            {option.replace('_', ' ')}
          </RoundButton>
        ))}
      </ButtonsContainer>

      {isLocal && (
      <>
        <FilterTitle>Sharing</FilterTitle>
        <ButtonsContainer>
          {Object.values(CollectionPrivacyNames).map((option, index) => (
            <RoundButton
              key={ option }
              center={ index === 1 }
              variant="outlined"
              selected={ option === filter }
              onPress={ handleSetFilter(option) }
              textStyle={ getTextStyle(option, filter) }
            >
              {option}
            </RoundButton>
          ))}
        </ButtonsContainer>
      </>
      )}
    </BottomDraggable>
  )
}

export default CollectionsSortFilter
