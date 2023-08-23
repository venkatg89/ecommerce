import React, { useState, useCallback } from 'react'
import styled from 'styled-components/native'

import LoadingIndicator from 'src/controls/progress/LoadingIndicator'
import Button from 'src/controls/Button'
import SortFilter from 'src/controls/SortFilter/CommunitySortFilter'

import { icons } from 'assets/images'
import { RecommendationSortNames } from 'src/models/Communities/QuestionModel'

const FilterContainer = styled.View`
  flex-direction: row;
  align-items:center;
`

const Icon = styled.Image`
  width: ${({ theme }) => theme.spacing(3)};
  height: ${({ theme }) => theme.spacing(3)};
`
const TotalResponse = styled.Text`
  ${({ theme }) => theme.typography.body2};
  color: ${({ theme }) => theme.palette.grey2};
  flex: 1;
  text-align: center;
`

const HeaderText = styled.Text`
  ${({ theme }) => theme.typography.heading2};
  color: ${({ theme }) => theme.palette.grey1};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

interface OwnProps {
  sort: RecommendationSortNames
  onChangeSort: (_:any, sort: RecommendationSortNames) => void
  fetching: boolean
  totalPosts: number
}

type Props = OwnProps

const QaListHeader = ({ sort, onChangeSort, fetching, totalPosts }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const toggleFilter = useCallback(() => {
    setOpen(!open)
  }, [open])


  return (
    <>
      <HeaderContainer>
        <HeaderText>Questions & Answers</HeaderText>
        <FilterContainer>
          <Button icon onPress={ toggleFilter } disabled={ totalPosts < 1 }>
            <Icon source={ icons.sort } />
          </Button>
          <TotalResponse>{`${totalPosts} questions and answers`}</TotalResponse>
        </FilterContainer>
      </HeaderContainer>
      {fetching &&
      <LoadingIndicator isLoading={ fetching } />
      }
      <SortFilter
        onlySort
        currentSort={ sort }
        open={ open }
        onClose={ toggleFilter }
        toggleFilter={ onChangeSort }
      />
    </>
  )
}

export default QaListHeader
