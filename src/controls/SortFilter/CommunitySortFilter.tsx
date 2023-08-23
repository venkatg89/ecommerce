import React, { useContext, useState, useEffect, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components/native'
import _Modal from 'react-native-modal'
import DeviceInfo from 'react-native-device-info'

import Button from 'src/controls/Button'
import { RecommendationFilterNames, RecommendationSortNames } from 'src/models/Communities/QuestionModel'
import { CONTENT_HORIZONTAL_PADDING, useResponsiveDimensions } from 'src/constants/layout'

import { icons } from 'assets/images'

interface ButtonProps {
  center?: boolean
  left?: boolean
}

export const Modal = styled(_Modal)`
  justify-content: flex-end;
  margin-horizontal: 0px;
  margin-bottom: 0px;
`

interface ModalContainerProps {
  currentWidth: number
}

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: ${({ theme }) => theme.spacing(3)};
`

const ModalContainer = styled.View<ModalContainerProps>`
  background-color: ${({ theme }) => theme.palette.white};
  min-height: ${({ theme }) => theme.spacing(35)};
  padding-horizontal: ${({ theme }) => theme.spacing(2)};
  border-radius: 12;
  position: relative;
  ${({ currentWidth }) => DeviceInfo.isTablet() && `margin-horizontal: ${CONTENT_HORIZONTAL_PADDING(currentWidth)};`}
`

const Title = styled.Text`
  ${({ theme }) => theme.typography.subTitle1};
  color: ${({ theme }) => theme.palette.grey2};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const Handle = styled.View`
  position: relative;
  top: ${({ theme }) => theme.spacing(1)};
  left: 40%;
  width: 20%;
  border-color: ${({ theme }) => theme.palette.grey2};
  border-width: 1;
  border-radius: 1;
`
const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const RoundButton = styled(Button)<ButtonProps>`
  border-radius: 16;
  height: ${({ theme }) => theme.spacing(4)};
  ${({ center, theme }) => (center ? `margin-horizontal: ${theme.spacing(1)};` : '')}
  ${({ theme, selected }) => (!selected ? `border-color: ${theme.palette.grey4};` : '')}
  padding: 0px ${({ theme }) => theme.spacing(2)}px;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`

const FitlerText = styled.Text`
  ${({ theme }) => theme.typography.body1};
  color: ${({ theme }) => theme.palette.grey1};
  padding-right: ${({ theme }) => theme.spacing(3)};
`

interface Props {
  open: boolean
  onClose: () => void
  toggleFilter?: (filter, sort) => void
  currentFilter?: RecommendationFilterNames
  onlySort?: boolean
  currentSort?: RecommendationSortNames
}

const filterOptions = Object.values(RecommendationFilterNames)
  .filter(option => option !== RecommendationFilterNames.CATEGORY)
  .filter(option => option !== RecommendationFilterNames.ALL)
  .sort()

const sortOptions = Object.keys(RecommendationSortNames)

const SortFilter = ({ open, onClose, toggleFilter = () => {}, currentFilter, onlySort, currentSort }: Props) => {
  const { palette } = useContext(ThemeContext)
  const { width } = useResponsiveDimensions()
  const [filter, setFilter] = useState<RecommendationFilterNames>(RecommendationFilterNames.MY_COMMUNITIES)
  const [sort, setSort] = useState<RecommendationSortNames>(RecommendationSortNames.RECENT)
  useEffect(() => {
    if (currentFilter) {setFilter(currentFilter)}
  }, [currentFilter])

  useEffect(() => {
    if (currentSort) {setSort(currentSort)}
  }, [currentSort])

  const onPressFormat = (tab: RecommendationFilterNames) => setFilter(tab)
  const onPressSort = (tab: RecommendationSortNames) => setSort(tab)

  const getTextStyle = (tab, current) => {
    const textStyle = { textTransform: 'capitalize' }
    if (tab === current) {return textStyle}
    return { color: palette.grey3, ...textStyle }
  }

  const applyFilter = () => {
    toggleFilter(filter, sort)
    if (currentFilter) {setFilter(currentFilter)}
  }

  const handleReset = useCallback(() => {
    setFilter(RecommendationFilterNames.MY_COMMUNITIES)
    setSort(RecommendationSortNames.RECENT)
  }, [])

  const getFormatText = useCallback((field) => {
    switch (field) {
      case RecommendationFilterNames.MY_POST:
        return 'My Posts'
      case RecommendationFilterNames.MY_COMMUNITIES:
        return 'My Community'
      default:
        return ''
    }
  }, [RecommendationFilterNames])

  return (
    <Modal
      isVisible={ open }
      backdropOpacity={ 0.5 }
      swipeDirection={ ['down'] }
      onSwipeComplete={ onClose }
      onModalHide={ applyFilter }
      onBackButtonPress={ onClose }
      onBackdropPress={ onClose }
    >
      <ModalContainer currentWidth={ width }>
        <Handle />
        <HeaderContainer>
          <Button linkGreen onPress={ handleReset } size="small">
            Reset
          </Button>
          <FitlerText>Filter</FitlerText>
          <Button icon onPress={ onClose }>
            <Icon source={ icons.actionClose } />
          </Button>
        </HeaderContainer>
        <Title>Sort by</Title>
        <ButtonsContainer>
          {sortOptions.map((option, index) => (
            <RoundButton
              center={ index === 1 }
              key={ option }
              variant="outlined"
              selected={ RecommendationSortNames[option] === sort }
              textStyle={ getTextStyle(RecommendationSortNames[option], sort) }
              onPress={ () => onPressSort(RecommendationSortNames[option]) }
            >
              {option}
            </RoundButton>
          ))}
        </ButtonsContainer>

        {!onlySort && (
        <>
          <Title>Format</Title>
          <ButtonsContainer>
            {filterOptions.map((option, index) => (
              <RoundButton
                center={ index === 1 }
                key={ option }
                variant="outlined"
                onPress={ () => onPressFormat(option) }
                selected={ filter === option }
                textStyle={ getTextStyle(option, filter) }
              >
                {getFormatText(option)}
              </RoundButton>
            ))}
          </ButtonsContainer>
        </>
        )}
      </ModalContainer>
    </Modal>
  )
}

export default SortFilter
