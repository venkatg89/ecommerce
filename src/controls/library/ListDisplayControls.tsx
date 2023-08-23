import React, { useState } from 'react'
import styled from 'styled-components/native'

import SortFilter from 'src/controls/SortFilter/BookListSortFilter'
import countLabelText from 'src/helpers/countLabelText'

import { icons } from 'assets/images'
import { BookListSortNames, BookListFormatNames } from 'src/models/MyBooks/BookListSortFilter'
import { ReadingStatus } from 'src/models/ReadingStatusModel'

export const Title = styled.Text`
  color: ${({ theme }) => theme.palette.grey1};
  ${({ theme }) => theme.typography.heading2}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

export const SearchContainer = styled.View`
  margin-top: 18;
`

const FilterBarContainer = styled.View`
  margin-top: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  flex-direction: row;
  justify-content: space-between;
`
interface IconProps {
  disabled?: boolean
}

const FilterBarIcon = styled.Image<IconProps>`
  width: 24;
  height: 24;
  ${({ theme, disabled }) => (disabled ? `tint-color: ${theme.palette.disabledGrey}` : '')}
`

const BookCount = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
  align-self: center;
`

const FilterBarButton = styled.TouchableOpacity``


interface FilterBarProps {
  isGrid: boolean
  count: number
  onToggleGrid: () => void
  filterCallback: (sort: BookListSortNames, format: BookListFormatNames, bookStatus: ReadingStatus[]) => void
  disabledFilters?: any
  currentFormat?: BookListFormatNames
  currentSort?: BookListSortNames
  currentBookStatus?: ReadingStatus[]
  disableStatus?: boolean
  defaultSort?: BookListSortNames
  isBusy?: boolean
  disableFormat?: boolean
}

export const FilterBar =
({ isGrid, onToggleGrid, filterCallback, count, disabledFilters, currentBookStatus, currentFormat, currentSort, disableStatus = false, defaultSort, isBusy, disableFormat }: FilterBarProps) => {
  const [open, setOpen] = useState(false)
  const openFilterModal = () => setOpen(true)
  const closeFilterModal = () => setOpen(false)
  const disableButton = count === 0 || isBusy
  return (
    <FilterBarContainer>
      <FilterBarButton
        disabled={ disableButton }
        accessibilityLabel="sort and filter books"
        accessibilityRole="button"
        onPress={ openFilterModal }
      >
        <FilterBarIcon source={ icons.sort } disabled={ disableButton } />
      </FilterBarButton>
      <BookCount>{ countLabelText(count, 'book', 'books') }</BookCount>
      <FilterBarButton
        disabled={ disableButton }
        accessibilityLabel={ isGrid ? 'show list view' : 'show grid view' }
        accessibilityRole="button"
        onPress={ onToggleGrid }
      >
        {isGrid
          ? <FilterBarIcon source={ icons.listView } disabled={ disableButton } />
          : <FilterBarIcon source={ icons.gridView } disabled={ disableButton } />
        }
      </FilterBarButton>
      <SortFilter
        disableFormat={ disableFormat }
        isOpen={ open }
        onClose={ closeFilterModal }
        filterCallback={ filterCallback }
        disabledFilters={ disabledFilters }
        currentSort={ currentSort }
        currentFormat={ currentFormat }
        currentBookStatus={ currentBookStatus }
        disableStatus={ disableStatus }
        defaultSort={ defaultSort }
      />
    </FilterBarContainer>
  )
}


const PublicPrivateIndicator = styled.View`
  flex-direction: row;
  align-items: center;
`

const PublicPrivateImage = styled.Image`
  height: 16;
  width: 16;
  margin-right: ${({ theme }) => theme.spacing(1)};
`

const PublicPrivateText = styled.Text`
  color: ${({ theme }) => theme.palette.grey2};
  ${({ theme }) => theme.typography.body2}
`

interface PublicIndicatorProps {
  isPublic?: boolean
}

export const PublicIndicator = ({ isPublic }: PublicIndicatorProps) => (
  <React.Fragment>
    { isPublic !== undefined && (
      <PublicPrivateIndicator>
        { !isPublic && <PublicPrivateImage source={ icons.lockClosed } /> }
        { !isPublic && <PublicPrivateText>Private list</PublicPrivateText>}
      </PublicPrivateIndicator>
    ) }
  </React.Fragment>
)
